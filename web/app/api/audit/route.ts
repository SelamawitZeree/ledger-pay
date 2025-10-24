import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');

    // Generate realistic audit log data
    const mockAuditLogs = [
      {
        id: `audit-${Date.now()}-1`,
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        action: "TRANSACTION_CREATED",
        entityType: "TRANSACTION",
        entityId: `TX-${(Math.random() * 10000).toFixed(0)}`,
        actor: "admin",
        details: "Payment processed for invoice #INV-001",
        tenantId: tenantId || "22222222-2222-2222-2222-222222222222"
      },
      {
        id: `audit-${Date.now()}-2`,
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        action: "ACCOUNT_UPDATED",
        entityType: "ACCOUNT",
        entityId: `ACC-CASH-001-EUR`,
        actor: "user1",
        details: "Account balance updated after transaction",
        tenantId: tenantId || "22222222-2222-2222-2222-222222222222"
      },
      {
        id: `audit-${Date.now()}-3`,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        action: "USER_LOGIN",
        entityType: "USER",
        entityId: `user-${(Math.random() * 1000).toFixed(0)}`,
        actor: "system",
        details: "User successfully authenticated",
        tenantId: tenantId || "22222222-2222-2222-2222-222222222222"
      },
      {
        id: `audit-${Date.now()}-4`,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        action: "TENANT_CREATED",
        entityType: "TENANT",
        entityId: `TENANT-NEW-CORP-${(Math.random() * 1000).toFixed(0)}`,
        actor: "admin",
        details: "New tenant organization created",
        tenantId: tenantId || "22222222-2222-2222-2222-222222222222"
      },
      {
        id: `audit-${Date.now()}-5`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        action: "BALANCE_INQUIRY",
        entityType: "ACCOUNT",
        entityId: `ACC-BANK-002-GBP`,
        actor: "auditor1",
        details: "Balance inquiry performed",
        tenantId: tenantId || "22222222-2222-2222-2222-222222222222"
      },
      {
        id: `audit-${Date.now()}-6`,
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
        action: "TRANSACTION_CREATED",
        entityType: "TRANSACTION",
        entityId: `TX-${(Math.random() * 10000).toFixed(0)}`,
        actor: "user1",
        details: "Payment of €2,500.00 processed",
        tenantId: tenantId || "22222222-2222-2222-2222-222222222222"
      },
      {
        id: `audit-${Date.now()}-7`,
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        action: "ACCOUNT_CREATED",
        entityType: "ACCOUNT",
        entityId: `ACC-SALES-003-EUR`,
        actor: "admin",
        details: "New sales account created",
        tenantId: tenantId || "22222222-2222-2222-2222-222222222222"
      },
      {
        id: `audit-${Date.now()}-8`,
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        action: "USER_LOGOUT",
        entityType: "USER",
        entityId: `user-${(Math.random() * 1000).toFixed(0)}`,
        actor: "system",
        details: "User session terminated",
        tenantId: tenantId || "22222222-2222-2222-2222-222222222222"
      }
    ];

    // Simulate pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedLogs = mockAuditLogs.slice(startIndex, endIndex);

    const response = {
      content: paginatedLogs,
      totalElements: mockAuditLogs.length,
      totalPages: Math.ceil(mockAuditLogs.length / size),
      size: size,
      number: page,
      first: page === 0,
      last: page >= Math.ceil(mockAuditLogs.length / size) - 1,
      numberOfElements: paginatedLogs.length
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API error fetching audit logs:", error);
    return NextResponse.json(
      { message: "Internal server error while fetching audit logs" },
      { status: 500 }
    );
  }
}
