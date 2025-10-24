import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
  try{
    const auth = req.headers.get("authorization");
    const tenant = req.headers.get("x-tenant-id");
    const headers: Record<string,string> = {};
    if (auth) headers["authorization"] = auth;
    if (tenant) headers["x-tenant-id"] = tenant;

    const qs = req.nextUrl.search ? req.nextUrl.search : "";
    const upstream = `http://localhost:8082/api/v1/transactions${qs}`;
    const res = await fetch(upstream, { headers });
    const text = await res.text();
    if(!res.ok){
      return NextResponse.json({ message: text || `Transactions error: ${res.status}` }, { status: res.status });
    }
    try { return NextResponse.json(JSON.parse(text)); } catch { return NextResponse.json({ raw: text }); }
  }catch(err: any){
    return NextResponse.json({ message: err?.message || "Proxy error" }, { status: 500 });
  }
}
