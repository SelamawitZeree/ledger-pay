"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, loadSessionFromStorage } from "@/lib/auth";

const PUBLIC_ROUTES = new Set<string>(["/login"]);

export function Guard({ children }: { children: React.ReactNode }){
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSessionFromStorage();
    const authed = isAuthenticated();
    if (!authed && !PUBLIC_ROUTES.has(pathname)) {
      router.replace("/login");
      setReady(false);
      return;
    }
    if (authed && pathname === "/login") {
      router.replace("/dashboard");
      setReady(false);
      return;
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!ready) return null;
  return <>{children}</>;
}
