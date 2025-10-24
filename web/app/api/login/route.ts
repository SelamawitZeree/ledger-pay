import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try{
    const { username, tenantId, role } = await req.json();
    const params = new URLSearchParams({ username, tenantId, role });
    const url = `http://localhost:8090/api/v1/auth/login?${params.toString()}`;
    const res = await fetch(url, { method: "POST" });
    if(!res.ok){
      const text = await res.text();
      return NextResponse.json({ message: text || `Auth error: ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  }catch(err: any){
    return NextResponse.json({ message: err?.message || "Proxy error" }, { status: 500 });
  }
}
