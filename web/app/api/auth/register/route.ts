import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;
    
    // Mock registration - accept any valid data
    if (username && email && password) {
      // Mock successful registration
      const mockResponse = {
        accessToken: 'mock-jwt-token-' + Date.now(),
        tenantId: 'TENANT-001',
        role: 'USER',
        username: username,
        email: email,
        message: 'Registration successful'
      };
      
      return NextResponse.json(mockResponse);
    } else {
      return NextResponse.json(
        { error: 'Registration failed', message: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Registration failed', message: 'Invalid request' },
      { status: 500 }
    );
  }
}
