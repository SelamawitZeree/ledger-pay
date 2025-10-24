import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Mock user data to unblock the frontend
    const mockUsers = [
      { 
        id: "user-1", 
        username: "admin", 
        email: "admin@ledgerpay.com", 
        role: "ADMIN", 
        tenantId: "TENANT-LEDGER-001",
        status: "ACTIVE",
        createdAt: "2024-01-15T10:00:00Z"
      },
      { 
        id: "user-2", 
        username: "user1", 
        email: "user1@acmecorp.com", 
        role: "USER", 
        tenantId: "TENANT-ACME-CORP-001",
        status: "ACTIVE",
        createdAt: "2024-01-16T14:30:00Z"
      },
      { 
        id: "user-3", 
        username: "auditor1", 
        email: "auditor1@finance.com", 
        role: "AUDITOR", 
        tenantId: "TENANT-FINANCE-001",
        status: "ACTIVE",
        createdAt: "2024-01-17T09:15:00Z"
      },
      { 
        id: "user-4", 
        username: "newuser", 
        email: "newuser@acmecorp.com", 
        role: "USER", 
        tenantId: "TENANT-ACME-CORP-001",
        status: "ACTIVE",
        createdAt: "2024-01-18T16:45:00Z"
      },
    ];

    // In a real scenario, you would forward this request to a backend user management service
    // const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";
    // const auth = req.headers.get("authorization");
    // const tenant = req.headers.get("x-tenant-id");
    // const headers: Record<string, string> = {};
    // if (auth) headers["authorization"] = auth;
    // if (tenant) headers["x-tenant-id"] = tenant;

    // const response = await fetch(`${backendUrl}/api/v1/users`, {
    //   method: "GET",
    //   headers: Object.keys(headers).length ? headers : undefined,
    // });

    // if (!response.ok) {
    //   const errorData = await response.json();
    //   return NextResponse.json({ message: errorData.message || "Failed to fetch users from backend" }, { status: response.status });
    // }

    // const data = await response.json();
    // return NextResponse.json(data);

    return NextResponse.json(mockUsers);
  } catch (error: any) {
    console.error("API error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error while fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Mock user creation response
    const newUser = {
      id: `user-${Date.now()}`,
      username: body.username,
      email: body.email,
      role: body.role || "USER",
      tenantId: body.tenantId,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("API error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error while creating user" },
      { status: 500 }
    );
  }
}
