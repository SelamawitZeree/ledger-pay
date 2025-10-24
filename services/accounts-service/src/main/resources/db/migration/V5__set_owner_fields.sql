-- Set non-null owner fields for all seeded accounts (realistic owners)
-- Tenant: 11111111-1111-1111-1111-111111111111
-- Logical owners (fixed UUIDs for repeatability)
-- ORG:    00000000-0000-0000-0000-000000000001
-- BANK:   00000000-0000-0000-0000-000000000002
-- CUST_A: 00000000-0000-0000-0000-0000000000a1
-- CUST_B: 00000000-0000-0000-0000-0000000000a2
-- VEND_A: 00000000-0000-0000-0000-0000000000b1
-- VEND_B: 00000000-0000-0000-0000-0000000000b2

UPDATE accounts SET owner_type='BANK', owner_ref_id='00000000-0000-0000-0000-000000000002'
WHERE tenant_id='11111111-1111-1111-1111-111111111111' AND code IN ('1000','1010'); -- Cash, Bank Checking

UPDATE accounts SET owner_type='CUSTOMER', owner_ref_id='00000000-0000-0000-0000-0000000000a1'
WHERE tenant_id='11111111-1111-1111-1111-111111111111' AND code IN ('1020'); -- Accounts Receivable

UPDATE accounts SET owner_type='VENDOR', owner_ref_id='00000000-0000-0000-0000-0000000000b1'
WHERE tenant_id='11111111-1111-1111-1111-111111111111' AND code IN ('2000','2100','2200','2300'); -- AP, Accrued, Notes Payable, Taxes Payable

UPDATE accounts SET owner_type='ORG', owner_ref_id='00000000-0000-0000-0000-000000000001'
WHERE tenant_id='11111111-1111-1111-1111-111111111111' AND code IN ('4000','4100','4200','4300','1200','1300','5100','5200','5300','5400');

-- Ensure any remaining null owners for this tenant default to ORG
UPDATE accounts SET owner_type='ORG', owner_ref_id='00000000-0000-0000-0000-000000000001'
WHERE tenant_id='11111111-1111-1111-1111-111111111111' AND (owner_type IS NULL OR owner_ref_id IS NULL);
