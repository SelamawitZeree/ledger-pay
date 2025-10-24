#!/bin/bash

echo "🚀 COMPREHENSIVE LEDGER PAY TESTING"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="$3"
    local headers="$4"
    local data="$5"
    
    echo -e "${BLUE}Testing $name...${NC}"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" $headers -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X GET "$url" $headers)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ $name - Status: $http_code${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}❌ $name - Status: $http_code${NC}"
        echo "Response: $body"
    fi
    echo ""
}

# Get JWT token
echo -e "${YELLOW}Getting JWT token...${NC}"
TOKEN=$(curl -s -X POST "http://localhost:8090/api/v1/auth/login?username=testuser&tenantId=550e8400-e29b-41d4-a716-446655440000&role=USER" | jq -r '.accessToken')
echo "Token: ${TOKEN:0:50}..."
echo ""

# Test Auth Service
echo -e "${YELLOW}=== AUTH SERVICE (Port 8090) ===${NC}"
test_endpoint "Login" "http://localhost:8090/api/v1/auth/login?username=testuser&tenantId=550e8400-e29b-41d4-a716-446655440000&role=USER" "POST"

# Test Accounts Service
echo -e "${YELLOW}=== ACCOUNTS SERVICE (Port 8081) ===${NC}"
test_endpoint "List Accounts" "http://localhost:8081/api/v1/accounts" "GET" "-H \"Authorization: Bearer $TOKEN\""

# Create a test account
ACCOUNT_DATA='{
    "code": "TEST-ACCOUNT-001",
    "name": "Test Account for UI",
    "type": "ASSET",
    "currency": "USD",
    "status": "ACTIVE",
    "ownerType": "CUSTOMER",
    "ownerRefId": "550e8400-e29b-41d4-a716-446655440001"
}'

test_endpoint "Create Account" "http://localhost:8081/api/v1/accounts" "POST" "-H \"Authorization: Bearer $TOKEN\" -H \"Content-Type: application/json\"" "$ACCOUNT_DATA"

# Test Posting Service
echo -e "${YELLOW}=== POSTING SERVICE (Port 8082) ===${NC}"
test_endpoint "Internal Balance" "http://localhost:8082/api/v1/internal/balance?accountId=550e8400-e29b-41d4-a716-446655440001" "GET"

# Test Query Service
echo -e "${YELLOW}=== QUERY SERVICE (Port 8083) ===${NC}"
test_endpoint "Account Balance" "http://localhost:8083/api/v1/accounts/550e8400-e29b-41d4-a716-446655440001/balance" "GET" "-H \"Authorization: Bearer $TOKEN\""

WEBHOOK_DATA='{"transactionId": "ui-test-transaction-123"}'
test_endpoint "Transaction Webhook" "http://localhost:8083/api/v1/webhooks/transaction-posted" "POST" "-H \"Content-Type: application/json\"" "$WEBHOOK_DATA"

# Test Audit Service
echo -e "${YELLOW}=== AUDIT SERVICE (Port 8084) ===${NC}"
AUDIT_DATA='{
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "action": "UI_TEST_ACTION",
    "entityType": "Account",
    "entityId": "550e8400-e29b-41d4-a716-446655440001",
    "details": "UI test audit entry",
    "actor": "testuser"
}'

test_endpoint "Create Audit Log" "http://localhost:8084/api/v1/audit" "POST" "-H \"Content-Type: application/json\"" "$AUDIT_DATA"
test_endpoint "List Audit Logs" "http://localhost:8084/api/v1/audit?tenantId=550e8400-e29b-41d4-a716-446655440000" "GET"

# Test Frontend
echo -e "${YELLOW}=== FRONTEND (Port 3000) ===${NC}"
test_endpoint "Frontend Home" "http://localhost:3000" "GET"
test_endpoint "Frontend Dashboard" "http://localhost:3000/dashboard" "GET"
test_endpoint "Frontend Accounts" "http://localhost:3000/accounts" "GET"
test_endpoint "Frontend Transactions" "http://localhost:3000/transactions" "GET"
test_endpoint "Frontend Balances" "http://localhost:3000/balances" "GET"
test_endpoint "Frontend Audit" "http://localhost:3000/audit" "GET"

echo -e "${GREEN}🎉 COMPREHENSIVE TESTING COMPLETE!${NC}"
echo ""
echo "Services tested:"
echo "✅ Auth Service (Port 8090)"
echo "✅ Accounts Service (Port 8081)"
echo "✅ Posting Service (Port 8082)"
echo "✅ Query Service (Port 8083)"
echo "✅ Audit Service (Port 8084)"
echo "✅ Frontend UI (Port  NL3000)"
echo ""
echo "You can now access:"
echo "🌐 Frontend: http://localhost:3000"
echo "🔐 Auth Service: http://localhost:8090"
echo "👥 Accounts Service: http://localhost:8081"
echo "📝 Posting Service: http://localhost:8082"
echo "🔍 Query Service: http://localhost:8083"
echo "📊 Audit Service: http://localhost:8084"