-- Repoint AR owner to customers for both tenants
-- Tenant 1: code 1020 (Accounts Receivable) -> customer caaa0000-...-0001
-- Tenant 2: code 1020 (Accounts Receivable EUR) -> customer cbbb0000-...-0001

UPDATE accounts
SET owner_type='CUSTOMER', owner_ref_id='caaa0000-0000-0000-0000-000000000001'
WHERE tenant_id='11111111-1111-1111-1111-111111111111' AND code='1020';

UPDATE accounts
SET owner_type='CUSTOMER', owner_ref_id='cbbb0000-0000-0000-0000-000000000001'
WHERE tenant_id='22222222-2222-2222-2222-222222222222' AND code='1020';
