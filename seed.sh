#!/usr/bin/env bash
set -euo pipefail

TENANT_UUID="${TENANT_UUID:-$(uuidgen)}"
echo "Using TENANT_UUID=${TENANT_UUID}"

login_json=$(curl -s -X POST "http://localhost:8081/api/v1/auth/login?username=admin&tenantId=${TENANT_UUID}&role=ADMIN")
# Extract accessToken value using sed (avoids requiring jq/python)
TOKEN=$(printf "%s" "${login_json}" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')

if [ -z "${TOKEN}" ]; then
  echo "ERROR: Could not parse token from login response: ${login_json}" >&2
  exit 1
fi

echo "Obtained JWT"
AUTH=( -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" )

# Create accounts
curl -s -X POST "http://localhost:8081/api/v1/accounts" "${AUTH[@]}" -d "{\
  \"tenantId\": \"${TENANT_UUID}\",\
  \"code\": \"1000\",\
  \"name\": \"Cash\",\
  \"type\": \"ASSET\",\
  \"currency\": \"USD\",\
  \"status\": \"ACTIVE\"\
}" >/dev/null

curl -s -X POST "http://localhost:8081/api/v1/accounts" "${AUTH[@]}" -d "{\
  \"tenantId\": \"${TENANT_UUID}\",\
  \"code\": \"2000\",\
  \"name\": \"Payable\",\
  \"type\": \"LIABILITY\",\
  \"currency\": \"USD\",\
  \"status\": \"ACTIVE\"\
}" >/dev/null

curl -s -X POST "http://localhost:8081/api/v1/accounts" "${AUTH[@]}" -d "{\
  \"tenantId\": \"${TENANT_UUID}\",\
  \"code\": \"4000\",\
  \"name\": \"Revenue\",\
  \"type\": \"REVENUE\",\
  \"currency\": \"USD\",\
  \"status\": \"ACTIVE\"\
}" >/dev/null

echo "Created accounts"

accounts_json=$(curl -s "http://localhost:8081/api/v1/accounts?tenantId=${TENANT_UUID}" -H "Authorization: Bearer ${TOKEN}")
CASH_ID=$(printf "%s" "${accounts_json}" | python3 - <<'PY'
import sys, json
try:
  j=json.load(sys.stdin)
  print(next((a.get('id') for a in j if a.get('code')=="1000"), ''), end='')
except Exception:
  print('', end='')
PY
)
PAYABLE_ID=$(printf "%s" "${accounts_json}" | python3 - <<'PY'
import sys, json
try:
  j=json.load(sys.stdin)
  print(next((a.get('id') for a in j if a.get('code')=="2000"), ''), end='')
except Exception:
  print('', end='')
PY
)
REVENUE_ID=$(printf "%s" "${accounts_json}" | python3 - <<'PY'
import sys, json
try:
  j=json.load(sys.stdin)
  print(next((a.get('id') for a in j if a.get('code')=="4000"), ''), end='')
except Exception:
  print('', end='')
PY
)

echo "CASH_ID=${CASH_ID}"
echo "PAYABLE_ID=${PAYABLE_ID}"
echo "REVENUE_ID=${REVENUE_ID}"

if [ -z "${CASH_ID}" ] || [ -z "${PAYABLE_ID}" ] || [ -z "${REVENUE_ID}" ]; then
  echo "ERROR: Could not resolve account IDs. Accounts response: ${accounts_json}" >&2
  exit 1
fi

# Post transactions
curl -s -i -X POST "http://localhost:8082/api/v1/transactions" \
  "${AUTH[@]}" \
  -d "{\
    \"tenantId\": \"${TENANT_UUID}\",\
    \"reference\": \"TX-001\",\
    \"timestamp\": \"2025-01-01T00:00:00Z\",\
    \"lines\": [\
      { \"accountId\": \"${CASH_ID}\",    \"debit\": 500.00, \"credit\": 0,       \"memo\": \"Initial sale receipt\" },\
      { \"accountId\": \"${REVENUE_ID}\", \"debit\": 0,      \"credit\": 500.00, \"memo\": \"Recognize revenue\" }\
    ]\
  }"

echo

curl -s -i -X POST "http://localhost:8082/api/v1/transactions" \
  "${AUTH[@]}" \
  -d "{\
    \"tenantId\": \"${TENANT_UUID}\",\
    \"reference\": \"TX-002\",\
    \"timestamp\": \"2025-01-02T00:00:00Z\",\
    \"lines\": [\
      { \"accountId\": \"${PAYABLE_ID}\", \"debit\": 200.00, \"credit\": 0,       \"memo\": \"Settle payable\" },\
      { \"accountId\": \"${CASH_ID}\",    \"debit\": 0,      \"credit\": 200.00, \"memo\": \"Cash payment\" }\
    ]\
  }"

echo

echo "Cash balance:"
curl -s -i -X GET "http://localhost:8083/api/v1/accounts/${CASH_ID}/balance" -H "Authorization: Bearer ${TOKEN}"
echo

echo "Payable balance:"
curl -s -i -X GET "http://localhost:8083/api/v1/accounts/${PAYABLE_ID}/balance" -H "Authorization: Bearer ${TOKEN}"
echo

echo "Revenue balance:"
curl -s -i -X GET "http://localhost:8083/api/v1/accounts/${REVENUE_ID}/balance" -H "Authorization: Bearer ${TOKEN}"
echo

echo "Audit logs:"
curl -s -i -X GET "http://localhost:8084/api/v1/audit?tenantId=${TENANT_UUID}" -H "Authorization: Bearer ${TOKEN}"
echo
