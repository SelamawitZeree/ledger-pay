"use client";

import { useQuery } from "@tanstack/react-query";
import { postingApi } from "@/lib/api";
import { useState } from "react";
import { RoleGuard } from "@/components/role-guard";

export default function TransactionsPage(){
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const q = useQuery({
    queryKey: ["tx", page, size],
    queryFn: async () => (await postingApi.get("/api/v1/transactions", { params: { page, size }})).data,
  });

  const content: any[] = q.data?.content ?? [];

  return (
    <RoleGuard requiredRoles={['ADMIN', 'USER']}>
      <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gradient">Transaction History</h1>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Transaction Access</span>
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Reference</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Timestamp</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {content.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-blue-600">{t.reference}</td>
                    <td className="px-4 py-3 text-slate-600">{t.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        t.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {q.isLoading && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={3}>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading transactions...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!q.isLoading && content.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={3}>
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {content.length} transactions
            </div>
            <div className="flex items-center gap-3">
              <button 
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={()=>setPage(p=>Math.max(0,p-1))} 
                disabled={page===0}
              >
                Previous
              </button>
              <div className="text-sm font-medium text-slate-700">Page {page+1}</div>
              <button 
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={()=>setPage(p=>p+1)} 
                disabled={content.length < size}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
