"use client";

import { useQuery } from "@tanstack/react-query";
import { accountsApi } from "@/lib/api";
import { RoleGuard } from "@/components/role-guard";

export default function AccountsPage(){
  const q = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await accountsApi.get("/api/v1/accounts")).data as any[],
  });

  return (
    <RoleGuard requiredRoles={['ADMIN']}>
      <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gradient">Account Management</h1>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Admin Access</span>
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Currency</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Owner</th>
                </tr>
              </thead>
              <tbody>
                {q.data?.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-blue-600">{a.code}</td>
                    <td className="px-4 py-3 font-medium">{a.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {a.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{a.currency}</td>
                    <td className="px-4 py-3">{a.ownerType ?? "-"}</td>
                  </tr>
                ))}
                {q.isLoading && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading accounts...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!q.isLoading && (!q.data || q.data.length === 0) && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                      No accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
