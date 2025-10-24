"use client";

import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { getTenantId, loadSessionFromStorage } from "@/lib/auth";
import { RoleGuard } from "@/components/role-guard";

export default function AuditPage(){
  const [tenantId, setTenantId] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  useEffect(() => {
    loadSessionFromStorage();
    const t = getTenantId();
    if(t) setTenantId(t);
    else setTenantId("22222222-2222-2222-2222-222222222222"); // Default UUID for demo
  }, []);

  const q = useQuery({
    queryKey: ["audit", tenantId, page, size],
    enabled: !!tenantId,
    queryFn: async () => {
      const response = await fetch(`/api/audit?tenantId=${encodeURIComponent(tenantId)}&page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }
      return await response.json();
    },
  });

  const content: any[] = q.data?.content ?? q.data ?? [];

  return (
    <RoleGuard requiredRoles={['ADMIN', 'AUDITOR']}>
      <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gradient">Audit Logs</h1>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Audit Access</span>
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Tenant ID (UUID)</label>
            <input 
              className="form-input" 
              value={tenantId} 
              onChange={e=>setTenantId(e.target.value)} 
              placeholder="22222222-2222-2222-2222-222222222222" 
            />
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">When</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Action</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Entity</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Entity ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Actor</th>
                </tr>
              </thead>
              <tbody>
                {content.map((a: any) => (
                  <tr key={a.id ?? `${a.entityId}-${a.timestamp ?? a.createdAt ?? a.created_at}` } className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(a.timestamp ?? a.createdAt ?? a.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {a.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{a.entityType}</td>
                    <td className="px-4 py-3 font-mono text-blue-600">{a.entityId}</td>
                    <td className="px-4 py-3">{a.actor}</td>
                  </tr>
                ))}
                {q.isLoading && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading audit logs...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!q.isLoading && content.length===0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                      <div className="flex flex-col items-center space-y-3">
                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-slate-600">No audit logs found</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {q.error ? "Service temporarily unavailable" : "Create transactions to generate audit logs"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {content.length} of {q.data?.totalElements || 0} audit logs
            </div>
            <div className="flex items-center gap-3">
              <button 
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={()=>setPage(p=>Math.max(0,p-1))} 
                disabled={page===0 || q.isLoading}
              >
                Previous
              </button>
              <div className="text-sm font-medium text-slate-700">Page {page+1} of {q.data?.totalPages || 1}</div>
              <button 
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={()=>setPage(p=>p+1)} 
                disabled={q.data?.last || q.isLoading}
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
