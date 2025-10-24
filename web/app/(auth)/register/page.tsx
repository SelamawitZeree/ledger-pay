"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth-service";
import { setSession, isAuthenticated, loadSessionFromStorage } from "@/lib/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    tenantName: "",
    role: "USER" as "USER" | "ADMIN" | "AUDITOR"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Redirect logged-in users away from registration page
  useEffect(() => {
    loadSessionFromStorage();
    if(isAuthenticated()){
      // If user is already logged in, redirect to dashboard immediately
      router.replace("/dashboard");
      return;
    }
  }, [router]);

  // Don't render the form if user is authenticated
  if (isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      if (!/\d/.test(formData.password)) {
        throw new Error("Password must contain at least one number");
      }

      // Register user with backend
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          companyName: formData.tenantName,
          phoneNumber: "", // Optional field
          role: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'USERNAME_EXISTS') {
          throw new Error("Username already exists. Please choose a different username.");
        } else if (data.code === 'EMAIL_EXISTS') {
          throw new Error("Email already exists. Please use a different email address.");
        } else {
          throw new Error(data.error || "Registration failed");
        }
      }
      
      // If registration includes token, login automatically
      if (data.accessToken && data.tenantId) {
        setSession(data.accessToken, data.tenantId, data.role, data.username);
        router.push("/dashboard");
      } else {
        // Otherwise, redirect to login with success message
        router.push("/login?registered=true");
      }
      
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 shadow-2xl fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gradient-green mb-2">Create Account</h1>
            <p className="text-slate-600">Join LedgerPay and start managing your finances</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your first name"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your last name"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Tenant Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Organization Name</label>
              <input
                type="text"
                name="tenantName"
                value={formData.tenantName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Your company or organization name"
                required
              />
              <p className="text-xs text-slate-500 mt-1">This will be used to generate your unique tenant ID</p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="USER">Standard User</option>
                <option value="ADMIN">Administrator</option>
                <option value="AUDITOR">Auditor</option>
              </select>
              <div className="text-xs text-slate-500 mt-1">
                {formData.role === "USER" && "• View accounts and transactions"}
                {formData.role === "ADMIN" && "• Full access to all features and user management"}
                {formData.role === "AUDITOR" && "• Access to audit logs and compliance features"}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Create a secure password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Registration Error</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in here
              </a>
            </p>
          </div>

          {/* System Status */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-600">LedgerPay Registration System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
