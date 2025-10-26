"use client";

import { useState } from "react";
import { Search, DollarSign } from "lucide-react";

export default function BalancesPage() {
  const [accountId, setAccountId] = useState("");
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!accountId.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/accounts/${accountId}/balance`);
      const data = await response.json();
      setBalance(data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Balance Lookup</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-600">Balance Access</span>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-2">
                Account ID
              </label>
              <input
                id="accountId"
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="Enter account ID (e.g., ACC-CASH-001-EUR)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !accountId.trim()}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          {balance && (
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Account Balance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Account Name</p>
                  <p className="text-lg font-semibold text-gray-900">{balance.accountName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account ID</p>
                  <p className="text-lg font-mono text-blue-600">{balance.accountId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="text-lg font-semibold text-gray-900">{balance.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {balance.currency === 'EUR' ? '€' : balance.currency === 'USD' ? '$' : '£'}
                    {balance.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(balance.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
