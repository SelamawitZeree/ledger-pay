# LedgerPay Backend API Testing Guide

## Professional Identifiers

Instead of using UUIDs like `22222222-2222-2222-2222-222222222222`, we now use professional identifiers:

- **Tenant ID**: `TENANT-LEDGER-001`
- **Account IDs**: `ACC-CASH-001-EUR`, `ACC-BANK-002-GBP`, `ACC-SALES-003-EUR`
- **Transaction IDs**: `TXN-20251023-001`, `TXN-20251023-002`
- **User IDs**: `USER-ADMIN-001`, `USER-AUDITOR-001`

## Service Endpoints

### 1. Authentication Service (Port 8090)

#### Login Request
```
POST http://localhost:8090/api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=admin&tenantId=TENANT-LEDGER-001&role=ADMIN
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### 2. Accounts Service (Port 8081)

#### List All Accounts
```
GET http://localhost:8081/api/v1/accounts
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Account by ID
```
GET http://localhost:8081/api/v1/accounts/ACC-CASH-001-EUR
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create New Account
```
POST http://localhost:8081/api/v1/accounts
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "code": "ACC-TEST-001",
  "name": "Test Account",
  "type": "ASSET",
  "currency": "EUR",
  "status": "ACTIVE",
  "ownerType": "ORG",
  "ownerRefId": "ORG-001"
}
```

### 3. Posting Service - Transactions (Port 8082)

#### List Transactions
```
GET http://localhost:8082/api/v1/transactions?page=0&size=10
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create Transaction
```
POST http://localhost:8082/api/v1/transactions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "reference": "TXN-20251023-001",
  "timestamp": "2025-10-23T12:00:00Z",
  "tenantId": "TENANT-LEDGER-001",
  "lines": [
    {
      "accountId": "ACC-CASH-001-EUR",
      "debit": 1000.00,
      "credit": 0.00,
      "memo": "Test debit transaction"
    },
    {
      "accountId": "ACC-SALES-003-EUR",
      "debit": 0.00,
      "credit": 1000.00,
      "memo": "Test credit transaction"
    }
  ]
}
```

#### Get Internal Balance
```
GET http://localhost:8082/api/v1/internal/balance
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Query Service - Balance Lookup (Port 8083)

#### Get Account Balance
```
GET http://localhost:8083/api/v1/accounts/ACC-CASH-001-EUR/balance
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Transaction Webhook
```
POST http://localhost:8083/api/v1/transactions/webhook
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "transactionId": "TXN-20251023-001",
  "accountId": "ACC-CASH-001-EUR",
  "amount": 1000.00,
  "currency": "EUR",
  "type": "DEBIT",
  "timestamp": "2025-10-23T12:00:00Z"
}
```

### 5. Audit Service (Port 8084)

#### List Audit Logs
```
GET http://localhost:8084/api/v1/audit?tenantId=TENANT-LEDGER-001&page=0&size=10
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create Audit Log
```
POST http://localhost:8084/api/v1/audit
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "action": "ACCOUNT_CREATED",
  "entity": "Account",
  "entityId": "ACC-TEST-001",
  "actor": "admin",
  "tenantId": "TENANT-LEDGER-001",
  "timestamp": "2025-10-23T12:00:00Z",
  "details": "New account created for testing purposes"
}
```

## Testing Sequence

1. **Start with Authentication**: Get JWT token first
2. **Test Accounts Service**: List, get, create accounts
3. **Test Posting Service**: Create transactions
4. **Test Query Service**: Get balances
5. **Test Audit Service**: View audit logs

## Sample Test Data

### Account Types
- **ASSET**: Cash, Bank accounts, Receivables
- **LIABILITY**: Payables, Loans, Accrued expenses
- **INCOME**: Sales, Service revenue
- **EXPENSE**: Cost of goods, Operating expenses

### Transaction Examples
- **Cash Sale**: Debit Cash, Credit Sales
- **Purchase**: Debit Expense, Credit Payables
- **Payment**: Debit Payables, Credit Cash

## Error Handling

Common HTTP status codes:
- **200**: Success
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **404**: Not Found
- **500**: Internal Server Error

## Postman Collection Import

1. Open Postman
2. Click "Import"
3. Select the `postman-collection.json` file
4. The collection will be imported with all requests and variables
5. Update the `baseUrl` variable if needed
6. Start testing with the Authentication request first
