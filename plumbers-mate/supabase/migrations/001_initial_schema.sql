-- Plumbers Mate — initial schema
-- Run this in: Supabase dashboard → SQL Editor

-- ─── Clients ──────────────────────────────────────────────────────────────────

CREATE TABLE clients (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  phone       text,
  email       text,
  address     text,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── Jobs ─────────────────────────────────────────────────────────────────────

CREATE TABLE jobs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         uuid REFERENCES clients(id) ON DELETE SET NULL,
  description       text NOT NULL,
  address           text,
  status            text NOT NULL DEFAULT 'booked'
                    CHECK (status IN ('quoted','booked','in_progress','completed','cancelled')),
  scheduled_at      timestamptz,
  duration_minutes  integer,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_client_id ON jobs(client_id);
CREATE INDEX idx_jobs_status    ON jobs(status);

-- ─── Quotes ───────────────────────────────────────────────────────────────────

CREATE TABLE quotes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        uuid REFERENCES jobs(id) ON DELETE SET NULL,
  client_id     uuid REFERENCES clients(id) ON DELETE SET NULL,
  line_items    jsonb NOT NULL DEFAULT '[]',
  total_amount  numeric(10,2),
  status        text NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','sent','accepted','declined','expired')),
  sent_at       timestamptz,
  responded_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_quotes_client_id ON quotes(client_id);
CREATE INDEX idx_quotes_status    ON quotes(status);
CREATE INDEX idx_quotes_sent_at   ON quotes(sent_at);

-- ─── Invoices ─────────────────────────────────────────────────────────────────

CREATE TABLE invoices (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid REFERENCES jobs(id) ON DELETE SET NULL,
  client_id   uuid REFERENCES clients(id) ON DELETE SET NULL,
  amount      numeric(10,2),
  status      text NOT NULL DEFAULT 'draft'
              CHECK (status IN ('draft','sent','paid','overdue')),
  sent_at     timestamptz,
  paid_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status    ON invoices(status);

-- ─── Wiki entries ─────────────────────────────────────────────────────────────

CREATE TABLE wiki_entries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  content     text NOT NULL,
  category    text NOT NULL
              CHECK (category IN ('fault_diagnosis','pricing_quoting','client_notes','parts_suppliers','tips_tricks')),
  tags        text[] NOT NULL DEFAULT '{}',
  source      text NOT NULL DEFAULT 'text'
              CHECK (source IN ('voice','text')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── Activity feed ────────────────────────────────────────────────────────────

CREATE TABLE activity_feed (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description  text NOT NULL,
  type         text NOT NULL
               CHECK (type IN ('quote_sent','invoice_paid','job_logged','reminder_set','follow_up_sent','wiki_entry_added')),
  job_id       uuid REFERENCES jobs(id) ON DELETE SET NULL,
  quote_id     uuid REFERENCES quotes(id) ON DELETE SET NULL,
  invoice_id   uuid REFERENCES invoices(id) ON DELETE SET NULL,
  client_id    uuid REFERENCES clients(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);

-- ─── updated_at triggers ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clients_updated_at    BEFORE UPDATE ON clients    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_jobs_updated_at       BEFORE UPDATE ON jobs       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_quotes_updated_at     BEFORE UPDATE ON quotes     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_invoices_updated_at   BEFORE UPDATE ON invoices   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_wiki_updated_at       BEFORE UPDATE ON wiki_entries FOR EACH ROW EXECUTE FUNCTION set_updated_at();
