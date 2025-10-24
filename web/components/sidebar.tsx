"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, Wallet, FileText, LogIn, Shield, TrendingUp, UserPlus } from "lucide-react";
import { isAuthenticated, hasRole, isAdmin, isUser, isAuditor } from "@/lib/auth";
import { useEffect, useState } from "react";

export function Sidebar(){
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("lp_role") || "");
    }
  }, [pathname]); // Re-check when pathname changes

  // Role-based menu items
  const getMenuItems = () => {
    const commonItems = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview & Analytics" },
      { href: "/balances", label: "Balances", icon: FileText, description: "Balance Lookup" },
    ];

    const adminItems = [
      { href: "/admin", label: "Administration", icon: Shield, description: "Manage Users & Tenants" },
      { href: "/accounts", label: "Accounts", icon: Wallet, description: "Manage Accounts" },
      { href: "/transactions", label: "Transactions", icon: TrendingUp, description: "Transaction History" },
      { href: "/audit", label: "Audit", icon: Shield, description: "Audit Logs" },
    ];

    const userItems = [
      { href: "/transactions", label: "Transactions", icon: TrendingUp, description: "Transaction History" },
    ];

    const auditorItems = [
      { href: "/audit", label: "Audit", icon: Shield, description: "Audit Logs" },
    ];

    if (!authenticated) {
      return [
        { href: "/login", label: "Login", icon: LogIn, description: "Sign in to your account" },
        { href: "/register", label: "Register", icon: UserPlus, description: "Create a new account" }
      ];
    }

    switch (userRole) {
      case 'ADMIN':
        return [...commonItems, ...adminItems];
      case 'USER':
        return [...commonItems, ...userItems];
      case 'AUDITOR':
        return [...commonItems, ...auditorItems];
      default:
        return commonItems;
    }
  };

  const items = getMenuItems();
  return (
    <aside className="hidden md:flex md:w-72 md:flex-col bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 shadow-2xl flex-shrink-0">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">LedgerPay</h1>
            <p className="text-xs text-slate-400">Financial Console</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map(({ href, label, icon: Icon, description }) => {
          const active = pathname === href;
          return (
            <Link 
              key={href} 
              href={href}
              className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                active 
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/20" 
                  : "hover:bg-white/10 border border-transparent"
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                active 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                  : "bg-slate-700/50 text-slate-300 group-hover:bg-slate-600/50"
              }`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <div className={`font-medium transition-colors duration-300 ${
                  active ? "text-white" : "text-slate-200 group-hover:text-white"
                }`}>
                  {label}
                </div>
                <div className={`text-xs transition-colors duration-300 ${
                  active ? "text-blue-200" : "text-slate-400 group-hover:text-slate-300"
                }`}>
                  {description}
                </div>
              </div>
              {active && (
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">System Status</div>
            <div className="text-xs text-emerald-400">All services operational</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
