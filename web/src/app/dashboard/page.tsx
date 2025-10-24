"use client";

import { useQuery } from "@tanstack/react-query";
import { accountsApi, postingApi } from "@/lib/api";

export default function DashboardPage(){
  const accountsQ = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await accountsApi.get("/api/v1/accounts")).data as any[],
  });
  const txQ = useQuery({
    queryKey: ["tx-latest"],
    queryFn: async () => (await postingApi.get("/api/v1/transactions", { params: { page: 0, size: 10 }})).data,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-slate-500">Accounts</div>
          <div className="text-2xl font-semibold">{accountsQ.data?.length ?? "-"}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-slate-500">Recent Transactions</div>
          <div className="text-2xl font-semibold">{txQ.data?.content?.length ?? "-"}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-slate-500">Status</div>
          <div className="text-2xl font-semibold">OK</div>
        </div>
      </div>
    </div>
  );
}
