-- Seed demo tenant and accounts
-- Tenant UUID used across services
-- 11111111-1111-1111-1111-111111111111

INSERT INTO accounts (id, tenant_id, code, name, type, currency, status, owner_type, owner_ref_id, created_at, updated_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '1000', 'Cash',    'ASSET',    'USD', 'ACTIVE', NULL, NULL, NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '2000', 'Payable', 'LIABILITY','USD', 'ACTIVE', NULL, NULL, NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', '4000', 'Revenue', 'INCOME',   'USD', 'ACTIVE', NULL, NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
