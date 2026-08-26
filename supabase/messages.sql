-- ── The message store: threads, their messages, and the house key ───
--
-- RECONSTRUCTED FROM THE CODE, NOT RECOVERED. The original was written
-- in the Supabase dashboard and never committed, and the project it
-- lived in was deleted — baxswjfgrkwqxyixiolp.supabase.co now returns
-- NXDOMAIN, taking every thread with it. What follows is derived from
-- the six calls the application actually makes, so it satisfies the
-- contract those callers expect. It is not guaranteed to match the
-- original column-for-column, and nothing here restores lost data.
--
-- The callers, and where they live:
--   open_thread            src/lib/messages.ts:111   contact form, /api/book
--   read_thread            src/lib/messages.ts:140   /thread/[token]
--   append_visitor_message src/lib/messages.ts:160   the thread's reply box
--   house_inbox            scripts/inbox.mjs:58      npm run inbox
--   house_reply            scripts/inbox.mjs:96      npm run inbox -- reply
--   house_mark_emailed     scripts/inbox.mjs:123     after a real send
--
-- NO SERVICE KEY, and that is the design rather than an omission. The
-- website and the operator CLI both use the publishable key; writing as
-- the house additionally needs HOUSE_KEY, whose SHA-256 is the only
-- copy stored here. A leaked HOUSE_KEY lets someone post into a thread
-- whose token they already hold. It does not read, enumerate, or reach
-- another table.

create extension if not exists pgcrypto with schema extensions;

-- ── tables ──────────────────────────────────────────────────────────
-- The token IS the capability: 16 random bytes, hex, and the only way
-- into a thread. Indexed unique because every read is a lookup by it.
create table if not exists public.threads (
  id          uuid primary key default gen_random_uuid(),
  token       text not null unique
                default encode(extensions.gen_random_bytes(16), 'hex'),
  name        text check (name is null or char_length(name) <= 120),
  email       text check (email is null or char_length(email) <= 254),
  -- what they had asked the house before writing in, so a reply has the
  -- same context the visitor had. Capped at 24 by the caller.
  transcript  jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.threads(id) on delete cascade,
  -- Written by the functions, never passed in. That is what stops any
  -- public path from recording a message as the house.
  author      text not null check (author in ('visitor', 'house')),
  body        text not null check (char_length(body) between 1 and 4000),
  -- Stamped only on a confirmed send, so a failed notification can be
  -- retried rather than silently lost. See scripts/inbox.mjs:123.
  emailed_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists messages_thread_idx
  on public.messages (thread_id, created_at);

-- One row, holding the SHA-256 of HOUSE_KEY. Never the key itself.
create table if not exists public.house_secret (
  id      int primary key default 1 check (id = 1),
  digest  text not null
);

-- Everything goes through the functions below. RLS on with no policies
-- and no grants means the publishable key cannot read these directly.
alter table public.threads      enable row level security;
alter table public.messages     enable row level security;
alter table public.house_secret enable row level security;

-- ── open a thread ───────────────────────────────────────────────────
-- Atomic on purpose: if the message violates a constraint the thread
-- rolls back with it, so a contact is never recorded with nothing said.
-- Raises on the ceiling, and the caller matches /rate limited/i to tell
-- a visitor to try again rather than that something broke.
create or replace function public.open_thread(
  p_name       text,
  p_email      text,
  p_body       text,
  p_transcript jsonb
)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id    uuid;
  v_token text;
  recent  int;
begin
  select count(*) into recent
  from public.threads
  where created_at > now() - interval '1 hour';

  if recent >= 20 then
    raise exception 'rate limited';
  end if;

  insert into public.threads (name, email, transcript)
  values (
    nullif(left(coalesce(p_name, ''), 120), ''),
    nullif(left(coalesce(p_email, ''), 254), ''),
    -- only the first 24 entries, and only if an array actually arrived
    case
      when jsonb_typeof(p_transcript) = 'array'
        then (select coalesce(jsonb_agg(e), '[]'::jsonb)
              from (select e from jsonb_array_elements(p_transcript) e limit 24) s)
      else '[]'::jsonb
    end
  )
  returning id, token into v_id, v_token;

  insert into public.messages (thread_id, author, body)
  values (v_id, 'visitor', left(p_body, 4000));

  return v_token;
end
$$;

-- ── read one thread ─────────────────────────────────────────────────
-- THE EMAIL IS NOT IN HERE. Anyone holding the token can read this, and
-- the address is the one thing on the thread that is not theirs to see.
create or replace function public.read_thread(p_token text)
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'name',       t.name,
    'transcript', t.transcript,
    'created_at', t.created_at,
    'messages',   coalesce((
      select json_agg(json_build_object(
               'author', m.author, 'body', m.body, 'created_at', m.created_at
             ) order by m.created_at)
      from public.messages m where m.thread_id = t.id
    ), '[]'::json)
  )
  from public.threads t
  where t.token = p_token
$$;

-- ── the visitor adds to their own thread ────────────────────────────
-- The author is written here, never passed. Returns whether it landed.
create or replace function public.append_visitor_message(
  p_token text,
  p_body  text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  recent int;
begin
  select id into v_id from public.threads where token = p_token;
  if v_id is null then return false; end if;

  select count(*) into recent
  from public.messages
  where thread_id = v_id
    and author = 'visitor'
    and created_at > now() - interval '1 hour';
  if recent >= 20 then return false; end if;

  insert into public.messages (thread_id, author, body)
  values (v_id, 'visitor', left(p_body, 4000));
  return true;
end
$$;

-- ── the house side, gated on HOUSE_KEY ──────────────────────────────
create or replace function public.house_ok(p_secret text)
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1 from public.house_secret
    where digest = encode(extensions.digest(coalesce(p_secret, ''), 'sha256'), 'hex')
  )
$$;

-- Everything waiting, newest activity first. This one DOES carry the
-- email: it is the operator's own inbox, behind the key.
create or replace function public.house_inbox(p_secret text)
returns json
language sql
security definer
set search_path = public
as $$
  select case when public.house_ok(p_secret) then coalesce((
    select json_agg(row order by row->>'last_at' desc)
    from (
      select json_build_object(
        'token',      t.token,
        'name',       t.name,
        'email',      t.email,
        'transcript', t.transcript,
        'created_at', t.created_at,
        'last_at',    coalesce((select max(m.created_at) from public.messages m
                                where m.thread_id = t.id), t.created_at),
        'messages',   coalesce((
          select json_agg(json_build_object(
                   'author', m.author, 'body', m.body, 'created_at', m.created_at
                 ) order by m.created_at)
          from public.messages m where m.thread_id = t.id
        ), '[]'::json)
      ) as row
      from public.threads t
    ) s
  ), '[]'::json) else '[]'::json end
$$;

-- Answer as the house. Returns the address to notify and the message id
-- to stamp once the mail is actually confirmed sent.
create or replace function public.house_reply(
  p_secret text,
  p_token  text,
  p_body   text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  t public.threads%rowtype;
  v_msg uuid;
begin
  if not public.house_ok(p_secret) then
    return json_build_object('ok', false);
  end if;

  select * into t from public.threads where token = p_token;
  if t.id is null then
    return json_build_object('ok', false);
  end if;

  insert into public.messages (thread_id, author, body)
  values (t.id, 'house', left(p_body, 4000))
  returning id into v_msg;

  return json_build_object(
    'ok', true, 'email', t.email, 'name', t.name, 'message_id', v_msg
  );
end
$$;

-- Stamped only after a real send, so an unstamped reply can be retried.
create or replace function public.house_mark_emailed(
  p_secret     text,
  p_message_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.house_ok(p_secret) then return false; end if;
  update public.messages set emailed_at = now()
   where id = p_message_id and emailed_at is null;
  return found;
end
$$;

-- ── grants ──────────────────────────────────────────────────────────
-- house_ok stays private: it is a helper, not an endpoint, and exposing
-- it would hand out an oracle for guessing the key.
revoke all on function public.house_ok(text) from public, anon, authenticated;

revoke all on function public.open_thread(text, text, text, jsonb) from public;
grant execute on function public.open_thread(text, text, text, jsonb) to anon, authenticated;

revoke all on function public.read_thread(text) from public;
grant execute on function public.read_thread(text) to anon, authenticated;

revoke all on function public.append_visitor_message(text, text) from public;
grant execute on function public.append_visitor_message(text, text) to anon, authenticated;

revoke all on function public.house_inbox(text) from public;
grant execute on function public.house_inbox(text) to anon, authenticated;

revoke all on function public.house_reply(text, text, text) from public;
grant execute on function public.house_reply(text, text, text) to anon, authenticated;

revoke all on function public.house_mark_emailed(text, uuid) from public;
grant execute on function public.house_mark_emailed(text, uuid) to anon, authenticated;

-- ── the one thing left to do by hand ────────────────────────────────
-- Generate a key, keep it in .env.local as HOUSE_KEY, and store only
-- its digest. Run these two locally, not in a shared shell:
--
--   openssl rand -hex 32
--
-- then, with that value pasted in place of PASTE_KEY_HERE:
--
--   insert into public.house_secret (id, digest)
--   values (1, encode(extensions.digest('PASTE_KEY_HERE', 'sha256'), 'hex'))
--   on conflict (id) do update set digest = excluded.digest;
--
-- Without this row every house_* call returns empty, which is the safe
-- direction: the website keeps working and only the operator CLI is
-- locked out.
