"use client";

import { useQuery } from "@tanstack/react-query";
import { accountsApi, postingApi, auditApi } from "@/lib/api";
import Link from "next/link";
import { hasRole, getTenantId, loadSessionFromStorage } from "@/lib/auth";
import { useState, useEffect } from "react";
import { MetricsModal } from "../../components/metrics-modal";

export default function DashboardPage(){
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'users' | 'tenants' | 'transactions'>('users');
  
  useEffect(() => {
    loadSessionFromStorage();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock accounts data instead of relying on backend API
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading accounts data
    const timer = setTimeout(() => {
      const mockAccounts = [
        {
          id: "ACC-CASH-001-EUR",
          name: "Cash EUR Account",
          code: "ACC-CASH-001-EUR",
          type: "ASSET",
          currency: "EUR",
          status: "ACTIVE",
          balance: 45000.50
        },
        {
          id: "ACC-BANK-002-GBP",
          name: "Bank Checking GBP",
          code: "ACC-BANK-002-GBP", 
          type: "ASSET",
          currency: "GBP",
          status: "ACTIVE",
          balance: 125000.75
        },
        {
          id: "ACC-SALES-003-EUR",
          name: "Product Sales EUR",
          code: "ACC-SALES-003-EUR",
          type: "REVENUE",
          currency: "EUR",
          status: "ACTIVE",
          balance: 89000.25
        },
        {
          id: "ACC-EXPENSE-004-USD",
          name: "Operating Expenses USD",
          code: "ACC-EXPENSE-004-USD",
          type: "EXPENSE",
          currency: "USD",
          status: "ACTIVE",
          balance: 25000.00
        },
        {
          id: "ACC-LIABILITY-005-EUR",
          name: "Accounts Payable EUR",
          code: "ACC-LIABILITY-005-EUR",
          type: "LIABILITY",
          currency: "EUR",
          status: "ACTIVE",
          balance: 15000.30
        }
      ];
      setAccounts(mockAccounts);
      setAccountsLoading(false);
    }, 1500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, []);
  
  const txQ = useQuery({
    queryKey: ["tx-latest"],
    queryFn: async () => (await postingApi.get("/api/v1/transactions", { params: { page: 0, size: 10 }})).data,
    enabled: hasRole('ADMIN') || hasRole('USER'), // Admins and users can see transactions
  });

      // Generate realistic financial metrics - Making them constant as per user request
      const financialMetrics = {
        totalUsers: 1542, // Static value
        activeTenants: 58, // Static value
        totalTransactions: 12876, // Static value
        totalRevenue: "2750000.00", // Static value
        monthlyGrowth: "12.5", // Static value
        activeAccounts: 315, // Static value
      };

  const handleMetricClick = (type: 'users' | 'tenants' | 'transactions') => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6 space-y-8 fade-in">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">LedgerPay Financial Console</h1>
          <p className="text-slate-600 text-lg">
            {hasRole('ADMIN') && "Welcome back! Manage your financial operations"}
            {hasRole('USER') && "Welcome back! Track your financial transactions"}
            {hasRole('AUDITOR') && "Welcome back! Review system audit logs"}
            {!hasRole('ADMIN') && !hasRole('USER') && !hasRole('AUDITOR') && "Welcome to your financial management console"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-slate-600">Last Updated</div>
            <div className="text-sm font-mono text-slate-800">{currentTime.toLocaleTimeString()}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">System Online</span>
          </div>
        </div>
      </div>

      {/* Financial Metrics Grid - Like your screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users */}
        <div 
          className="glass-card rounded-2xl p-6 slide-up hover:shadow-glow cursor-pointer transition-all duration-200 hover:scale-105"
          onClick={() => handleMetricClick('users')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{financialMetrics.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-semibold">+{financialMetrics.monthlyGrowth}%</span>
            <span className="text-slate-500 ml-2">vs last month</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium">Click to view details →</div>
        </div>

        {/* Active Tenants */}
        <div 
          className="glass-card rounded-2xl p-6 slide-up hover:shadow-glow-green cursor-pointer transition-all duration-200 hover:scale-105"
          onClick={() => handleMetricClick('tenants')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Tenants</p>
              <p className="text-2xl font-bold text-slate-900">{financialMetrics.activeTenants}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-semibold">+3 new</span>
            <span className="text-slate-500 ml-2">this week</span>
          </div>
          <div className="mt-2 text-xs text-green-600 font-medium">Click to view details →</div>
        </div>

        {/* Total Transactions */}
        <div 
          className="glass-card rounded-2xl p-6 slide-up hover:shadow-glow cursor-pointer transition-all duration-200 hover:scale-105"
          onClick={() => handleMetricClick('transactions')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{financialMetrics.totalTransactions.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-semibold">${financialMetrics.totalRevenue}</span>
            <span className="text-slate-500 ml-2">total value</span>
          </div>
          <div className="mt-2 text-xs text-purple-600 font-medium">Click to view details →</div>
        </div>
      </div>

      {/* System Accounts Overview - Like your screenshot */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">System Accounts Overview</h2>
        {accountsLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600">Loading accounts...</span>
          </div>
        )}
        {!accountsLoading && accounts && accounts.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Account</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Currency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {accounts.map((account: any, index: number) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{account.name}</div>
                        <div className="text-sm text-slate-500 font-mono">{account.code}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        account.type === 'ASSET' ? 'bg-blue-100 text-blue-800' :
                        account.type === 'REVENUE' ? 'bg-green-100 text-green-800' :
                        account.type === 'EXPENSE' ? 'bg-red-100 text-red-800' :
                        account.type === 'LIABILITY' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {account.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                      {account.currency}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {account.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                      {account.currency === 'EUR' ? '€' : account.currency === 'USD' ? '$' : '£'}{account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !accountsLoading ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-slate-500 text-lg mb-2">No accounts found</p>
            <p className="text-slate-400 text-sm">Create your first account to get started</p>
          </div>
        ) : null}
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Live</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900">Payment processed: €{(Math.random() * 5000 + 1000).toFixed(2)}</p>
                <p className="text-sm text-slate-600">2 minutes ago</p>
              </div>
            </div>
            <span className="status-success">Success</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900">Account balance updated: ACC-CASH-001</p>
                <p className="text-sm text-slate-600">5 minutes ago</p>
              </div>
            </div>
            <span className="status-success">Success</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900">Audit log generated for transaction ID: TX-{(Math.random() * 10000).toFixed(0)}</p>
                <p className="text-sm text-slate-600">10 minutes ago</p>
              </div>
            </div>
            <span className="status-success">Success</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900">New tenant registered: TENANT-{(Math.random() * 1000).toFixed(0)}</p>
                <p className="text-sm text-slate-600">15 minutes ago</p>
              </div>
            </div>
            <span className="status-success">Success</span>
          </div>
        </div>
      </div>

      {/* Metrics Modal */}
      <MetricsModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        data={financialMetrics}
      />
    </div>
  );
}
