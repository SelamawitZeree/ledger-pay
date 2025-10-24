-- Create vendors table for accounts-service
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vendors_tenant ON vendors(tenant_id, name);
