import { NextRequest, NextResponse } from "next/server";

// Mock balance data for professional account IDs
const mockBalances: Record<string, { balance: number; currency: string; accountName: string }> = {
  "ACC-CASH-001-EUR": { balance: 45000.50, currency: "EUR", accountName: "Cash EUR Account" },
  "ACC-BANK-002-GBP": { balance: 125000.75, currency: "GBP", accountName: "Bank Checking GBP" },
  "ACC-SALES-003-EUR": { balance: 89000.25, currency: "EUR", accountName: "Product Sales EUR" },
  "ACC-EXPENSE-004-USD": { balance: 25000.00, currency: "USD", accountName: "Operating Expenses USD" },
  "ACC-LIABILITY-005-EUR": { balance: 15000.30, currency: "EUR", accountName: "Accounts Payable EUR" },
  "2d000002-dddd-dddd-dddd-dddddddd0002": { balance: 75000.00, currency: "EUR", accountName: "Sample Account" },
  "2d000001-dddd-dddd-dddd-dddddddd0001": { balance: 125000.50, currency: "USD", accountName: "Business Account" },
  "2d000003-dddd-dddd-dddd-dddddddd0003": { balance: 32000.75, currency: "GBP", accountName: "Investment Account" }
};

export async function GET(
  req: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const accountId = params.accountId;
    
    // Check if we have mock data for this account
    if (mockBalances[accountId]) {
      const accountData = mockBalances[accountId];
      return NextResponse.json({
        accountId,
        balance: accountData.balance,
        currency: accountData.currency,
        accountName: accountData.accountName,
        timestamp: new Date().toISOString()
      });
    }

    // Try to call the backend query service
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";
    
    // First, we need to get a token for authentication
    // For now, let's return a mock response with a random balance
    const mockBalance = Math.random() * 100000;
    const currencies = ["EUR", "USD", "GBP"];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    
    return NextResponse.json({
      accountId,
      balance: mockBalance,
      currency,
      accountName: `Account ${accountId}`,
      timestamp: new Date().toISOString(),
      note: "Mock balance data - backend integration pending"
    });

  } catch (error: any) {
    console.error("Balance API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch balance",
        message: error.message,
        accountId: params.accountId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
