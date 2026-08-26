# The database, and how to stand it back up

Two files, run in this order in the Supabase SQL editor:

1. `messages.sql` — threads, messages, and the house key
2. `booking.sql`  — the calendar, which links to a thread

Then set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel (production)
and in `.env.local`, and redeploy. Environment changes do not reach a
deployment that already exists.

## Why messages.sql is a reconstruction

It was written in the dashboard and never committed. On 26 Aug 2026 the
project holding it was deleted, and `baxswjfgrkwqxyixiolp.supabase.co`
began returning NXDOMAIN — taking every thread with it, and breaking
the contact form silently, because both the site and the booking route
read the same two environment variables.

The file now in the repo is derived from the six calls the application
makes, so it satisfies what the callers expect. It is not the original
and nothing recovers the lost threads.

**Everything schema-shaped goes in this directory from now on.** A
table that exists only in a dashboard is one deleted project away from
being unrecoverable, and there is no warning before that happens.

## Checking it worked

```bash
curl -s -X POST https://reckon.house/api/book \
  -H 'Content-Type: application/json' \
  -d '{"at":"1999-01-01T00:00:00.000Z","name":"probe","email":"probe@reckon.house"}'
```

- `400 "That time isn't open"` — reached the guard, database fine
- `500 "That didn't save"` — the database rejected it; the reason is in
  the Vercel runtime log as `[booking] claim_slot failed`
- `503 "Booking is not connected yet"` — the environment variables are
  missing from that deployment
