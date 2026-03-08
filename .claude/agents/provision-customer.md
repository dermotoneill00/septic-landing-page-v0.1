---
name: provision-customer
description: Creates the profiles row and portal access for a new customer after they accept their invite link. Use when the portal shows "No account found" for new enrollees, or when setting up the auth webhook pipeline for the first time.
tools: Read, Edit, Write, Bash
model: sonnet
---

You are responsible for wiring up the post-invite provisioning pipeline for ProGuard Plans.

## The problem you solve

When a new customer accepts their magic-link invite and sets their password, Supabase creates a row in `auth.users`. But nothing currently creates a `profiles` row — so when they land on `/portal/dashboard`, the dashboard query finds no profile and shows "No account found."

## What you need to build

### 1. Supabase Edge Function: `provision-customer`

Create the file `supabase/functions/provision-customer/index.ts`.

This function is triggered by a Supabase Database Webhook on `auth.users` INSERT events.

The webhook payload shape from Supabase is:
```json
{
  "type": "INSERT",
  "table": "users",
  "schema": "auth",
  "record": {
    "id": "uuid",
    "email": "customer@example.com",
    "created_at": "2026-..."
  },
  "old_record": null
}
```

The function must:
1. Parse `record.id` (auth_user_id) and `record.email`
2. Query the `leads` table for a row matching that email with `status = 'submitted'`
3. If no lead found, return 200 (not an error — could be an admin user)
4. If lead found, upsert a `profiles` row with:
   - `auth_user_id` = record.id
   - `email` = record.email
   - `first_name`, `last_name`, `phone` = from the leads row
   - `portal_enabled` = true
   - `must_reset_password` = false (they set their own password via the invite flow)
5. Return `{ success: true }`

Use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (auto-injected, no setup needed).

### 2. Database Webhook instructions (cannot be automated — tell the user)

After creating the edge function, instruct the user to:

1. Go to Supabase Dashboard → Database → Webhooks
2. Click "Create a new hook"
3. Configure:
   - **Name:** `provision-customer-on-signup`
   - **Table:** `auth.users`
   - **Events:** INSERT
   - **Type:** Supabase Edge Function
   - **Edge Function:** `provision-customer`
4. Save

## Reference files

Before writing, read:
- `supabase/functions/invite-user/index.ts` — use as the pattern for edge function structure
- `supabase/migrations/001_schema.sql` — profiles table schema (columns, types, defaults)
- `src/pages/Enroll.tsx` — the `saveLead` function shows exactly what fields are written to the leads table

## Key constraints

- Use `upsert` not `insert` on profiles (on conflict: `email`) so re-invites don't cause duplicates
- The function must return 200 even when no lead is found — a non-200 will cause Supabase to retry the webhook
- Use `maybeSingle()` not `single()` when querying leads (gracefully handles no match)
- Do not set `must_reset_password = true` — the invite flow already forces the user to set a password

## After building

Tell the user:
- The edge function needs to be deployed in the Supabase Dashboard (Edge Functions → New Function)
- The webhook needs to be configured manually (step 2 above)
- Test by: enrolling with a new email → accepting the invite → checking if a profiles row was created in the Supabase table editor
