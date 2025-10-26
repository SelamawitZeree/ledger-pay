import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    
    // Mock transactions data
    const mockTransactions = [
      {
        id: "TX-001",
        reference: "REF-001",
        timestamp: "2025-10-24T15:00:00Z",
        status: "SUCCESS"
      },
      {
        id: "TX-002", 
        reference: "REF-002",
        timestamp: "2025-10-24T14:30:00Z",
        status: "SUCCESS"
      },
      {
        id: "TX-003",
        reference: "REF-003", 
        timestamp: "2025-10-24T14:00:00Z",
        status: "PENDING"
      }
    ];
    
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = mockTransactions.slice(startIndex, endIndex);
    
    const response = {
      content: content,
      totalElements: mockTransactions.length,
      totalPages: Math.ceil(mockTransactions.length / size),
      size: size,
      number: page
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
