CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    reference VARCHAR(64) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    status VARCHAR(16) NOT NULL,
    created_by VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant ON transactions(tenant_id, timestamp DESC);

CREATE TABLE IF NOT EXISTS transaction_lines (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    account_id UUID NOT NULL,
    debit NUMERIC(19,4),
    credit NUMERIC(19,4),
    memo VARCHAR(256)
);
CREATE INDEX IF NOT EXISTS idx_lines_tx ON transaction_lines(transaction_id);
CREATE INDEX IF NOT EXISTS idx_lines_account ON transaction_lines(account_id);
