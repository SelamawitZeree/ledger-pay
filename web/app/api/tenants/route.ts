import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Mock tenant data to unblock the frontend
    const mockTenants = [
      {
        id: "TENANT-LEDGER-001",
        name: "LedgerPay",
        description: "Financial services platform",
        adminEmail: "admin@ledgerpay.com",
        status: "ACTIVE",
        createdAt: "2024-01-15T10:00:00Z",
        userCount: 25
      },
      {
        id: "TENANT-ACME-CORP-001",
        name: "ACME Corporation",
        description: "Manufacturing and distribution",
        adminEmail: "admin@acmecorp.com",
        status: "ACTIVE",
        createdAt: "2024-01-16T14:30:00Z",
        userCount: 150
      },
      {
        id: "TENANT-FINANCE-001",
        name: "Finance Partners",
        description: "Financial consulting services",
        adminEmail: "admin@finance.com",
        status: "ACTIVE",
        createdAt: "2024-01-17T09:15:00Z",
        userCount: 45
      },
      {
        id: "TENANT-TECH-001",
        name: "Tech Solutions Inc",
        description: "Software development company",
        adminEmail: "admin@techsolutions.com",
        status: "ACTIVE",
        createdAt: "2024-01-18T16:45:00Z",
        userCount: 78
      }
    ];

    return NextResponse.json(mockTenants);
  } catch (error: any) {
    console.error("API error fetching tenants:", error);
    return NextResponse.json(
      { message: "Internal server error while fetching tenants" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Mock tenant creation response
    const newTenant = {
      id: `TENANT-${body.name?.toUpperCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}`,
      name: body.name,
      description: body.description,
      adminEmail: body.adminEmail,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      userCount: 1
    };

    return NextResponse.json(newTenant, { status: 201 });
  } catch (error: any) {
    console.error("API error creating tenant:", error);
    return NextResponse.json(
      { message: "Internal server error while creating tenant" },
      { status: 500 }
    );
  }
}
