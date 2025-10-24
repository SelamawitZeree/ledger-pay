# 🧪 LedgerPay Backend API Testing Guide

## 📋 Overview

This guide provides comprehensive instructions for testing the LedgerPay backend services using Postman.

## 🚀 Quick Start

### 1. Import Postman Collection
- Import the `LedgerPay-Postman-Collection.json` file into Postman
- The collection includes all working endpoints with proper authentication

### 2. Test Authentication
- Run the "Login" request first to get an authentication token
- The token will be automatically saved to collection variables
- Use this token for all subsequent requests

## ✅ Working Services

### 🔐 Authentication Service (Port 8090)
**Status: ✅ Working**

#### Login Endpoint
```
POST http://localhost:8090/api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

Body:
username=admin
tenantId=22222222-2222-2222-2222-222222222222
role=ADMIN
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### 🏦 Accounts Service (Port 8081)
**Status: ✅ Working**

#### List Accounts
```
GET http://localhost:8081/api/v1/accounts
Headers:
  Authorization: Bearer {token}
  X-Tenant-Id: 22222222-2222-2222-2222-222222222222
```

**Expected Response:**
```json
[
  {
    "id": "2a000001-aaaa-aaaa-aaaa-aaaaaaaa0001",
    "tenantId": "22222222-2222-2222-2222-222222222222",
    "code": "1000",
    "name": "Cash EUR",
    "type": "ASSET",
    "currency": "EUR",
    "status": "ACTIVE"
  }
]
```

### 💰 Posting Service (Port 8082)
**Status: ✅ Working (with limitations)**

#### Create Transaction
```
POST http://localhost:8082/api/v1/transactions
Headers:
  Authorization: Bearer {token}
  X-Tenant-Id: 22222222-2222-2222-2222-222222222222
  Content-Type: application/json

Body:
{
  "tenantId": "22222222-2222-2222-2222-222222222222",
  "reference": "TEST-TX-123456",
  "timestamp": "2025-10-24T01:25:02.000Z",
  "lines": [
    {
      "accountId": "2a000001-aaaa-aaaa-aaaa-aaaaaaaa0001",
      "debit": 100.00,
      "credit": 0.00,
      "memo": "Test transaction"
    },
    {
      "accountId": "2b000001-bbbb-bbbb-bbbb-bbbbbbbb0001",
      "debit": 0.00,
      "credit": 100.00,
      "memo": "Test transaction offset"
    }
  ]
}
```

## ⚠️ Services with Issues

### 📊 Query Service (Port 8083)
**Status: ❌ Returning 500 Internal Server Error**

#### Get Account Balance
```
GET http://localhost:8083/api/v1/accounts/{accountId}/balance
Headers:
  Authorization: Bearer {token}
  X-Tenant-Id: 22222222-2222-2222-2222-222222222222
```

**Issue:** Database connection or query execution problems

### 🔍 Audit Service (Port 8084)
**Status: ❌ Returning 500 Internal Server Error**

#### Get Audit Logs
```
GET http://localhost:8084/api/v1/audit?tenantId=22222222-2222-2222-2222-222222222222&page=0&size=10
Headers:
  Authorization: Bearer {token}
  X-Tenant-Id: 22222222-2222-2222-2222-222222222222
```

**Issue:** Database connection or query execution problems

## 🔑 Test Credentials

- **Tenant ID:** `22222222-2222-2222-2222-222222222222`
- **Username:** `admin`
- **Role:** `ADMIN`
- **Account IDs:** 
  - Cash EUR: `2a000001-aaaa-aaaa-aaaa-aaaaaaaa0001`
  - Bank Checking GBP: `2a000002-aaaa-aaaa-aaaa-aaaaaaaa0002`
  - Accounts Payable GBP: `2b000001-bbbb-bbbb-bbbb-bbbbbbbb0001`

## 📝 Postman Collection Features

### Automatic Token Management
- Login request automatically saves the access token
- All other requests use the saved token automatically
- No manual token copying required

### Environment Variables
- `baseUrl`: http://localhost
- `accessToken`: Automatically set after login
- `tenantId`: 22222222-2222-2222-2222-222222222222
- `accountId`: 2a000001-aaaa-aaaa-aaaa-aaaaaaaa0001

### Pre-request Scripts
- Login request includes a script to save the token
- Other requests automatically use the saved token

## 🧪 Testing Workflow

1. **Import Collection** - Import `LedgerPay-Postman-Collection.json`
2. **Run Login** - Execute the Login request to get authentication token
3. **Test Accounts** - Run "List Accounts" to verify accounts service
4. **Test Transactions** - Try creating a transaction via posting service
5. **Check Logs** - Review audit logs (if service is working)

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Errors (401)**
   - Ensure you've run the Login request first
   - Check that the token is properly saved in collection variables

2. **CORS Errors**
   - Backend services should handle CORS properly
   - If issues persist, check Docker container logs

3. **500 Internal Server Errors**
   - Query Service and Audit Service have database connectivity issues
   - Check Docker container logs for detailed error information

### Docker Container Logs
```bash
# Check specific service logs
docker logs ledger-pay-query-service-1
docker logs ledger-pay-audit-service-1

# Check all services
docker compose -f docker-compose.micro.yml logs
```

## 📊 Success Criteria

### ✅ Working Endpoints
- [x] Authentication Service - Login
- [x] Accounts Service - List accounts
- [x] Posting Service - Create transactions

### ❌ Issues to Fix
- [ ] Query Service - Account balance endpoint
- [ ] Audit Service - Audit logs endpoint

## 🎯 Next Steps

1. **Fix Query Service** - Resolve database connectivity issues
2. **Fix Audit Service** - Resolve database connectivity issues
3. **Add More Test Cases** - Expand test coverage
4. **Performance Testing** - Add load testing scenarios

---

**Note:** This testing guide is based on the current state of the LedgerPay backend services. Some services may have database connectivity issues that need to be resolved for full functionality.
