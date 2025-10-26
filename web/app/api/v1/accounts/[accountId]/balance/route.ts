import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const { accountId } = await params;
    
    // Mock balance data
    const mockBalance = {
      accountId: accountId,
      accountName: `Account ${accountId}`,
      balance: Math.floor(Math.random() * 100000) + 10000, // Random balance between 10k-110k
      currency: accountId.includes('EUR') ? 'EUR' : accountId.includes('GBP') ? 'GBP' : 'USD',
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(mockBalance);
  } catch (error) {
    console.error('Balance API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
