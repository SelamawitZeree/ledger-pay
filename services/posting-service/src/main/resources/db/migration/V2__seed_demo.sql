-- Seed demo transactions and lines
-- Tenant: 11111111-1111-1111-1111-111111111111
-- Accounts (from accounts-service seed):
--   Cash:    aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
--   Payable: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
--   Revenue: cccccccc-cccc-cccc-cccc-cccccccccccc

-- Transactions
INSERT INTO transactions (id, tenant_id, reference, timestamp, status, created_by, created_at)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'TX-001', '2025-01-01T00:00:00Z', 'POSTED', 'seed', NOW()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'TX-002', '2025-01-02T00:00:00Z', 'POSTED', 'seed', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lines for TX-001: Debit Cash 500, Credit Revenue 500
INSERT INTO transaction_lines (id, transaction_id, account_id, debit, credit, memo)
VALUES
  ('11111111-2222-3333-4444-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 500.00, NULL, 'Initial sale receipt'),
  ('22222222-3333-4444-5555-666666666666', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, 500.00, 'Recognize revenue')
ON CONFLICT (id) DO NOTHING;

-- Lines for TX-002: Debit Payable 200, Credit Cash 200
INSERT INTO transaction_lines (id, transaction_id, account_id, debit, credit, memo)
VALUES
  ('33333333-4444-5555-6666-777777777777', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 200.00, NULL, 'Settle payable'),
  ('44444444-5555-6666-7777-888888888888', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 200.00, 'Cash payment')
ON CONFLICT (id) DO NOTHING;
