-- Plumbers Mate — fix anon access
-- Run this in: Supabase dashboard → SQL Editor
--
-- Problem: tables created via raw SQL don't automatically grant access to the
-- anon role. This is a single-user prototype with no auth, so RLS isn't needed.

-- ─── Disable RLS (no user accounts to isolate) ────────────────────────────────

ALTER TABLE clients       DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs          DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotes        DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices      DISABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_entries  DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed DISABLE ROW LEVEL SECURITY;

-- ─── Grant read access to the anon role (used by the Supabase JS client) ──────

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- ─── Grant write access for tables the app writes to ─────────────────────────

GRANT INSERT, UPDATE, DELETE ON wiki_entries TO anon, authenticated;
