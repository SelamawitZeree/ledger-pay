"use client";

import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { getTenantId } from "@/lib/auth";

export default function AuditPage(){
  const [tenantId, setTenantId] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  useEffect(() => {
    const t = getTenantId();
    if(t) setTenantId(t);
  }, []);

  const q = useQuery({
    queryKey: ["audit", tenantId, page, size],
    enabled: !!tenantId,
    queryFn: async () => (await auditApi.get("/api/v1/audit", { params: { tenantId, page, size }})).data,
  });

  const content: any[] = q.data?.content ?? q.data ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Audit</h1>
      <div className="rounded-lg border bg-white p-4 space-y-3">
        <label className="block text-sm font-medium">Tenant ID (UUID)</label>
        <input className="w-full rounded-md border px-3 py-2" value={tenantId} onChange={e=>setTenantId(e.target.value)} placeholder="11111111-..." />
      </div>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2 text-left">When</th>
              <th className="px-3 py-2 text-left">Action</th>
              <th className="px-3 py-2 text-left">Entity</th>
              <th className="px-3 py-2 text-left">Entity ID</th>
              <th className="px-3 py-2 text-left">Actor</th>
            </tr>
          </thead>
          <tbody>
            {content.map((a: any) => (
              <tr key={a.id} className="border-t">
                <td className="px-3 py-2">{a.createdAt ?? a.created_at}</td>
                <td className="px-3 py-2">{a.action}</td>
                <td className="px-3 py-2">{a.entityType}</td>
                <td className="px-3 py-2 font-mono">{a.entityId}</td>
                <td className="px-3 py-2">{a.actor}</td>
              </tr>
            ))}
            {q.isLoading && (
              <tr><td className="px-3 py-4" colSpan={5}>Loading...</td></tr>
            )}
            {!q.isLoading && content.length===0 && (
              <tr><td className="px-3 py-4" colSpan={5}>No audit logs.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded border px-3 py-1" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>
          Prev
        </button>
        <div className="text-sm">Page {page+1}</div>
        <button className="rounded border px-3 py-1" onClick={()=>setPage(p=>p+1)} disabled={content.length < size}>
          Next
        </button>
      </div>
    </div>
  );
}
