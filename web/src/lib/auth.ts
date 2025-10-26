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
    localStorage.setItem("lp_username", extractUsernameFromToken(token));
    localStorage.setItem("lp_loginTime", new Date().toISOString());
  }
}

function extractUsernameFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || 'Unknown';
  } catch {
    return 'Unknown';
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
  return userRole ? roles.includes(userRole) : false;
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

export function getUsername() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lp_username");
}

export function getLoginTime() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lp_loginTime");
}

export function getSessionInfo() {
  return {
    token: getToken(),
    tenantId: getTenantId(),
    role: getRole(),
    username: getUsername(),
    loginTime: getLoginTime(),
    isAuthenticated: isAuthenticated()
  };
}
