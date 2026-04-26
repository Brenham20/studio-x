-- Plumbers Mate — seed data
-- Run this after the migration, in: Supabase dashboard → SQL Editor
-- Uses fixed UUIDs so the script is safely re-runnable (truncate first if needed).

-- ─── Clear existing data (safe for dev) ──────────────────────────────────────

TRUNCATE activity_feed, invoices, quotes, jobs, wiki_entries, clients RESTART IDENTITY CASCADE;

-- ─── Clients ──────────────────────────────────────────────────────────────────

INSERT INTO clients (id, name, phone, email, address, notes, created_at) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Margaret Patterson',   '07891 234567', 'mpatterson@gmail.com',      '14 Elm Street, Sheffield, S3 7JB',         'Access via side gate — leave it shut, she has a cat. Prefers texts.',                           '2025-10-12 09:00:00+00'),
  ('c0000001-0000-0000-0000-000000000002', 'Dave Hargreaves',      '07744 981234', 'dhargreaves@hotmail.co.uk', '8 Meadow Close, Leeds, LS6 2DP',           'Blunt but fine to deal with. Always asks for a breakdown on the quote.',                        '2025-11-03 10:30:00+00'),
  ('c0000001-0000-0000-0000-000000000003', 'Li-Wei Chen',          '07900 112233', 'lwei.chen@gmail.com',       '22 Briar Road, Sheffield, S10 2AY',        'Stopcock behind washing machine — needs slim wrench. Call ahead, usually in until 11am.',       '2025-11-20 14:00:00+00'),
  ('c0000001-0000-0000-0000-000000000004', 'Robert Clarke',        '07812 445566', 'r.clarke@btinternet.com',   '7 Victoria Terrace, Sheffield, S7 1PA',    'Long-term client. Happy to pay on the day. No issues.',                                         '2025-08-05 08:45:00+00'),
  ('c0000001-0000-0000-0000-000000000005', 'Gary Thompson',        '07588 667788', 'garyt@yahoo.co.uk',         '6 Brook Lane, Sheffield, S2 4HQ',          'Has owed money before — get payment before leaving. Now pays on time.',                         '2025-09-14 11:00:00+00'),
  ('c0000001-0000-0000-0000-000000000006', 'Riverside Letting Co', '0114 2334455', 'maintenance@riverside.co.uk', 'Unit 4, Riverside House, Sheffield, S1 2GH', 'Property manager is Kate. Raise invoice to the company name. 30-day payment terms.',          '2025-07-22 09:00:00+00'),
  ('c0000001-0000-0000-0000-000000000007', 'Linda Foster',         '07766 334455', 'lfoster@gmail.com',         '3 Hawthorn Drive, Sheffield, S8 9NL',      'Elderly — speak clearly, she''s slightly hard of hearing. Very grateful.',                      '2026-01-08 10:00:00+00'),
  ('c0000001-0000-0000-0000-000000000008', 'James Whitworth',      '07833 556677', 'jwhitworth@outlook.com',    '19 Cavendish Road, Sheffield, S11 8XP',    'Owns a buy-to-let on Psalter Lane too — potential ongoing work.',                               '2026-01-30 14:30:00+00'),
  ('c0000001-0000-0000-0000-000000000009', 'Andy Bashir',          '07911 778899', 'abashir@gmail.com',         '52 Sharrow Vale Road, Sheffield, S11 8ZG', 'Recently moved in. Old pipes throughout — flag anything dodgy.',                                '2026-02-15 09:00:00+00'),
  ('c0000001-0000-0000-0000-000000000010', 'Carol Simmons',        '07622 990011', 'carol.simmons@gmail.com',   '11 Nether Edge Road, Sheffield, S7 1RU',   'Annual boiler service customer. Remind in October each year.',                                  '2025-06-18 10:00:00+00');

-- ─── Jobs ─────────────────────────────────────────────────────────────────────

INSERT INTO jobs (id, client_id, description, address, status, scheduled_at, duration_minutes, notes, created_at) VALUES
  -- Completed
  ('a0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'leaking radiator valve',           '7 Victoria Terrace, Sheffield, S7 1PA',    'completed',    '2026-04-21 08:00:00+00', 90,  'TRV head seized — replaced valve and head. No further issues.',               '2026-04-20 17:00:00+00'),
  ('a0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'bathroom tap replacement',         '14 Elm Street, Sheffield, S3 7JB',         'completed',    '2026-04-18 09:00:00+00', 120, 'Both basin taps replaced with new quarter-turn. Customer supplied taps.',      '2026-04-17 11:00:00+00'),
  ('a0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000010', 'annual boiler service',            '11 Nether Edge Road, Sheffield, S7 1RU',   'completed',    '2026-04-15 10:00:00+00', 60,  'Ideal Logic 24. All clear. Pressure was low — topped up and showed her how.', '2026-04-14 16:00:00+00'),
  ('a0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000006', 'burst pipe repair — flat 3',       '14 Psalter Lane, Sheffield, S11 8YP',      'completed',    '2026-04-10 07:30:00+00', 180, 'Pipe had split behind kitchen cupboard. Cut out and replaced 600mm section.', '2026-04-10 06:00:00+00'),
  ('a0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', 'power flush central heating',      '6 Brook Lane, Sheffield, S2 4HQ',          'completed',    '2026-04-08 08:00:00+00', 360, 'System badly sludged. Ran two cycles. Radiators heating evenly now.',          '2026-04-07 15:00:00+00'),
  ('a0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000007', 'outside tap installation',         '3 Hawthorn Drive, Sheffield, S8 9NL',      'completed',    '2026-04-05 09:00:00+00', 120, 'Backflow check valve fitted. Customer very pleased.',                          '2026-04-04 14:00:00+00'),
  ('a0000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000003', 'stopcock replacement',             '22 Briar Road, Sheffield, S10 2AY',        'completed',    '2026-03-28 09:00:00+00', 90,  'Old quarter-turn had seized. Had to cut back 150mm to get clean copper.',      '2026-03-27 16:00:00+00'),
  -- In progress
  ('a0000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000009', 'full bathroom refit',              '52 Sharrow Vale Road, Sheffield, S11 8ZG', 'in_progress',  '2026-04-24 08:00:00+00', NULL, 'Day 2 of 5. Suite supplied by customer. Old tiles hiding dodgy plasterwork.', '2026-04-20 10:00:00+00'),
  -- Booked
  ('a0000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000008', 'boiler service + flue inspection', '19 Cavendish Road, Sheffield, S11 8XP',    'booked',       '2026-04-29 09:00:00+00', NULL, NULL,                                                                          '2026-04-23 11:00:00+00'),
  ('a0000001-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000001', 'new radiator in loft conversion',  '14 Elm Street, Sheffield, S3 7JB',         'booked',       '2026-05-02 08:30:00+00', NULL, 'Loft conversion done by builder — pipes not run yet. Bring 15mm copper.',     '2026-04-22 14:00:00+00'),
  -- Quoted
  ('a0000001-0000-0000-0000-000000000011', 'c0000001-0000-0000-0000-000000000002', 'full boiler swap — Vaillant ecoTEC', '8 Meadow Close, Leeds, LS6 2DP',         'quoted',       NULL,                   NULL, 'Current boiler is a Baxi 28 from 2007. Recommend ecoTEC 630.',               '2026-04-17 10:00:00+00'),
  ('a0000001-0000-0000-0000-000000000012', 'c0000001-0000-0000-0000-000000000008', 'bathroom refit — buy-to-let',      '43 Psalter Lane, Sheffield, S11 8YN',      'quoted',       NULL,                   NULL, 'Tenant is moving out end of May. Tight window.',                              '2026-04-19 09:00:00+00'),
  -- Cancelled
  ('a0000001-0000-0000-0000-000000000013', 'c0000001-0000-0000-0000-000000000005', 'shower pump installation',         '6 Brook Lane, Sheffield, S2 4HQ',          'cancelled',    '2026-04-03 09:00:00+00', NULL, 'Customer decided to go with a different shower system.',                      '2026-03-30 11:00:00+00');

-- ─── Quotes ───────────────────────────────────────────────────────────────────

INSERT INTO quotes (id, job_id, client_id, line_items, total_amount, status, sent_at, responded_at, created_at) VALUES
  -- Stale (sent 5 days ago, no response) → triggers insight card
  ('b0000001-0000-0000-0000-000000000001',
   'a0000001-0000-0000-0000-000000000011',
   'c0000001-0000-0000-0000-000000000002',
   '[{"description":"Vaillant ecoTEC Plus 630 combi boiler supply & fit","qty":1,"unit_price":1450.00},{"description":"Flue kit and fittings","qty":1,"unit_price":85.00},{"description":"Magnetic system filter","qty":1,"unit_price":95.00},{"description":"Inhibitor and flush","qty":1,"unit_price":65.00},{"description":"Gas safe certificate","qty":1,"unit_price":75.00},{"description":"Removal and disposal of old boiler","qty":1,"unit_price":70.00}]',
   1840.00, 'sent', '2026-04-21 14:00:00+00', NULL, '2026-04-21 13:30:00+00'),

  -- Accepted
  ('b0000001-0000-0000-0000-000000000002',
   'a0000001-0000-0000-0000-000000000009',
   'c0000001-0000-0000-0000-000000000008',
   '[{"description":"Vaillant ecoTEC 618 boiler service","qty":1,"unit_price":85.00},{"description":"Flue inspection","qty":1,"unit_price":45.00}]',
   130.00, 'accepted', '2026-04-20 10:00:00+00', '2026-04-21 08:30:00+00', '2026-04-20 09:30:00+00'),

  ('b0000001-0000-0000-0000-000000000003',
   'a0000001-0000-0000-0000-000000000008',
   'c0000001-0000-0000-0000-000000000009',
   '[{"description":"Full bathroom strip out","qty":1,"unit_price":350.00},{"description":"Labour — 5 days","qty":5,"unit_price":380.00},{"description":"Materials (pipes, fittings, sealant)","qty":1,"unit_price":220.00}]',
   2470.00, 'accepted', '2026-04-17 11:00:00+00', '2026-04-18 09:00:00+00', '2026-04-17 10:00:00+00'),

  ('b0000001-0000-0000-0000-000000000004',
   'a0000001-0000-0000-0000-000000000005',
   'c0000001-0000-0000-0000-000000000005',
   '[{"description":"Power flush central heating system (8 radiators)","qty":1,"unit_price":380.00},{"description":"Inhibitor","qty":1,"unit_price":35.00}]',
   415.00, 'accepted', '2026-04-02 10:00:00+00', '2026-04-03 11:00:00+00', '2026-04-02 09:00:00+00'),

  -- Sent, waiting
  ('b0000001-0000-0000-0000-000000000005',
   'a0000001-0000-0000-0000-000000000012',
   'c0000001-0000-0000-0000-000000000008',
   '[{"description":"Bathroom strip out and dispose","qty":1,"unit_price":300.00},{"description":"Labour — 4 days","qty":4,"unit_price":380.00},{"description":"Materials","qty":1,"unit_price":280.00},{"description":"Tiling (supply and fit)","qty":1,"unit_price":550.00}]',
   2650.00, 'sent', '2026-04-23 15:00:00+00', NULL, '2026-04-23 14:00:00+00'),

  -- Draft
  ('b0000001-0000-0000-0000-000000000006',
   'a0000001-0000-0000-0000-000000000010',
   'c0000001-0000-0000-0000-000000000001',
   '[{"description":"Supply and fit 1200 BTU radiator","qty":1,"unit_price":185.00},{"description":"15mm pipe run (approx 8m)","qty":1,"unit_price":95.00},{"description":"Labour","qty":1,"unit_price":160.00}]',
   440.00, 'draft', NULL, NULL, '2026-04-24 10:00:00+00'),

  -- Older accepted quotes (for completed jobs)
  ('b0000001-0000-0000-0000-000000000007',
   'a0000001-0000-0000-0000-000000000004',
   'c0000001-0000-0000-0000-000000000006',
   '[{"description":"Emergency call-out","qty":1,"unit_price":95.00},{"description":"Burst pipe repair — cut out and replace 600mm","qty":1,"unit_price":285.00}]',
   380.00, 'accepted', '2026-04-10 08:30:00+00', '2026-04-10 08:35:00+00', '2026-04-10 08:00:00+00'),

  ('b0000001-0000-0000-0000-000000000008',
   'a0000001-0000-0000-0000-000000000006',
   'c0000001-0000-0000-0000-000000000007',
   '[{"description":"Outside tap installation inc. backflow valve","qty":1,"unit_price":195.00}]',
   195.00, 'accepted', '2026-03-31 10:00:00+00', '2026-04-01 14:00:00+00', '2026-03-31 09:30:00+00'),

  -- Declined
  ('b0000001-0000-0000-0000-000000000009',
   'a0000001-0000-0000-0000-000000000013',
   'c0000001-0000-0000-0000-000000000005',
   '[{"description":"Shower pump supply and fit","qty":1,"unit_price":320.00},{"description":"Labour","qty":1,"unit_price":95.00}]',
   415.00, 'declined', '2026-03-28 11:00:00+00', '2026-03-29 17:00:00+00', '2026-03-28 10:30:00+00'),

  -- Expired
  ('b0000001-0000-0000-0000-000000000010',
   NULL,
   'c0000001-0000-0000-0000-000000000003',
   '[{"description":"New bathroom suite supply and fit","qty":1,"unit_price":4800.00}]',
   4800.00, 'expired', '2026-02-10 10:00:00+00', NULL, '2026-02-10 09:00:00+00');

-- ─── Invoices ─────────────────────────────────────────────────────────────────

INSERT INTO invoices (id, job_id, client_id, amount, status, sent_at, paid_at, created_at) VALUES
  -- Paid this month (April 2026) — count toward month revenue
  ('d0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 380.00,  'paid', '2026-04-21 15:00:00+00', '2026-04-22 10:00:00+00', '2026-04-21 15:00:00+00'),
  ('d0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 245.00,  'paid', '2026-04-18 17:00:00+00', '2026-04-19 09:00:00+00', '2026-04-18 17:00:00+00'),
  ('d0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000010', 110.00,  'paid', '2026-04-15 16:00:00+00', '2026-04-15 17:30:00+00', '2026-04-15 16:00:00+00'),
  ('d0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000006', 380.00,  'paid', '2026-04-10 14:00:00+00', '2026-04-14 10:00:00+00', '2026-04-10 14:00:00+00'),
  ('d0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', 415.00,  'paid', '2026-04-08 17:00:00+00', '2026-04-09 08:00:00+00', '2026-04-08 17:00:00+00'),
  ('d0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000007', 195.00,  'paid', '2026-04-05 14:00:00+00', '2026-04-06 09:00:00+00', '2026-04-05 14:00:00+00'),
  ('d0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000003', 195.00,  'paid', '2026-03-28 16:00:00+00', '2026-03-30 10:00:00+00', '2026-03-28 16:00:00+00'),

  -- Outstanding (sent, not paid) — count toward outstanding total
  ('d0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000009', 2470.00, 'sent', '2026-04-24 18:00:00+00', NULL, '2026-04-24 18:00:00+00'),
  ('d0000001-0000-0000-0000-000000000009', NULL,                                   'c0000001-0000-0000-0000-000000000001', 440.00,  'sent', '2026-04-22 10:00:00+00', NULL, '2026-04-22 10:00:00+00'),
  -- Overdue
  ('d0000001-0000-0000-0000-000000000010', NULL,                                   'c0000001-0000-0000-0000-000000000006', 1455.00, 'overdue', '2026-03-15 10:00:00+00', NULL, '2026-03-15 10:00:00+00');

-- ─── Wiki entries ─────────────────────────────────────────────────────────────

INSERT INTO wiki_entries (id, title, content, category, tags, source, created_at) VALUES
  ('e0000001-0000-0000-0000-000000000001',
   'Vaillant ecoTEC — F28 error',
   'Nine times out of ten it''s the ignition lead, not the gas valve. Check the lead first — saves you a solid hour and the part''s about £12 from Heatparts. Only replace the gas valve if the lead checks out fine.',
   'fault_diagnosis', ARRAY['Vaillant','boiler','F28'], 'voice', '2026-04-23 10:00:00+00'),

  ('e0000001-0000-0000-0000-000000000002',
   'Li-Wei Chen — 22 Briar Road access notes',
   'Stopcock is behind the washing machine in the kitchen — pull it out to get to it. A slim wrench is essential, a normal one won''t fit. She''s usually in until 11am and prefers a call before you arrive, not a text.',
   'client_notes', ARRAY['access','stopcock','slim wrench'], 'voice', '2026-04-17 16:00:00+00'),

  ('e0000001-0000-0000-0000-000000000003',
   'Standard bathroom refit — pricing guide',
   'For a standard bathroom in a semi, quote between £4,500 and £6,000 depending on the suite they''ve picked. Takes about 5 days with a mate helping. Always add £200 contingency for tiling surprises — especially in older houses where nothing''s square.',
   'pricing_quoting', ARRAY['bathroom','refit','pricing'], 'text', '2026-04-10 09:00:00+00'),

  ('e0000001-0000-0000-0000-000000000004',
   'Speedfit push-fit on old copper — watch out',
   'Deburr properly and give it a good wipe before pushing in. Older copper that''s been soldered can be slightly oval — check it before trusting the fitting. Had one fail on a refit because I skipped this. Use a pipe insert on anything over 15mm to be safe.',
   'tips_tricks', ARRAY['Speedfit','push-fit','copper'], 'voice', '2026-04-05 08:30:00+00'),

  ('e0000001-0000-0000-0000-000000000005',
   'JC Plumbing Supplies — ask for John',
   'Best trade prices on Grundfos pumps locally. John can usually knock 10% off if you''re buying in bulk — doesn''t advertise it. They stock the full Vaillant ecoTEC range and are usually next day on most boiler parts.',
   'parts_suppliers', ARRAY['supplier','Grundfos','Vaillant'], 'text', '2026-03-28 14:00:00+00'),

  ('e0000001-0000-0000-0000-000000000006',
   'Ideal Logic — F1 fault (low pressure)',
   'Nine times out of ten it just needs topping up to 1.5 bar. Two minutes, saves you diagnosing a sensor. Show the customer how to do it themselves — they''re always grateful and it reduces call-outs.',
   'fault_diagnosis', ARRAY['Ideal','Logic','F1','pressure'], 'voice', '2026-03-20 11:00:00+00'),

  ('e0000001-0000-0000-0000-000000000007',
   'Riverside Letting Co — invoicing notes',
   'Raise all invoices to the company name, not the tenant. Send to maintenance@riverside.co.uk — Kate handles it. They''re on 30-day terms and usually pay on time. Don''t chase before day 28.',
   'client_notes', ARRAY['Riverside','invoicing','letting agent'], 'text', '2026-03-10 15:00:00+00');

-- ─── Activity feed ────────────────────────────────────────────────────────────

INSERT INTO activity_feed (description, type, job_id, quote_id, invoice_id, client_id, created_at) VALUES
  ('Sent follow-up to Margaret Patterson about the bathroom quote',                    'follow_up_sent',   'a0000001-0000-0000-0000-000000000010', NULL, NULL,                                   'c0000001-0000-0000-0000-000000000001', '2026-04-26 09:00:00+00'),
  ('Reminder set for boiler service at 19 Cavendish Road on Tuesday',                 'reminder_set',     'a0000001-0000-0000-0000-000000000009', NULL, NULL,                                   'c0000001-0000-0000-0000-000000000008', '2026-04-25 17:00:00+00'),
  ('Invoice #1 marked as paid — £380 received from Robert Clarke',                    'invoice_paid',     NULL,                                   NULL, 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', '2026-04-22 10:00:00+00'),
  ('Quote #1 sent to Dave Hargreaves — £1,840 for full boiler swap',                  'quote_sent',       'a0000001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000001', NULL, 'c0000001-0000-0000-0000-000000000002', '2026-04-21 14:00:00+00'),
  ('New job logged — leaking radiator valve at 7 Victoria Terrace',                   'job_logged',       'a0000001-0000-0000-0000-000000000001', NULL, NULL,                                   'c0000001-0000-0000-0000-000000000004', '2026-04-20 17:00:00+00'),
  ('Invoice sent to Andy Bashir for bathroom refit — £2,470',                         'quote_sent',       NULL,                                   NULL, 'd0000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000009', '2026-04-24 18:00:00+00'),
  ('Invoice #2 paid — £245 from Margaret Patterson',                                  'invoice_paid',     NULL,                                   NULL, 'd0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', '2026-04-19 09:00:00+00'),
  ('Quote sent to Andy Bashir for full bathroom refit — £2,470',                      'quote_sent',       'a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000003', NULL, 'c0000001-0000-0000-0000-000000000009', '2026-04-17 11:00:00+00'),
  ('New job logged — full bathroom refit at 52 Sharrow Vale Road',                    'job_logged',       'a0000001-0000-0000-0000-000000000008', NULL, NULL,                                   'c0000001-0000-0000-0000-000000000009', '2026-04-20 10:00:00+00'),
  ('Vaillant F28 error tip added to wiki',                                             'wiki_entry_added', NULL,                                   NULL, NULL,                                   NULL,                                   '2026-04-23 10:00:00+00'),
  ('Power flush completed at Brook Lane — invoice sent to Gary Thompson',             'invoice_paid',     'a0000001-0000-0000-0000-000000000005', NULL, 'd0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', '2026-04-09 08:00:00+00'),
  ('Outside tap fitted at 3 Hawthorn Drive — Linda Foster paid on the day',           'invoice_paid',     NULL,                                   NULL, 'd0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000007', '2026-04-06 09:00:00+00'),
  ('Emergency burst pipe repaired at Psalter Lane — Riverside Letting Co job',        'job_logged',       'a0000001-0000-0000-0000-000000000004', NULL, NULL,                                   'c0000001-0000-0000-0000-000000000006', '2026-04-10 06:00:00+00'),
  ('Quote sent to James Whitworth for bathroom refit at buy-to-let — £2,650',         'quote_sent',       'a0000001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000005', NULL, 'c0000001-0000-0000-0000-000000000008', '2026-04-23 15:00:00+00'),
  ('Boiler service completed at Nether Edge Road — Carol Simmons paid same day',       'invoice_paid',     NULL,                                   NULL, 'd0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000010', '2026-04-15 17:30:00+00'),
  ('Stopcock replaced at 22 Briar Road — Li-Wei Chen',                                'job_logged',       'a0000001-0000-0000-0000-000000000007', NULL, NULL,                                   'c0000001-0000-0000-0000-000000000003', '2026-03-27 16:00:00+00'),
  ('Riverside Letting Co invoice overdue — 42 days unpaid',                           'reminder_set',     NULL,                                   NULL, 'd0000001-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000006', '2026-04-26 08:00:00+00'),
  ('New wiki note added: Ideal Logic F1 fault',                                       'wiki_entry_added', NULL,                                   NULL, NULL,                                   NULL,                                   '2026-03-20 11:00:00+00');
