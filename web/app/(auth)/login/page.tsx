"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth-service";
import { isAuthenticated, loadSessionFromStorage, setSession } from "@/lib/auth";

export default function LoginPage(){
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadSessionFromStorage();
    if(isAuthenticated()){
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try{
      setLoading(true);
      const response = await authService.login({
        username,
        password,
        tenantId,
        role: role as "USER" | "ADMIN" | "AUDITOR"
      });
      setSession(response.accessToken, tenantId, role, username);
      router.replace("/dashboard");
    }catch(err: any){
      console.error(err);
      setError(err?.message || "Login failed. Check services are running.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main login card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2">LedgerPay</h1>
            <p className="text-slate-600">Welcome to your financial management console</p>
          </div>

          {/* Login form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                <input
                  className="form-input"
                  value={username}
                  onChange={e=>setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Organization ID</label>
                <input 
                  className="form-input font-mono text-sm"
                  value={tenantId}
                  onChange={e=>setTenantId(e.target.value)}
                  placeholder="e.g., TENANT-ACME-CORP-123456"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Enter your organization's unique identifier</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                <select
                  className="form-input"
                  value={role}
                  onChange={e=>setRole(e.target.value)}
                >
                  <option value="ADMIN">Administrator - Full Access</option>
                  <option value="USER">User - Transaction Access</option>
                  <option value="AUDITOR">Auditor - Read Only Access</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  {role === "ADMIN" && "Full system access including account management, transactions, and audit logs"}
                  {role === "USER" && "Access to view transactions and balances"}
                  {role === "AUDITOR" && "Read-only access to audit logs and balances"}
                </p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Sign In</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          {/* Quick Access */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">Quick Access</span>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {showAdvanced ? "Hide" : "Show"} Demo Accounts
              </button>
            </div>
            
            {showAdvanced && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUsername("admin");
                      setTenantId("22222222-2222-2222-2222-222222222222");
                      setRole("ADMIN");
                    }}
                    className="p-2 bg-white rounded border text-left hover:bg-blue-50"
                  >
                    <div className="font-medium">Admin Account</div>
                    <div className="text-slate-500">Full system access</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername("user1");
                      setTenantId("11111111-1111-1111-1111-111111111111");
                      setRole("USER");
                    }}
                    className="p-2 bg-white rounded border text-left hover:bg-blue-50"
                  >
                    <div className="font-medium">Standard User</div>
                    <div className="text-slate-500">Transaction access</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername("auditor1");
                      setTenantId("33333333-3333-3333-3333-333333333333");
                      setRole("AUDITOR");
                    }}
                    className="p-2 bg-white rounded border text-left hover:bg-blue-50"
                  >
                    <div className="font-medium">Auditor Account</div>
                    <div className="text-slate-500">Read-only access</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Create one here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
