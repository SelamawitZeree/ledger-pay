"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { isAuthenticated, loadSessionFromStorage, setSession } from "@/lib/auth";

export default function LoginPage(){
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [tenantId, setTenantId] = useState("11111111-1111-1111-1111-111111111111");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessionFromStorage();
    if(isAuthenticated()){
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try{
      setLoading(true);
      const res = await login(username, tenantId, role);
      setSession(res.accessToken, tenantId, role);
      router.replace("/dashboard");
    }catch(err: any){
      console.error(err);
      setError("Login failed. Check services are running.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">LedgerPay Console</h1>
        <p className="text-slate-500 mb-6">Sign in to continue</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input className="w-full rounded-md border px-3 py-2" value={username} onChange={e=>setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tenant ID (UUID)</label>
            <input className="w-full rounded-md border px-3 py-2" value={tenantId} onChange={e=>setTenantId(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select className="w-full rounded-md border px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
              <option value="AUDITOR">AUDITOR</option>
            </select>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-md bg-slate-900 text-white py-2 hover:bg-slate-800 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
