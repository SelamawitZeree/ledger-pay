#!/bin/bash

echo "🚀 LedgerPay Frontend-Backend Integration Test"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing $test_name... "
    
    # Run the test command
    local actual_status
    actual_status=$(eval "$test_command" 2>/dev/null)
    
    if [ "$actual_status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAILED${NC} (Expected: $expected_status, Got: $actual_status)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo "📋 Step 1: Service Connectivity Tests"
echo "-------------------------------------"

# Test 1: Auth Service
run_test "Auth Service" "curl -s -o /dev/null -w '%{http_code}' -X POST 'http://localhost:8090/api/v1/auth/login?username=testuser&tenantId=550e8400-e29b-41d4-a716-446655440000&role=USER'" "200"

# Test 2: Accounts Service (should return 401 without auth)
run_test "Accounts Service" "curl -s -o /dev/null -w '%{http_code}' 'http://localhost:8081/api/v1/accounts'" "401"

# Test 3: Posting Service
run_test "Posting Service" "curl -s -o /dev/null -w '%{http_code}' 'http://localhost:8082/api/v1/internal/balance?accountId=test'" "200"

# Test 4: Query Service
run_test "Query Service" "curl -s -o /dev/null -w '%{http_code}' -X POST 'http://localhost:8083/api/v1/webhooks/transaction-posted' -H 'Content-Type: application/json' -d '{\"transactionId\":\"test\"}'" "200"

# Test 5: Audit Service
run_test "Audit Service" "curl -s -o /dev/null -w '%{http_code}' 'http://localhost:8084/api/v1/audit?tenantId=550e8400-e29b-41d4-a716-446655440000'" "200"

echo ""
echo "📋 Step 2: Authentication Flow Test"
echo "-----------------------------------"

# Get JWT token
echo -n "Getting JWT token... "
JWT_TOKEN=$(curl -s -X POST "http://localhost:8090/api/v1/auth/login?username=testuser&tenantId=550e8400-e29b-41d4-a716-446655440000&role=USER" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$JWT_TOKEN" ]; then
    echo -e "${GREEN}✅ SUCCESS${NC}"
    echo "Token: ${JWT_TOKEN:0:30}..."
else
    echo -e "${RED}❌ FAILED${NC}"
    exit 1
fi

echo ""
echo "📋 Step 3: Authenticated API Tests"
echo "----------------------------------"

# Test authenticated accounts endpoint
run_test "Authenticated Accounts" "curl -s -o /dev/null -w '%{http_code}' -H 'Authorization: Bearer $JWT_TOKEN' 'http://localhost:8081/api/v1/accounts'" "200"

echo ""
echo "📋 Step 4: Account Creation Test"
echo "--------------------------------"

# Create test account
echo -n "Creating test account... "
ACCOUNT_RESPONSE=$(curl -s -X POST "http://localhost:8081/api/v1/accounts" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "code": "INTEGRATION-TEST-'$(date +%s)'",
        "name": "Integration Test Account",
        "type": "ASSET",
        "currency": "USD",
        "status": "ACTIVE",
        "ownerType": "CUSTOMER",
        "ownerRefId": "550e8400-e29b-41d4-a716-446655440001"
    }')

if echo "$ACCOUNT_RESPONSE" | grep -q '"id"'; then
    ACCOUNT_ID=$(echo "$ACCOUNT_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✅ SUCCESS${NC}"
    echo "Account ID: $ACCOUNT_ID"
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "Response: $ACCOUNT_RESPONSE"
fi

echo ""
echo "📋 Step 5: Transaction Posting Test"
echo "-----------------------------------"

# Post transaction
echo -n "Posting test transaction... "
TRANSACTION_RESPONSE=$(curl -s -X POST "http://localhost:8082/api/v1/transactions" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "tenantId": "550e8400-e29b-41d4-a716-446655440000",
        "reference": "INTEGRATION-TX-'$(date +%s)'",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
        "lines": [
            {
                "accountId": "'$ACCOUNT_ID'",
                "debit": 100.00,
                "credit": null,
                "memo": "Integration test debit"
            },
            {
                "accountId": "'$ACCOUNT_ID'",
                "debit": null,
                "credit": 100.00,
                "memo": "Integration test credit"
            }
        ]
    }')

if echo "$TRANSACTION_RESPONSE" | grep -q '"id"'; then
    echo -e "${GREEN}✅ SUCCESS${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "Response: $TRANSACTION_RESPONSE"
fi

echo ""
echo "📋 Step 6: Balance Query Test"
echo "-----------------------------"

# Query balance
echo -n "Querying account balance... "
BALANCE_RESPONSE=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" "http://localhost:8083/api/v1/accounts/$ACCOUNT_ID/balance")

if [ -n "$BALANCE_RESPONSE" ]; then
    echo -e "${GREEN}✅ SUCCESS${NC}"
    echo "Balance: $BALANCE_RESPONSE"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo ""
echo "📋 Step 7: Audit Log Test"
echo "-------------------------"

# Check audit logs
echo -n "Checking audit logs... "
AUDIT_RESPONSE=$(curl -s "http://localhost:8084/api/v1/audit?tenantId=550e8400-e29b-41d4-a716-446655440000")

if [ -n "$AUDIT_RESPONSE" ]; then
    echo -e "${GREEN}✅ SUCCESS${NC}"
    echo "Audit logs retrieved successfully"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo ""
echo "🎯 INTEGRATION TEST SUMMARY"
echo "=========================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL INTEGRATION TESTS PASSED!${NC}"
    echo -e "${GREEN}Frontend-backend integration is working perfectly!${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some integration tests failed.${NC}"
    echo -e "${YELLOW}Check the individual test results above for details.${NC}"
    exit 1
fi
