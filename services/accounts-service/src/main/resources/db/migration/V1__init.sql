CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(128) NOT NULL,
    type VARCHAR(16) NOT NULL,
    currency CHAR(3) NOT NULL,
    status VARCHAR(16) NOT NULL,
    owner_type VARCHAR(32),
    owner_ref_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_accounts_tenant_code UNIQUE (tenant_id, code)
);
CREATE INDEX IF NOT EXISTS idx_accounts_tenant ON accounts(tenant_id);
