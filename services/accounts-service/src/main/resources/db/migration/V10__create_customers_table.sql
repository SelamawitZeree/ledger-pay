-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_customers_tenant ON customers(tenant_id, name);
