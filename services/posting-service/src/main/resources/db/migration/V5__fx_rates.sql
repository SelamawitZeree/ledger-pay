-- FX rates table and seed monthly 2025 rates (USD base)
CREATE TABLE IF NOT EXISTS fx_rates (
    id UUID PRIMARY KEY,
    rate_date DATE NOT NULL,
    base VARCHAR(3) NOT NULL,
    ccy VARCHAR(3) NOT NULL,
    rate NUMERIC(18,6) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_fx_rate ON fx_rates(rate_date, base, ccy);

-- Seed monthly EUR and GBP rates for 2025 using USD as base
INSERT INTO fx_rates (id, rate_date, base, ccy, rate) VALUES
  (gen_random_uuid(), '2025-01-01', 'USD', 'EUR', 0.92),
  (gen_random_uuid(), '2025-02-01', 'USD', 'EUR', 0.93),
  (gen_random_uuid(), '2025-03-01', 'USD', 'EUR', 0.94),
  (gen_random_uuid(), '2025-04-01', 'USD', 'EUR', 0.95),
  (gen_random_uuid(), '2025-05-01', 'USD', 'EUR', 0.94),
  (gen_random_uuid(), '2025-06-01', 'USD', 'EUR', 0.93),
  (gen_random_uuid(), '2025-07-01', 'USD', 'EUR', 0.92),
  (gen_random_uuid(), '2025-08-01', 'USD', 'EUR', 0.91),
  (gen_random_uuid(), '2025-09-01', 'USD', 'EUR', 0.92),
  (gen_random_uuid(), '2025-10-01', 'USD', 'EUR', 0.93),
  (gen_random_uuid(), '2025-11-01', 'USD', 'EUR', 0.94),
  (gen_random_uuid(), '2025-12-01', 'USD', 'EUR', 0.95),
  (gen_random_uuid(), '2025-01-01', 'USD', 'GBP', 0.80),
  (gen_random_uuid(), '2025-02-01', 'USD', 'GBP', 0.79),
  (gen_random_uuid(), '2025-03-01', 'USD', 'GBP', 0.78),
  (gen_random_uuid(), '2025-04-01', 'USD', 'GBP', 0.79),
  (gen_random_uuid(), '2025-05-01', 'USD', 'GBP', 0.80),
  (gen_random_uuid(), '2025-06-01', 'USD', 'GBP', 0.81),
  (gen_random_uuid(), '2025-07-01', 'USD', 'GBP', 0.82),
  (gen_random_uuid(), '2025-08-01', 'USD', 'GBP', 0.81),
  (gen_random_uuid(), '2025-09-01', 'USD', 'GBP', 0.80),
  (gen_random_uuid(), '2025-10-01', 'USD', 'GBP', 0.79),
  (gen_random_uuid(), '2025-11-01', 'USD', 'GBP', 0.78),
  (gen_random_uuid(), '2025-12-01', 'USD', 'GBP', 0.79)
ON CONFLICT DO NOTHING;
