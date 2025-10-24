import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, username, password, companyName, phoneNumber, role } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !username || !password || !companyName) {
      return NextResponse.json(
        { message: "Missing required fields: firstName, lastName, email, username, password, companyName" },
        { status: 400 }
      );
    }

    // Call the backend registration endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";
    
    const response = await fetch(`${backendUrl}/api/v1/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        firstName,
        lastName,
        password,
        companyName,
        phoneNumber: phoneNumber || "",
        role: role || 'USER'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || "Registration failed", code: data.code },
        { status: response.status }
      );
    }

    // Return the registration response from backend
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}