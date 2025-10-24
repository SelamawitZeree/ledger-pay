"use client";

import { useQuery } from "@tanstack/react-query";
import { accountsApi } from "@/lib/api";

export default function AccountsPage(){
  const q = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await accountsApi.get("/api/v1/accounts")).data as any[],
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Accounts</h1>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Currency</th>
              <th className="px-3 py-2 text-left">Owner</th>
            </tr>
          </thead>
          <tbody>
            {q.data?.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-3 py-2 font-mono">{a.code}</td>
                <td className="px-3 py-2">{a.name}</td>
                <td className="px-3 py-2">{a.type}</td>
                <td className="px-3 py-2">{a.currency}</td>
                <td className="px-3 py-2">{a.ownerType ?? "-"}</td>
              </tr>
            ))}
            {!q.data && (
              <tr><td className="px-3 py-4" colSpan={5}>Loading...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
