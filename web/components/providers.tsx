"use client";

import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loadSessionFromStorage } from "@/lib/auth";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }){
  useEffect(() => { loadSessionFromStorage(); }, []);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
