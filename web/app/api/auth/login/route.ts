import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // Mock authentication - accept any username/password for now
    if (username && password) {
      // Mock successful login
      const mockResponse = {
        accessToken: 'mock-jwt-token-' + Date.now(),
        tenantId: 'TENANT-001',
        role: username.toLowerCase() === 'admin' ? 'ADMIN' : 'USER',
        username: username,
        message: 'Login successful'
      };
      
      return NextResponse.json(mockResponse);
    } else {
      return NextResponse.json(
        { error: 'Login failed', message: 'Username and password are required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Login failed', message: 'Invalid request' },
      { status: 500 }
    );
  }
}
