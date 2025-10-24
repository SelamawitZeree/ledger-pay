-- Ensure tenant 2 accounts have realistic owners
-- Tenant 2: 22222222-2222-2222-2222-222222222222

UPDATE accounts SET owner_type='BANK', owner_ref_id='00000000-0000-0000-0000-000000000002'
WHERE tenant_id='22222222-2222-2222-2222-222222222222' AND code IN ('1000','1010');

UPDATE accounts SET owner_type='CUSTOMER', owner_ref_id='00000000-0000-0000-0000-0000000000a1'
WHERE tenant_id='22222222-2222-2222-2222-222222222222' AND code IN ('1020');

UPDATE accounts SET owner_type='VENDOR', owner_ref_id='bbbb0000-0000-0000-0000-000000000001'
WHERE tenant_id='22222222-2222-2222-2222-222222222222' AND code IN ('2000');

UPDATE accounts SET owner_type='VENDOR', owner_ref_id='bbbb0000-0000-0000-0000-000000000002'
WHERE tenant_id='22222222-2222-2222-2222-222222222222' AND code IN ('2100');

UPDATE accounts SET owner_type='ORG', owner_ref_id='00000000-0000-0000-0000-000000000001'
WHERE tenant_id='22222222-2222-2222-2222-222222222222' AND code IN ('4100','4200','5100','5200');

-- Default any null owner fields for tenant 2 to ORG
UPDATE accounts SET owner_type='ORG', owner_ref_id='00000000-0000-0000-0000-000000000001'
WHERE tenant_id='22222222-2222-2222-2222-222222222222' AND (owner_type IS NULL OR owner_ref_id IS NULL);
