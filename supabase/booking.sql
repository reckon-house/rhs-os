-- ── The booking table and the one guarantee it exists to make ────────
--
-- Run this once in the Supabase SQL editor. It follows the shape
-- open_thread already established: the rule lives in the DATABASE, not
-- in the route, so it holds for anything that reaches the table rather
-- than only for callers who came through the front door.
--
-- THE WHOLE POINT IS THE UNIQUE INDEX. Two people on the page at once
-- both clicking the same half-hour is the failure that matters, and no
-- amount of hiding the slot after the first click prevents it: the
-- second person's page does not know yet. A check-then-insert in the
-- route does not prevent it either, because both requests pass the
-- check before either inserts. Uniqueness on the slot is the only
-- version that cannot be raced.

create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  -- The slot, stored as an instant. The page authors house-local times
  -- and converts on the way in, so a daylight-saving change moves the
  -- wall clock and never the row.
  slot_at     timestamptz not null,
  name        text        not null,
  email       text        not null,
  note        text,
  -- The thread this booking opened, so a reply lands in the same inbox
  -- as every other message rather than in a second system.
  thread_token text,
  created_at  timestamptz not null default now()
);

-- One booking per instant. This is the guarantee.
create unique index if not exists bookings_slot_unique
  on public.bookings (slot_at);

-- Reads go through the RPC below, never straight at the table: a
-- visitor may learn that a slot is taken and must not learn who took
-- it. RLS off plus no grants means the anon key cannot select at all.
alter table public.bookings enable row level security;

-- ── which slots are gone ─────────────────────────────────────────────
-- Returns instants only. No names, no emails, no counts of anything a
-- stranger has no business seeing.
create or replace function public.taken_slots(p_from timestamptz, p_to timestamptz)
returns table (slot_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select b.slot_at
  from public.bookings b
  where b.slot_at >= p_from and b.slot_at < p_to
  order by b.slot_at
$$;

-- ── claim one ────────────────────────────────────────────────────────
-- Returns 'ok', 'taken', or 'rate'. The insert races and loses
-- honestly: unique_violation is the second person, and they are told
-- so rather than being handed a silent failure or somebody else's row.
--
-- The hourly ceiling is here for the same reason open_thread's is:
-- a booking form is a mail-sending endpoint with a database behind it,
-- and both are worth a limit that holds wherever the call came from.
create or replace function public.claim_slot(
  p_slot  timestamptz,
  p_name  text,
  p_email text,
  p_note  text,
  p_token text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  recent int;
begin
  select count(*) into recent
  from public.bookings
  where created_at > now() - interval '1 hour';

  if recent >= 12 then
    return 'rate';
  end if;

  -- A slot in the past is not a slot. The page will not offer one, so
  -- anything arriving here is a stale tab or somebody trying it on.
  if p_slot < now() then
    return 'taken';
  end if;

  begin
    insert into public.bookings (slot_at, name, email, note, thread_token)
    values (p_slot, p_name, p_email, p_note, p_token);
  exception when unique_violation then
    return 'taken';
  end;

  return 'ok';
end
$$;

revoke all on function public.claim_slot(timestamptz, text, text, text, text) from public;
grant execute on function public.claim_slot(timestamptz, text, text, text, text) to anon, authenticated;
revoke all on function public.taken_slots(timestamptz, timestamptz) from public;
grant execute on function public.taken_slots(timestamptz, timestamptz) to anon, authenticated;

-- ── attach the thread, after the fact ────────────────────────────────
-- The claim happens BEFORE the thread opens, because the slot is the
-- only thing that can be lost to a race. That leaves thread_token null
-- for a moment, and this closes it. Deliberately narrow: it can only
-- fill a token that is still null, so it can never move a booking from
-- one thread to another, and it says nothing back.
create or replace function public.link_booking_thread(p_slot timestamptz, p_token text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.bookings
     set thread_token = p_token
   where slot_at = p_slot
     and thread_token is null
$$;

revoke all on function public.link_booking_thread(timestamptz, text) from public;
grant execute on function public.link_booking_thread(timestamptz, text) to anon, authenticated;
