# SaaS Starter — Projects CRUD

A minimal full-stack loop: a form that creates a "project," a list that reads
them back, and buttons that update/delete them — all wired through a real
database. No auth, no billing, no multi-tenancy yet. The entire point is to
get the full loop working once, end to end:

```
Frontend form  →  API route  →  Database  →  API route  →  Frontend display
```

---

## 0. One-time tooling setup

You said you still need Node and an editor — do this first, in order.

**Install Node.js**
Go to https://nodejs.org and download the **LTS** version (not "Current").
Run the installer, accept the defaults. To check it worked, open a terminal
(Terminal on Mac, Command Prompt or PowerShell on Windows) and run:

```bash
node --version
npm --version
```

Both should print a version number. If you get "command not found," restart
your terminal (sometimes the PATH doesn't update until then).

**Install VS Code**
Go to https://code.visualstudio.com, download, install. That's it — no config
needed to follow this guide.

---

## 1. Create your free Supabase database

1. Go to https://supabase.com → sign up (GitHub login is fastest) → "New Project"
2. Pick any project name, generate/save a database password somewhere safe,
   pick a region close to you, click "Create new project." Wait ~2 minutes
   for it to provision.
3. Once it's ready: **Project Settings** (gear icon, bottom left) → **Database**
4. Under "Connection string," you need two different URLs:
   - **Transaction pooler** (port `6543`) → this becomes `DATABASE_URL`
   - **Session pooler** or **Direct connection** (port `5432`) → this becomes `DIRECT_URL`
5. Copy both. They look like:
   `postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
   Replace `[YOUR-PASSWORD]` with the password you saved in step 2.

*(Why two URLs? The pooled connection is efficient for your running app, which
opens/closes lots of short-lived connections. Running migrations needs a
direct, non-pooled connection. This split is specific to Supabase/pgBouncer —
you won't see it with every Postgres host.)*

---

## 2. Set up the project on your machine

1. Download/copy this whole `saas-starter` folder onto your computer.
2. Open the folder in VS Code (`File → Open Folder`).
3. Open a terminal inside VS Code (`` Terminal → New Terminal ``, or `` Ctrl+` ``).
4. Install dependencies:

   ```bash
   npm install
   ```

5. Create your real env file from the template:

   ```bash
   cp .env.example .env
   ```

   Open `.env` and paste in your two Supabase URLs from step 1.

6. Create the actual database table from the schema:

   ```bash
   npx prisma migrate dev --name init
   ```

   This reads `prisma/schema.prisma`, generates the SQL to create a `Project`
   table, and runs it against your real Supabase database. You'll see it
   confirm the migration succeeded.

7. Start the app:

   ```bash
   npm run dev
   ```

8. Open **http://localhost:3000** in your browser. You should see the Projects
   page, empty. Add one — refresh — it's still there. That row is sitting in
   your real Supabase database right now.

---

## 3. What to actually do with this

**See the raw data underneath the UI.** Open
`http://localhost:3000/api/projects` directly in your browser. That's the
JSON your frontend is fetching — no UI, just the API route responding. This
is worth staring at for a second: the "backend" is just a function that
returns JSON.

**Watch a request fail on purpose.** Try POSTing an empty name with curl:

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'
```

You should get back a 400 error with the validation message from
`app/api/projects/route.js`. This is the backend rejecting bad input
*independent of whatever the frontend form does* — exactly the "test the
route by itself" habit from the build plan.

**Look at your data in Supabase directly.** In the Supabase dashboard, go to
**Table Editor** → `Project`. You'll see the exact rows your app created,
as a spreadsheet-like view. Edit a row directly there, refresh your app —
it reflects the change. This is the moment "the database" stops being
abstract.

**Make a small change yourself** before moving on to anything new. Ideas, in
increasing difficulty:
- Add a `description` field (string) to the Project model, run
  `npx prisma migrate dev --name add_description`, add it to the form.
- Add a "Clear completed" button that deletes all projects with
  `status: "done"` in one action.
- Sort the list so "active" projects show before "done" ones.

Each of these touches the schema → API route → frontend chain again. That
repetition is the actual skill — by the third time you do it, the pattern
stops feeling like magic.

---

## 4. Where this goes next

Once this loop feels boring and obvious, the next layers bolt on in this
order (matching the plan from our conversation):
1. **Auth** — Clerk or Auth.js, scoping projects to a logged-in user
2. **Multi-tenancy** — an `Organization` model, projects belong to an org not a user
3. **Billing** — Stripe Checkout + webhooks gating a feature
4. **Background jobs** — e.g. an email sent async when a project is created

Come back when you're ready for any of those — each one is its own small
build on top of this same foundation, not a rewrite.
