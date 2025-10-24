-- Seed 12 more audit logs to bring total to 15 for tenant 11111111-1111-1111-1111-111111111111
-- Existing V2 inserted 3 CREATE events for seeded accounts

INSERT INTO audit_logs (id, tenant_id, action, entity_type, entity_id, details, actor, created_at)
VALUES
  ('aaaab001-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','CREATE','Transaction','dddddddd-dddd-dddd-dddd-dddddddddddd','Posted TX-001','seed', NOW()),
  ('aaaab002-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','CREATE','Transaction','eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','Posted TX-002','seed', NOW()),
  ('aaaab003-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','UPDATE','Account','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Updated Cash metadata','seed', NOW()),
  ('aaaab004-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','UPDATE','Account','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Updated Payable metadata','seed', NOW()),
  ('aaaab005-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','UPDATE','Account','cccccccc-cccc-cccc-cccc-cccccccccccc','Updated Revenue metadata','seed', NOW()),
  ('aaaab006-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','CREATE','Account','11111111-aaaa-aaaa-aaaa-aaaaaaaa0001','Created Bank Checking','seed', NOW()),
  ('aaaab007-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','CREATE','Account','11111111-aaaa-aaaa-aaaa-aaaaaaaa0002','Created Accounts Receivable','seed', NOW()),
  ('aaaab008-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','CREATE','Account','11111111-aaaa-aaaa-aaaa-aaaaaaaa0003','Created Inventory','seed', NOW()),
  ('aaaab009-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','CREATE','Account','11111111-aaaa-aaaa-aaaa-aaaaaaaa0004','Created Prepaid Expenses','seed', NOW()),
  ('aaaab00a-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','CREATE','Account','22222222-bbbb-bbbb-bbbb-bbbbbbbb0001','Created Accrued Expenses','seed', NOW()),
  ('aaaab00b-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','CREATE','Account','22222222-bbbb-bbbb-bbbb-bbbbbbbb0002','Created Notes Payable','seed', NOW()),
  ('aaaab00c-bbbb-2222-cccc-333333333333','11111111-1111-1111-1111-111111111111','CREATE','Account','22222222-bbbb-bbbb-bbbb-bbbbbbbb0003','Created Taxes Payable','seed', NOW())
ON CONFLICT (id) DO NOTHING;
