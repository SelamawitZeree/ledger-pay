import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock audit logs data
    const mockAuditLogs = [
      {
        id: "AUDIT-001",
        timestamp: "2025-10-24T15:00:00Z",
        event: "USER_LOGIN",
        userId: "admin",
        details: "User logged in successfully"
      },
      {
        id: "AUDIT-002",
        timestamp: "2025-10-24T14:30:00Z", 
        event: "ACCOUNT_CREATED",
        userId: "admin",
        details: "New account ACC-CASH-001-EUR created"
      },
      {
        id: "AUDIT-003",
        timestamp: "2025-10-24T14:00:00Z",
        event: "TRANSACTION_PROCESSED",
        userId: "system",
        details: "Transaction TX-001 processed successfully"
      }
    ];
    
    return NextResponse.json(mockAuditLogs);
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
