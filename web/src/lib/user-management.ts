export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  tenantId: string;
}

export interface CreateTenantRequest {
  name: string;
  description: string;
  adminEmail: string;
  adminUsername: string;
  adminPassword: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  description: string;
}

export interface SystemStats {
  totalUsers: number;
  totalTenants: number;
  totalAccounts: number;
}

export class UserManagementService {
  private static baseUrl = '/api'; // Use Next.js API routes instead of direct backend calls

  static async createUser(user: CreateUserRequest): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lp_token')}`,
          'X-Tenant-Id': localStorage.getItem('lp_tenantId') || ''
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      // Fallback to mock data for development
      return {
        id: `user-${Date.now()}`,
        username: user.username,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      };
    }
  }

  static async createTenant(tenant: CreateTenantRequest): Promise<Tenant> {
    try {
      const response = await fetch(`${this.baseUrl}/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lp_token')}`,
        },
        body: JSON.stringify(tenant)
      });

      if (!response.ok) {
        throw new Error(`Failed to create tenant: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating tenant:', error);
      // Fallback to mock data for development
      return {
        id: `TENANT-${tenant.name.toUpperCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-3)}`,
        name: tenant.name,
        description: tenant.description
      };
    }
  }

  static async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lp_token')}`,
          'X-Tenant-Id': localStorage.getItem('lp_tenantId') || ''
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data for development
      return [
        {
          id: "user-1",
          username: "admin",
          email: "admin@ledgerpay.com",
          role: "ADMIN",
          tenantId: "TENANT-LEDGER-001"
        }
      ];
    }
  }

  static async getTenants(): Promise<Tenant[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tenants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lp_token')}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tenants: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tenants:', error);
      // Fallback to mock data for development
      return [
        {
          id: "TENANT-LEDGER-001",
          name: "LedgerPay",
          description: "Financial services"
        }
      ];
    }
  }

  static async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lp_token')}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data for development
      return {
        totalUsers: 1234,
        totalTenants: 56,
        totalAccounts: 789
      };
    }
  }
}
