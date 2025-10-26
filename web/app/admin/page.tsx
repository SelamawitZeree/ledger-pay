"use client";

import { RoleGuard } from "@/components/role-guard";
import { Users, Building2, Settings, Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <RoleGuard requiredRoles={['ADMIN']}>
      <div className="min-h-screen p-6 space-y-8 fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gradient">Administration</h1>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Admin Access</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 hover:shadow-glow cursor-pointer transition-all duration-200 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Manage users and permissions</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 hover:shadow-glow-green cursor-pointer transition-all duration-200 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tenant Management</h3>
                <p className="text-sm text-gray-600">Manage tenants and organizations</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 hover:shadow-glow cursor-pointer transition-all duration-200 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                <p className="text-sm text-gray-600">Configure system parameters</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 hover:shadow-glow cursor-pointer transition-all duration-200 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                <p className="text-sm text-gray-600">Security settings and audit logs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">1,542</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">58</div>
              <div className="text-sm text-gray-600">Active Tenants</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">12,876</div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
