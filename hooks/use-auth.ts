"use client";

import { useEffect, useState } from "react";

const TOKEN_KEY = "admin_token";
const ADMIN_KEY = "admin_info";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdmin(): { id: string; email: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(token: string, admin: { id: string; email: string; name: string }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useAuth() {
  const [admin, setAdmin] = useState<{
    id: string;
    email: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const stored = getStoredAdmin();

    if (!token || !stored) {
      clearAuth();
      setLoading(false);
      window.location.href = "/admin/login";
      return;
    }

    // Use stored admin info immediately — no API call needed
    setAdmin(stored);
    setLoading(false);
  }, []);

  const logout = () => {
    clearAuth();
    window.location.href = "/admin/login";
  };

  return { admin, loading, logout };
}
