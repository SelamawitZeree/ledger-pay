"use client";

import { useQuery } from "@tanstack/react-query";
import { postingApi } from "@/lib/api";
import { useState } from "react";

export default function TransactionsPage(){
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const q = useQuery({
    queryKey: ["tx", page, size],
    queryFn: async () => (await postingApi.get("/api/v1/transactions", { params: { page, size }})).data,
  });

  const content: any[] = q.data?.content ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Transactions</h1>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2 text-left">Reference</th>
              <th className="px-3 py-2 text-left">Timestamp</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {content.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-3 py-2 font-mono">{t.reference}</td>
                <td className="px-3 py-2">{t.timestamp}</td>
                <td className="px-3 py-2">{t.status}</td>
              </tr>
            ))}
            {q.isLoading && (
              <tr><td className="px-3 py-4" colSpan={3}>Loading...</td></tr>
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
