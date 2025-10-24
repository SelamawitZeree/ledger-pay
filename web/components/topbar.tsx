"use client";

import { getRole, getTenantId, clearSession, loadSessionFromStorage } from "@/lib/auth";
import { useEffect, useState } from "react";
import { User, LogOut, Bell, Settings } from "lucide-react";

export function Topbar(){
  const [tenantId, setTenantId] = useState<string>("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    loadSessionFromStorage();
    setTenantId(getTenantId() ?? "-");
    setRole(getRole() ?? "-");
  }, []);

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/50 bg-white/90 backdrop-blur-xl shadow-sm">
      {/* Left side - Welcome message */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Welcome back!</h2>
            <p className="text-sm text-slate-600">Manage your financial operations</p>
          </div>
        </div>
      </div>

      {/* Right side - User info and actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
          <Bell className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </button>

        {/* Settings */}
        <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
          <Settings className="w-5 h-5" />
        </button>

        {/* User info */}
        <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-right">
            <div className="text-xs font-medium text-slate-900">{role}</div>
            <div className="text-xs text-slate-500 font-mono truncate max-w-32">{tenantId}</div>
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Sign out button */}
        <button
          className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
          onClick={() => { clearSession(); location.href = "/login"; }}
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
}
