let _token: string | null = null;
let _tenantId: string | null = null;
let _role: string | null = null;

export function setSession(token: string, tenantId: string, role: string) {
  _token = token;
  _tenantId = tenantId;
  _role = role;
  if (typeof window !== "undefined") {
    localStorage.setItem("lp_token", token);
    localStorage.setItem("lp_tenantId", tenantId);
    localStorage.setItem("lp_role", role);
  }
}

export function loadSessionFromStorage() {
  if (typeof window === "undefined") return;
  _token = localStorage.getItem("lp_token");
  _tenantId = localStorage.getItem("lp_tenantId");
  _role = localStorage.getItem("lp_role");
}

export function clearSession() {
  _token = null;
  _tenantId = null;
  _role = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("lp_token");
    localStorage.removeItem("lp_tenantId");
    localStorage.removeItem("lp_role");
  }
}

export function getToken() {
  if (_token) return _token;
  if (typeof window !== "undefined") {
    _token = localStorage.getItem("lp_token");
  }
  return _token;
}
export function getTenantId() {
  if (_tenantId) return _tenantId;
  if (typeof window !== "undefined") {
    _tenantId = localStorage.getItem("lp_tenantId");
  }
  return _tenantId;
}
export function getRole() {
  if (_role) return _role;
  if (typeof window !== "undefined") {
    _role = localStorage.getItem("lp_role");
  }
  return _role;
}

export function isAuthenticated() { return !!getToken(); }

export function hasRole(requiredRole: string) {
  const userRole = getRole();
  return userRole === requiredRole;
}

export function hasAnyRole(roles: string[]) {
  const userRole = getRole();
  return roles.includes(userRole);
}

export function isAdmin() {
  return hasRole('ADMIN');
}

export function isUser() {
  return hasRole('USER');
}

export function isAuditor() {
  return hasRole('AUDITOR');
}
