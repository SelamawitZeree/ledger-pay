-- Seed demo audit logs
-- Tenant: 11111111-1111-1111-1111-111111111111

INSERT INTO audit_logs (id, tenant_id, action, entity_type, entity_id, details, actor, created_at)
VALUES
  ('aaaa1111-bbbb-2222-cccc-333333333333', '11111111-1111-1111-1111-111111111111', 'CREATE', 'Account', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Created Cash account', 'seed', NOW()),
  ('bbbb2222-cccc-3333-dddd-444444444444', '11111111-1111-1111-1111-111111111111', 'CREATE', 'Account', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Created Payable account', 'seed', NOW()),
  ('cccc3333-dddd-4444-eeee-555555555555', '11111111-1111-1111-1111-111111111111', 'CREATE', 'Account', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Created Revenue account', 'seed', NOW())
ON CONFLICT (id) DO NOTHING;
