import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, tenantId, role } = body;

    // Validate required fields
    if (!username || !password || !tenantId) {
      return NextResponse.json(
        { message: "Missing required fields: username, password, tenantId" },
        { status: 400 }
      );
    }

    // Forward request to backend auth service (expects form data)
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('tenantId', tenantId);
    formData.append('role', role || 'USER');
    
    const response = await fetch(`${backendUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Login failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
