#!/bin/bash

echo "🧪 Comprehensive Backend Testing Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
AUTH_SERVICE="http://localhost:8090"
ACCOUNTS_SERVICE="http://localhost:8081"
POSTING_SERVICE="http://localhost:8082"
QUERY_SERVICE="http://localhost:8083"
AUDIT_SERVICE="http://localhost:8084"

# Test tenant ID (proper UUID format)
TENANT_ID="22222222-2222-2222-2222-222222222222"
ACCOUNT_ID="ACC-CASH-001-EUR"

echo -e "${BLUE}🔐 Testing Authentication Service${NC}"
echo "----------------------------------------"

# Test 1: Login with form data
echo -e "${YELLOW}Test 1: Login with form data${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_SERVICE/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&tenantId=$TENANT_ID&role=ADMIN")

echo "Response: $LOGIN_RESPONSE"

# Extract token from response
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ Login successful! Token extracted.${NC}"
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ Login failed or no token received${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🏦 Testing Accounts Service${NC}"
echo "--------------------------------"

# Test 2: List accounts
echo -e "${YELLOW}Test 2: List accounts${NC}"
curl -s -X GET "$ACCOUNTS_SERVICE/api/v1/accounts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Id: $TENANT_ID" | jq '.' 2>/dev/null || echo "Response received (not JSON)"

echo ""
echo -e "${BLUE}💰 Testing Posting Service${NC}"
echo "--------------------------------"

# Test 3: Create a transaction
echo -e "${YELLOW}Test 3: Create a transaction${NC}"
TRANSACTION_DATA='{
  "tenantId": "'$TENANT_ID'",
  "reference": "TEST-TX-'$(date +%s)'",
  "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
  "lines": [
    {
      "accountId": "'$ACCOUNT_ID'",
      "debit": 100.00,
      "credit": 0.00,
      "memo": "Test transaction"
    },
    {
      "accountId": "ACC-BANK-002-GBP",
      "debit": 0.00,
      "credit": 100.00,
      "memo": "Test transaction offset"
    }
  ]
}'

curl -s -X POST "$POSTING_SERVICE/api/v1/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Id: $TENANT_ID" \
  -H "Content-Type: application/json" \
  -d "$TRANSACTION_DATA" | jq '.' 2>/dev/null || echo "Response received (not JSON)"

echo ""
echo -e "${BLUE}📊 Testing Query Service${NC}"
echo "-------------------------------"

# Test 4: Get account balance
echo -e "${YELLOW}Test 4: Get account balance${NC}"
curl -s -X GET "$QUERY_SERVICE/api/v1/accounts/$ACCOUNT_ID/balance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Id: $TENANT_ID" | jq '.' 2>/dev/null || echo "Response received (not JSON)"

echo ""
echo -e "${BLUE}🔍 Testing Audit Service${NC}"
echo "-------------------------------"

# Test 5: Get audit logs
echo -e "${YELLOW}Test 5: Get audit logs${NC}"
curl -s -X GET "$AUDIT_SERVICE/api/v1/audit?tenantId=$TENANT_ID&page=0&size=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Id: $TENANT_ID" | jq '.' 2>/dev/null || echo "Response received (not JSON)"

echo ""
echo -e "${GREEN}🎉 Backend testing completed!${NC}"
echo "========================================"
echo ""
echo "📋 Postman Collection Summary:"
echo "=============================="
echo ""
echo "1. 🔐 Authentication Service (Port 8090)"
echo "   POST /api/v1/auth/login"
echo "   Content-Type: application/x-www-form-urlencoded"
echo "   Body: username=admin&tenantId=$TENANT_ID&role=ADMIN"
echo ""
echo "2. 🏦 Accounts Service (Port 8081)"
echo "   GET /api/v1/accounts"
echo "   Headers: Authorization: Bearer \$token, X-Tenant-Id: $TENANT_ID"
echo ""
echo "3. 💰 Posting Service (Port 8082)"
echo "   POST /api/v1/transactions"
echo "   Headers: Authorization: Bearer \$token, X-Tenant-Id: $TENANT_ID"
echo "   Body: JSON transaction data"
echo ""
echo "4. 📊 Query Service (Port 8083)"
echo "   GET /api/v1/accounts/{accountId}/balance"
echo "   Headers: Authorization: Bearer \$token, X-Tenant-Id: $TENANT_ID"
echo ""
echo "5. 🔍 Audit Service (Port 8084)"
echo "   GET /api/v1/audit?tenantId=$TENANT_ID&page=0&size=10"
echo "   Headers: Authorization: Bearer \$token, X-Tenant-Id: $TENANT_ID"
echo ""
echo "🔑 Test Tenant ID: $TENANT_ID"
echo "🏷️  Test Account ID: $ACCOUNT_ID"
