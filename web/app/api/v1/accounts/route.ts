import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock accounts data
    const mockAccounts = [
      {
        id: "ACC-CASH-001-EUR",
        code: "ACC-CASH-001-EUR",
        name: "Cash EUR Account",
        type: "ASSET",
        currency: "EUR",
        ownerType: "CUSTOMER",
        status: "ACTIVE"
      },
      {
        id: "ACC-BANK-002-GBP",
        code: "ACC-BANK-002-GBP",
        name: "Bank Checking GBP",
        type: "ASSET",
        currency: "GBP",
        ownerType: "CUSTOMER",
        status: "ACTIVE"
      },
      {
        id: "ACC-SALES-003-EUR",
        code: "ACC-SALES-003-EUR",
        name: "Product Sales EUR",
        type: "REVENUE",
        currency: "EUR",
        ownerType: "CUSTOMER",
        status: "ACTIVE"
      }
    ];
    
    return NextResponse.json(mockAccounts);
  } catch (error) {
    console.error('Accounts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}
