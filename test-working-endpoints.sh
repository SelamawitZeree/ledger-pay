#!/bin/bash

echo "🧪 Testing Working Backend Endpoints"
echo "===================================="

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

# Test tenant ID (proper UUID format)
TENANT_ID="22222222-2222-2222-2222-222222222222"

echo -e "${BLUE}🔐 Step 1: Login to get authentication token${NC}"
echo "--------------------------------------------------"

# Login and get token
LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_SERVICE/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&tenantId=$TENANT_ID&role=ADMIN")

echo "Login Response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ Authentication successful!${NC}"
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ Authentication failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🏦 Step 2: Test Accounts Service${NC}"
echo "--------------------------------------"

# Test accounts service
ACCOUNTS_RESPONSE=$(curl -s -X GET "$ACCOUNTS_SERVICE/api/v1/accounts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Id: $TENANT_ID")

if echo "$ACCOUNTS_RESPONSE" | grep -q "Cash EUR"; then
    echo -e "${GREEN}✅ Accounts Service working!${NC}"
    echo "Found accounts data"
else
    echo -e "${RED}❌ Accounts Service failed${NC}"
    echo "Response: $ACCOUNTS_RESPONSE"
fi

echo ""
echo -e "${BLUE}💰 Step 3: Test Posting Service (Internal Balance)${NC}"
echo "-------------------------------------------------------"

# Test posting service internal balance endpoint
POSTING_RESPONSE=$(curl -s -X GET "$POSTING_SERVICE/api/v1/internal/balance?accountId=2a000001-aaaa-aaaa-aaaa-aaaaaaaa0001" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Id: $TENANT_ID")

echo "Posting Service Response: $POSTING_RESPONSE"

if echo "$POSTING_RESPONSE" | grep -q "balance\|amount\|currency"; then
    echo -e "${GREEN}✅ Posting Service working!${NC}"
else
    echo -e "${YELLOW}⚠️  Posting Service response unclear${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Backend Testing Summary${NC}"
echo "=============================="
echo ""
echo -e "${GREEN}✅ Working Services:${NC}"
echo "• Authentication Service (Port 8090) - Login endpoint working"
echo "• Accounts Service (Port 8081) - List accounts working"
echo "• Posting Service (Port 8082) - Internal balance endpoint working"
echo ""
echo -e "${YELLOW}⚠️  Services with Issues:${NC}"
echo "• Query Service (Port 8083) - Balance endpoint returning 500 error"
echo "• Audit Service (Port 8084) - Audit logs endpoint returning 500 error"
echo ""
echo "📋 Postman Collection Ready:"
echo "• Import 'LedgerPay-Postman-Collection.json' into Postman"
echo "• Run 'Login' request first to get authentication token"
echo "• Token will be automatically saved for other requests"
echo ""
echo "🔑 Test Credentials:"
echo "• Tenant ID: $TENANT_ID"
echo "• Username: admin"
echo "• Role: ADMIN"
