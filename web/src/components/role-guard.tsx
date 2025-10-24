"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, hasRole, getRole } from "@/lib/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles: string[];
  fallbackPath?: string;
}

export function RoleGuard({ children, requiredRoles, fallbackPath = "/dashboard" }: RoleGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      const userRole = getRole();
      const access = requiredRoles.includes(userRole || "");
      setHasAccess(access);

      if (!access) {
        router.push(fallbackPath);
        return;
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [router, requiredRoles, fallbackPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md">
          <div className="p-4 bg-red-100 rounded-xl mb-4">
            <svg className="w-12 h-12 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">
            You don't have permission to access this page. Required roles: {requiredRoles.join(", ")}
          </p>
          <button
            onClick={() => router.push(fallbackPath)}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
