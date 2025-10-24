import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Mock system stats data to unblock the frontend
    const mockStats = {
      totalUsers: Math.floor(Math.random() * 500) + 1200,
      activeTenants: Math.floor(Math.random() * 20) + 45,
      totalTransactions: Math.floor(Math.random() * 5000) + 10000,
      totalRevenue: (Math.random() * 500000 + 2500000).toFixed(2),
      monthlyGrowth: (Math.random() * 15 + 5).toFixed(1),
      activeAccounts: Math.floor(Math.random() * 100) + 250,
      systemUptime: "99.9%",
      lastBackup: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      pendingTransactions: Math.floor(Math.random() * 50) + 10,
      errorRate: (Math.random() * 0.1).toFixed(3) + "%"
    };

    // In a real scenario, you would forward this request to the Query Service or a dedicated Admin Service
    // const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8083";
    // const auth = req.headers.get("authorization");
    // const headers: Record<string, string> = {};
    // if (auth) headers["authorization"] = auth;

    // const response = await fetch(`${backendUrl}/api/v1/stats`, {
    //   method: "GET",
    //   headers: Object.keys(headers).length ? headers : undefined,
    // });

    // if (!response.ok) {
    //   const errorData = await response.json();
    //   return NextResponse.json({ message: errorData.message || "Failed to fetch stats from backend" }, { status: response.status });
    // }

    // const data = await response.json();
    // return NextResponse.json(data);

    return NextResponse.json(mockStats);
  } catch (error: any) {
    console.error("API error fetching stats:", error);
    return NextResponse.json(
      { message: "Internal server error while fetching stats" },
      { status: 500 }
    );
  }
}
