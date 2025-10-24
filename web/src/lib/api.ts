import axios from "axios";
import { getToken, getTenantId } from "@/lib/auth";

const attachAuth = (instance: ReturnType<typeof axios.create>) => {
  instance.interceptors.request.use((config) => {
    const token = getToken();
    const tenantId = getTenantId();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
      (config.headers as any)["authorization"] = `Bearer ${token}`;
    }
    if (tenantId) {
      config.headers = config.headers ?? {};
      (config.headers as any)["X-Tenant-Id"] = tenantId;
      (config.headers as any)["x-tenant-id"] = tenantId;
    }
    return config;
  });
  return instance;
};

// Use relative baseURL so requests go to Next.js API (dev proxy) and avoid CORS
export const accountsApi = attachAuth(axios.create());
export const postingApi = attachAuth(axios.create());
export const queryApi = attachAuth(axios.create());
export const auditApi = attachAuth(axios.create());

export async function login(username: string, tenantId: string, role: string) {
  const res = await axios.post(`/api/login`, { username, tenantId, role });
  return res.data as { accessToken: string };
}
