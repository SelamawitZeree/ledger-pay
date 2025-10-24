"use client";

import { useState } from "react";
import { getToken, getTenantId } from "@/lib/auth";

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
      const token = getToken();
      const tenant = getTenantId();
      const headers: Record<string,string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (tenant) headers["X-Tenant-Id"] = tenant;
      
      // Use the new balance API endpoint
      const res = await fetch(`/api/v1/accounts/${encodeURIComponent(accountId)}/balance`, { headers });
      const data = await res.json();
      
      if(!res.ok){
        setError(data.error || data.message || "Failed to fetch balance.");
        setResult(null);
      } else {
        // Format the balance response nicely
        const formattedResult = JSON.stringify(data, null, 2);
        setResult(formattedResult);
      }
    }catch(err: any){
      console.error(err);
      setError(err?.message || "Failed to fetch balance.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Balance Lookup</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-600">Balance Access</span>
        </div>
      </div>
      
      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Account ID (UUID)</label>
          <input 
            className="form-input" 
            placeholder="2a000001-aaaa-aaaa-aaaa-aaaaaaaa0001" 
            value={accountId} 
            onChange={e=>setAccountId(e.target.value)} 
          />
          <button 
            onClick={fetchBalance} 
            disabled={loading || !accountId} 
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Fetching...</span>
              </div>
            ) : "Fetch Balance"}
          </button>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Error fetching balance</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {result && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-emerald-800">Balance Retrieved Successfully</p>
              </div>
              
              {(() => {
                try {
                  const balanceData = JSON.parse(result);
                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-600">Account ID</p>
                          <p className="text-sm font-mono bg-white border rounded px-2 py-1">{balanceData.accountId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Account Name</p>
                          <p className="text-sm bg-white border rounded px-2 py-1">{balanceData.accountName || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-600">Balance</p>
                          <p className="text-lg font-bold text-emerald-700 bg-white border rounded px-2 py-1">
                            {balanceData.currency || 'USD'} {balanceData.balance?.toLocaleString() || '0.00'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Last Updated</p>
                          <p className="text-sm bg-white border rounded px-2 py-1">
                            {balanceData.timestamp ? new Date(balanceData.timestamp).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      {balanceData.note && (
                        <div className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                          {balanceData.note}
                        </div>
                      )}
                    </div>
                  );
                } catch {
                  return <pre className="text-xs bg-white border rounded p-3 overflow-auto text-slate-700">{result}</pre>;
                }
              })()}
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Sample Account IDs to try:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• <code className="bg-blue-100 px-1 rounded">ACC-CASH-001-EUR</code> - Cash EUR Account</p>
              <p>• <code className="bg-blue-100 px-1 rounded">ACC-BANK-002-GBP</code> - Bank Checking GBP</p>
              <p>• <code className="bg-blue-100 px-1 rounded">ACC-SALES-003-EUR</code> - Product Sales EUR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
