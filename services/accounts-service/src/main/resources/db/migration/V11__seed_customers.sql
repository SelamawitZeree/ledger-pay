-- Seed customers for two tenants
-- Tenants
-- T1: 11111111-1111-1111-1111-111111111111
-- T2: 22222222-2222-2222-2222-222222222222

INSERT INTO customers (id, tenant_id, name, email)
VALUES
  -- Tenant 1 customers
  ('caaa0000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Acme Corp','ap@acme.test'),
  ('caaa0000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Globex LLC','billing@globex.test'),
  ('caaa0000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Initech','ar@initech.test'),
  -- Tenant 2 customers
  ('cbbb0000-0000-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','Umbrella GmbH','finance@umbrella.test'),
  ('cbbb0000-0000-0000-0000-000000000002','22222222-2222-2222-2222-222222222222','Stark Industries','ap@stark.test'),
  ('cbbb0000-0000-0000-0000-000000000003','22222222-2222-2222-2222-222222222222','Wayne Enterprises','ap@wayne.test')
ON CONFLICT (id) DO NOTHING;
