"use client";

import { RoleGuard } from "@/components/role-guard";
import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/lib/api";

export default function AuditPage() {
  const q = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => (await auditApi.get("/api/v1/audit")).data as any[],
  });

  return (
    <RoleGuard requiredRoles={['ADMIN', 'AUDITOR']}>
      <div className="min-h-screen p-6 space-y-8 fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gradient">Audit Logs</h1>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Audit Access</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Timestamp</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Event</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">User</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {q.data?.map((log, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-600">{log.timestamp}</td>
                    <td className="px-4 py-3 font-medium">{log.event}</td>
                    <td className="px-4 py-3">{log.userId}</td>
                    <td className="px-4 py-3 text-slate-600">{log.details}</td>
                  </tr>
                ))}
                {q.isLoading && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={4}>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading audit logs...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!q.isLoading && (!q.data || q.data.length === 0) && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={4}>
                      No audit logs found
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
