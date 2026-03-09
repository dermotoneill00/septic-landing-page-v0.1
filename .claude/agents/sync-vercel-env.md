---
name: sync-vercel-env
description: Syncs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the local .env file to Vercel environment variables, then triggers a redeployment. Use when the deployed site can't reach Supabase, when leads aren't being saved, or when env vars need updating after a Supabase project change.
tools: Read, Bash
model: haiku
---

You sync the frontend Supabase environment variables from the local `.env` file to Vercel, then redeploy.

## What you do

1. Read `.env` to extract `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Ensure the Vercel CLI is available
3. Ensure the user is logged into Vercel
4. Link the project to Vercel if not already linked
5. Push both env vars to all three Vercel environments (production, preview, development)
6. Trigger a production redeployment
7. Report success with the deployment URL

## Step-by-step

### Step 1 — Read the values from .env

Read the file `.env` and extract:
- `VITE_SUPABASE_URL` — the Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — the public anon key

Do NOT touch or expose `SUPABASE_SERVICE_ROLE_KEY` — that is a secret and must never be set as a Vercel env var (it would be baked into the public JS bundle).

### Step 2 — Check Vercel CLI

```bash
vercel --version
```

If not found, install it:
```bash
npm install -g vercel
```

### Step 3 — Check Vercel auth

```bash
vercel whoami
```

If not logged in, run:
```bash
vercel login
```
Then wait for the user to complete the browser-based login and confirm before proceeding.

### Step 4 — Link the project (if needed)

Check if `.vercel/project.json` exists. If not, link it:
```bash
vercel link --yes --project proguard-portal
```

If the project name is different, the `vercel link` command will prompt — follow the prompts to select the correct project.

### Step 5 — Push env vars

Use `printf` to pipe the value non-interactively. Run for each of the three environments:

```bash
printf "VALUE_HERE" | vercel env add VITE_SUPABASE_URL production --force
printf "VALUE_HERE" | vercel env add VITE_SUPABASE_URL preview --force
printf "VALUE_HERE" | vercel env add VITE_SUPABASE_URL development --force

printf "VALUE_HERE" | vercel env add VITE_SUPABASE_ANON_KEY production --force
printf "VALUE_HERE" | vercel env add VITE_SUPABASE_ANON_KEY preview --force
printf "VALUE_HERE" | vercel env add VITE_SUPABASE_ANON_KEY development --force
```

Replace `VALUE_HERE` with the actual values read from `.env`.

### Step 6 — Redeploy to production

```bash
vercel --prod --yes
```

This triggers a fresh build with the new env vars baked in by Vite.

### Step 7 — Confirm

After the deployment completes, Vercel will print the deployment URL. Share it with the user and tell them to:
1. Go through the enrollment wizard on the live site
2. Check **Supabase → Table Editor → leads** for a new row
3. Check their inbox (including spam) for the portal invite

## Key constraints

- NEVER set `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_URL` as Vercel env vars — these are for edge functions only and must not be baked into the browser bundle
- Only set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — these are the public-safe frontend variables
- If `vercel link` asks to create a new project vs link an existing one, always choose to link to the existing `proguard-portal` project
- The redeployment is required — just setting env vars does not update the live build
