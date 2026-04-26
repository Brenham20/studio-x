# Plumbers Mate

Mobile-first AI agent that helps self-employed plumbers manage the business side of their trade. Built with React + Vite + Tailwind CSS, backed by Supabase.

## Getting started

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once it's ready, go to **Settings → API** and copy your **Project URL** and **anon/public key**

### 2. Run the database migration

In your Supabase dashboard, go to **SQL Editor** and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates all the tables: `clients`, `jobs`, `quotes`, `invoices`, `wiki_entries`, `activity_feed`.

### 3. Seed the database

Still in the SQL Editor, run:

```
supabase/seed.sql
```

This populates the database with realistic British plumber data — 10 clients, 13 jobs, 10 quotes, 10 invoices, 7 wiki entries, and 18 activity feed items.

### 4. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase values:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Install dependencies and run

```bash
npm install
npm run dev
```

## Project structure

```
src/
  lib/
    supabase.js          # Supabase client (reads env vars)
  hooks/
    useDashboard.js      # Stats, activity feed, insight card queries
    useWiki.js           # Wiki CRUD
  App.jsx                # All UI components
supabase/
  migrations/
    001_initial_schema.sql
  seed.sql
```

## Database schema

| Table | Purpose |
|---|---|
| `clients` | Customer contact details and access notes |
| `jobs` | Work orders linked to clients, with status tracking |
| `quotes` | Line-item quotes linked to jobs and clients |
| `invoices` | Invoices linked to jobs and clients |
| `wiki_entries` | Plumber's personal knowledge base |
| `activity_feed` | Audit log of actions taken, shown on the dashboard |
