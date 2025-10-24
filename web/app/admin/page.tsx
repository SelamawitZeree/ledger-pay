"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { accountsApi } from "@/lib/api";
import { RoleGuard } from "@/components/role-guard";
import { getTenantId, getRole, loadSessionFromStorage } from "@/lib/auth";
import { UserManagementService, CreateUserRequest, CreateTenantRequest } from "@/lib/user-management";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    username: "",
    email: "",
    password: "",
    role: "USER",
    tenantId: ""
  });
  const [newTenant, setNewTenant] = useState<CreateTenantRequest>({
    name: "",
    description: "",
    adminEmail: "",
    adminUsername: "",
    adminPassword: ""
  });

  useEffect(() => {
    loadSessionFromStorage();
  }, []);

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await accountsApi.get("/api/v1/accounts")).data,
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => UserManagementService.getUsers(),
  });

  const tenantsQuery = useQuery({
    queryKey: ["tenants"],
    queryFn: () => UserManagementService.getTenants(),
  });

  const systemStatsQuery = useQuery({
    queryKey: ["systemStats"],
    queryFn: () => UserManagementService.getSystemStats(),
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserManagementService.createUser(newUser);
      setNewUser({ username: "", email: "", password: "", role: "USER", tenantId: "" });
      usersQuery.refetch();
      alert("User created successfully!");
    } catch (error) {
      alert("Error creating user: " + (error as Error).message);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tenant = await UserManagementService.createTenant(newTenant);
      setNewTenant({ name: "", description: "", adminEmail: "", adminUsername: "", adminPassword: "" });
      tenantsQuery.refetch();
      usersQuery.refetch();
      alert(`Tenant created successfully! Tenant ID: ${tenant.id}`);
    } catch (error) {
      alert("Error creating tenant: " + (error as Error).message);
    }
  };

  return (
    <RoleGuard requiredRoles={['ADMIN']}>
      <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Administration</h1>
            <p className="text-slate-600 mt-1">Manage users, tenants, and system settings</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">Admin Access</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "users", label: "User Management", icon: "👥" },
              { id: "tenants", label: "Tenant Management", icon: "🏢" },
              { id: "system", label: "System Overview", icon: "⚙️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Create New User</h2>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    className="form-input"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="form-input"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    className="form-input"
                  >
                    <option value="USER">Standard User</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="AUDITOR">Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tenant ID</label>
                  <input
                    type="text"
                    value={newUser.tenantId}
                    onChange={(e) => setNewUser(prev => ({ ...prev, tenantId: e.target.value }))}
                    className="form-input"
                    placeholder="e.g., TENANT-ACME-CORP-001"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="btn-primary">
                    Create User
                  </button>
                </div>
              </form>
            </div>

            {/* Users List */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Existing Users</h2>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tenant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {/* Sample users - in real app, this would come from your backend */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">admin</div>
                          <div className="text-sm text-slate-500">admin@ledgerpay.com</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          ADMIN
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                        TENANT-LEDGER-001
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tenants Tab */}
        {activeTab === "tenants" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Create New Tenant</h2>
              <form onSubmit={handleCreateTenant} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={newTenant.name}
                    onChange={(e) => setNewTenant(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    placeholder="Enter organization name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Email</label>
                  <input
                    type="email"
                    value={newTenant.adminEmail}
                    onChange={(e) => setNewTenant(prev => ({ ...prev, adminEmail: e.target.value }))}
                    className="form-input"
                    placeholder="Enter admin email"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={newTenant.description}
                    onChange={(e) => setNewTenant(prev => ({ ...prev, description: e.target.value }))}
                    className="form-input"
                    rows={3}
                    placeholder="Enter organization description"
                  />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="btn-primary">
                    Create Tenant
                  </button>
                </div>
              </form>
            </div>

            {/* Tenants List */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Existing Tenants</h2>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Organization</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tenant ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Admin</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {/* Sample tenants - in real app, this would come from your backend */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">LedgerPay</div>
                          <div className="text-sm text-slate-500">Financial services</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-slate-900">
                        TENANT-LEDGER-001
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                        admin@ledgerpay.com
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                        2024-01-15
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900">1,234</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Tenants</p>
                    <p className="text-2xl font-bold text-slate-900">56</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-slate-900">12,345</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💳</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accounts Overview */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">System Accounts Overview</h2>
              {accountsQuery.isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-slate-600">Loading accounts...</span>
                </div>
              )}
              {accountsQuery.data && (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Account</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Currency</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {accountsQuery.data.slice(0, 5).map((account: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-slate-900">{account.name}</div>
                              <div className="text-sm text-slate-500 font-mono">{account.code}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
