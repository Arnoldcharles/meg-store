"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Lightweight local auth context. Stores a minimal user object in localStorage.
// This replaces the previous Firebase-based auth so the app is fully local.

const STORAGE_KEY = "meg_user";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
    setLoading(false);
  }, []);

  const persist = (u: any) => {
    setUser(u);
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  // Accept any credentials for local auth. For signup, we emulate email verification flow.
  const login = async (email: string, _password: string) => {
    const u = { email, emailVerified: true };
    persist(u);
    return u;
  };

  const signup = async (email: string, _password: string) => {
    // Newly signed up users are marked unverified until they 'resend' verification.
    const u = { email, emailVerified: false };
    persist(u);
    return u;
  };

  const resendVerification = async () => {
    if (!user) return null;
    const u = { ...user, emailVerified: true };
    persist(u);
    return u;
  };

  const logout = async () => {
    persist(null);
  };

  const loginWithGoogle = async () => {
    // Emulate a Google login — mark as verified
    const u = { email: "google-user@local", emailVerified: true };
    persist(u);
    return u;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loginWithGoogle, resendVerification }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
