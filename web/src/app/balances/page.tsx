"use client";

import { useState } from "react";
import { queryApi } from "@/lib/api";

export default function BalancesPage(){
  const [accountId, setAccountId] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if(!accountId) return;
    setError(null);
    setLoading(true);
    try{
      const res = await queryApi.get(`/api/v1/accounts/${accountId}/balance`);
      setResult(JSON.stringify(res.data));
    }catch(err: any){
      console.error(err);
      setError("Failed to fetch balance.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Balances</h1>
      <div className="rounded-lg border bg-white p-4 space-y-3">
        <label className="block text-sm font-medium">Account ID (UUID)</label>
        <input className="w-full rounded-md border px-3 py-2" placeholder="aaaaaaaa-...." value={accountId} onChange={e=>setAccountId(e.target.value)} />
        <button onClick={fetchBalance} disabled={loading || !accountId} className="rounded-md bg-slate-900 text-white px-3 py-2 disabled:opacity-50 w-fit">{loading ? "Fetching..." : "Fetch balance"}</button>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {result && (
          <pre className="text-xs bg-slate-50 border rounded p-3 overflow-auto">{result}</pre>
        )}
      </div>
    </div>
  );
}
