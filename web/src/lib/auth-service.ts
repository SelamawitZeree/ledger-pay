import axios from "axios";

export interface LoginRequest {
  username: string;
  password: string;
  tenantId: string;
  role?: "USER" | "ADMIN" | "AUDITOR";
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  tenantId: string;
  role: "USER" | "ADMIN" | "AUDITOR";
}

export interface AuthResponse {
  accessToken: string;
  user?: {
    id: string;
    username: string;
    email?: string;
    role: string;
    tenantId: string;
  };
}

export interface RegisterResponse {
  id: string;
  username: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email?: string;
    role: string;
    tenantId: string;
  };
}

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8090";

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Use Next.js API route to avoid CORS issues
      const response = await axios.post('/api/auth/login', {
        username: credentials.username,
        password: credentials.password,
        tenantId: credentials.tenantId,
        role: credentials.role || "USER"
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Invalid credentials");
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || "Invalid request");
      }
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Use Next.js API route to avoid CORS issues
      const response = await axios.post('/api/auth/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        tenantId: userData.tenantId,
        role: userData.role
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || "Invalid registration data");
      }
      if (error.response?.status === 409) {
        throw new Error("Username or email already exists");
      }
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  async logout(): Promise<void> {
    // Clear local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("lp_token");
      localStorage.removeItem("lp_tenantId");
      localStorage.removeItem("lp_role");
      localStorage.removeItem("lp_username");
      localStorage.removeItem("lp_loginTime");
    }
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("lp_token");
  }

  getTenantId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("lp_tenantId");
  }

  getRole(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("lp_role");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setSession(token: string, tenantId: string, role: string, username?: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("lp_token", token);
      localStorage.setItem("lp_tenantId", tenantId);
      localStorage.setItem("lp_role", role);
      if (username) {
        localStorage.setItem("lp_username", username);
      }
      localStorage.setItem("lp_loginTime", new Date().toISOString());
    }
  }
}

export const authService = new AuthService();
