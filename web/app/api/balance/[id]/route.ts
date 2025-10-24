import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Missing account id" }, { status: 400 });
  }
  try{
    const url = `http://localhost:8083/api/v1/accounts/${encodeURIComponent(id)}/balance`;
    const auth = req.headers.get("authorization");
    const tenant = req.headers.get("x-tenant-id");
    const headers: Record<string,string> = {};
    if(auth) headers["authorization"] = auth;
    if(tenant) headers["x-tenant-id"] = tenant;
    const res = await fetch(url, { method: "GET", headers: Object.keys(headers).length ? headers : undefined });
    const text = await res.text();
    if(!res.ok){
      return NextResponse.json({ message: text || `Query error: ${res.status}` }, { status: res.status });
    }
    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({ raw: text });
    }
  }catch(err: any){
    return NextResponse.json({ message: err?.message || "Proxy error" }, { status: 500 });
  }
}
