'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, Store, Building2, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Invalid credentials');
      setLoading(false);
    } else {
      router.push('/discover');
    }
  };

  const handleQuickDemo = async (role: 'USER' | 'SELLER' | 'NGO' | 'ADMIN') => {
    setLoading(true);
    await demoLogin(role);
    if (role === 'SELLER') router.push('/dashboard/seller');
    else if (role === 'NGO') router.push('/dashboard/ngo');
    else if (role === 'ADMIN') router.push('/dashboard/admin');
    else router.push('/dashboard/user');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8 bg-[#FFF8EC]">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#6C3B8F] flex items-center justify-center text-[#FFF8EC] shadow-md">
          <Sparkles className="w-6 h-6 text-[#FFF8EC]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#432457]">Welcome to LUXU E-STORE</h1>
        <p className="text-xs text-[#746A78]">Sign in to access your discovery wishlist, donation history, or partner portal.</p>
      </div>

      {/* 1-Click Demo Login Box */}
      <div className="p-4 rounded-2xl bg-[#E9DDF0] border border-[#6C3B8F]/20 space-y-2 text-xs">
        <span className="font-bold text-[#432457] block text-center uppercase tracking-wider text-[10px]">⚡ Quick 1-Click Demo Logins</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickDemo('USER')}
            className="p-2.5 rounded-xl bg-[#FFF8EC] hover:bg-[#F6EEDC] text-[#432457] font-bold border border-[#6C3B8F]/20 text-left flex items-center gap-1.5 transition"
          >
            <User className="w-3.5 h-3.5 text-[#6C3B8F]" /> User
          </button>

          <button
            onClick={() => handleQuickDemo('SELLER')}
            className="p-2.5 rounded-xl bg-[#FFF8EC] hover:bg-[#F6EEDC] text-[#432457] font-bold border border-[#6C3B8F]/20 text-left flex items-center gap-1.5 transition"
          >
            <Store className="w-3.5 h-3.5 text-[#6C3B8F]" /> Shop Owner
          </button>

          <button
            onClick={() => handleQuickDemo('NGO')}
            className="p-2.5 rounded-xl bg-[#FFF8EC] hover:bg-[#F6EEDC] text-[#432457] font-bold border border-[#6C3B8F]/20 text-left flex items-center gap-1.5 transition"
          >
            <Building2 className="w-3.5 h-3.5 text-[#6C3B8F]" /> NGO Portal
          </button>

          <button
            onClick={() => handleQuickDemo('ADMIN')}
            className="p-2.5 rounded-xl bg-[#FFF8EC] hover:bg-[#F6EEDC] text-[#432457] font-bold border border-[#6C3B8F]/20 text-left flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#6C3B8F]" /> Admin Panel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-4 shadow-xl text-xs">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-100 border border-red-200 text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[#432457] font-bold">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[#432457] font-bold">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-1.5 shadow-md"
        >
          <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-[#746A78] text-xs pt-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#6C3B8F] font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </form>

    </div>
  );
}
