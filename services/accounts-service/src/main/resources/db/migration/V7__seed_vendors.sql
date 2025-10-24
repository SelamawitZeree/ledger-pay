-- Seed vendors for two tenants
-- Tenants
-- T1: 11111111-1111-1111-1111-111111111111
-- T2: 22222222-2222-2222-2222-222222222222

INSERT INTO vendors (id, tenant_id, name, email)
VALUES
  -- Tenant 1 vendors
  ('aaaa0000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Alpha Supplies','alpha@supplies.test'),
  ('aaaa0000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Beta Services','beta@services.test'),
  ('aaaa0000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Gamma Hardware','gamma@hardware.test'),
  -- Tenant 2 vendors
  ('bbbb0000-0000-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','Delta Traders','delta@traders.test'),
  ('bbbb0000-0000-0000-0000-000000000002','22222222-2222-2222-2222-222222222222','Epsilon Utilities','epsilon@utilities.test'),
  ('bbbb0000-0000-0000-0000-000000000003','22222222-2222-2222-2222-222222222222','Zeta Logistics','zeta@logistics.test')
ON CONFLICT (id) DO NOTHING;
