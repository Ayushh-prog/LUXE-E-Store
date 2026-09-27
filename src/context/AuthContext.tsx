'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'USER' | 'SELLER' | 'NGO' | 'ADMIN';
  sellerProfile?: any;
  ngoProfile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  wishlistCount: number;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateWishlistCount: () => Promise<void>;
  demoLogin: (role: 'USER' | 'SELLER' | 'NGO' | 'ADMIN') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateWishlistCount = async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      if (data.items) {
        setWishlistCount(data.items.length);
      }
    } catch (err) {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetchUser();
    updateWishlistCount();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      await updateWishlistCount();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setWishlistCount(0);
    window.location.href = '/';
  };

  const demoLogin = async (role: 'USER' | 'SELLER' | 'NGO' | 'ADMIN') => {
    const credentials: Record<string, string> = {
      USER: 'user@example.com',
      SELLER: 'seller@auraeco.com',
      NGO: 'ngo@clothforall.org',
      ADMIN: 'admin@impactapp.org',
    };

    const email = credentials[role];
    await login(email, 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        wishlistCount,
        login,
        logout,
        refreshUser: fetchUser,
        updateWishlistCount,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
