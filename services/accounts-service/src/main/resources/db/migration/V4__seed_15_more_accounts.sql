-- Seed additional accounts to reach 15 total for tenant 11111111-1111-1111-1111-111111111111
-- Existing (from V3): 1000 Cash (ASSET), 2000 Payable (LIABILITY), 4000 Revenue (INCOME)
-- Below adds 12 more unique accounts

INSERT INTO accounts (id, tenant_id, code, name, type, currency, status, owner_type, owner_ref_id, created_at, updated_at)
VALUES
  -- Assets
  ('11111111-aaaa-aaaa-aaaa-aaaaaaaa0001','11111111-1111-1111-1111-111111111111','1010','Bank Checking','ASSET','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  ('11111111-aaaa-aaaa-aaaa-aaaaaaaa0002','11111111-1111-1111-1111-111111111111','1020','Accounts Receivable','ASSET','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  ('11111111-aaaa-aaaa-aaaa-aaaaaaaa0003','11111111-1111-1111-1111-111111111111','1200','Inventory','ASSET','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  ('11111111-aaaa-aaaa-aaaa-aaaaaaaa0004','11111111-1111-1111-1111-111111111111','1300','Prepaid Expenses','ASSET','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  -- Liabilities
  ('22222222-bbbb-bbbb-bbbb-bbbbbbbb0001','11111111-1111-1111-1111-111111111111','2100','Accrued Expenses','LIABILITY','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  ('22222222-bbbb-bbbb-bbbb-bbbbbbbb0002','11111111-1111-1111-1111-111111111111','2200','Notes Payable','LIABILITY','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  ('22222222-bbbb-bbbb-bbbb-bbbbbbbb0003','11111111-1111-1111-1111-111111111111','2300','Taxes Payable','LIABILITY','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  -- Income
  ('33333333-cccc-cccc-cccc-cccccccc0001','11111111-1111-1111-1111-111111111111','4100','Product Sales','INCOME','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  ('33333333-cccc-cccc-cccc-cccccccc0002','11111111-1111-1111-1111-111111111111','4200','Service Revenue','INCOME','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  ('33333333-cccc-cccc-cccc-cccccccc0003','11111111-1111-1111-1111-111111111111','4300','Interest Income','INCOME','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  -- Expense
  ('44444444-dddd-dddd-dddd-dddddddd0001','11111111-1111-1111-1111-111111111111','5100','Cost of Goods Sold','EXPENSE','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  ('44444444-dddd-dddd-dddd-dddddddd0002','11111111-1111-1111-1111-111111111111','5200','Rent Expense','EXPENSE','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  ('44444444-dddd-dddd-dddd-dddddddd0003','11111111-1111-1111-1111-111111111111','5300','Utilities Expense','EXPENSE','USD','ACTIVE',NULL,NULL,NOW(),NOW()),
  ('44444444-dddd-dddd-dddd-dddddddd0004','11111111-1111-1111-1111-111111111111','5400','Salaries Expense','EXPENSE','USD','ACTIVE',NULL,NULL,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;
