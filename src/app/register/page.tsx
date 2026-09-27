'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, User, Store, Building2 } from 'lucide-react';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as any) || 'USER';

  const [role, setRole] = useState<'USER' | 'SELLER' | 'NGO'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Seller specific
  const [shopName, setShopName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // NGO specific
  const [orgName, setOrgName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [address, setAddress] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name,
          email,
          phone,
          password,
          shopName: role === 'SELLER' ? shopName : undefined,
          websiteUrl: role === 'SELLER' ? websiteUrl : undefined,
          orgName: role === 'NGO' ? orgName : undefined,
          registrationNumber: role === 'NGO' ? registrationNumber : undefined,
          address: role === 'NGO' ? address : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      if (role === 'SELLER') router.push('/dashboard/seller');
      else if (role === 'NGO') router.push('/dashboard/ngo');
      else router.push('/discover');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Switcher */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setRole('USER')}
          className={`p-3 rounded-2xl font-bold transition flex flex-col items-center gap-1 border ${
            role === 'USER' ? 'bg-[#6C3B8F] text-[#FFF8EC] border-[#6C3B8F]' : 'bg-[#F6EEDC] text-[#241B29] border-[#6C3B8F]/15 hover:bg-[#E9DDF0]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Normal User</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('SELLER')}
          className={`p-3 rounded-2xl font-bold transition flex flex-col items-center gap-1 border ${
            role === 'SELLER' ? 'bg-[#432457] text-[#FFF8EC] border-[#432457]' : 'bg-[#F6EEDC] text-[#241B29] border-[#6C3B8F]/15 hover:bg-[#E9DDF0]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Shop Owner</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('NGO')}
          className={`p-3 rounded-2xl font-bold transition flex flex-col items-center gap-1 border ${
            role === 'NGO' ? 'bg-[#6C3B8F] text-[#FFF8EC] border-[#6C3B8F]' : 'bg-[#F6EEDC] text-[#241B29] border-[#6C3B8F]/15 hover:bg-[#E9DDF0]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>NGO Partner</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-4 text-xs shadow-xl">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-100 border border-red-200 text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[#432457] font-bold">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#432457] font-bold">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[#432457] font-bold">Email Address *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@domain.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[#432457] font-bold">Password *</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
          />
        </div>

        {/* Seller Fields */}
        {role === 'SELLER' && (
          <div className="space-y-4 pt-2 border-t border-[#6C3B8F]/15">
            <h4 className="font-bold text-[#432457]">Shop Details</h4>
            <div className="space-y-1">
              <label className="text-[#432457] font-bold">Shop / Brand Name *</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Earthly Threads Co."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#432457] font-bold">Official Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourbrand.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
              />
            </div>
          </div>
        )}

        {/* NGO Fields */}
        {role === 'NGO' && (
          <div className="space-y-4 pt-2 border-t border-[#6C3B8F]/15">
            <h4 className="font-bold text-[#432457]">Organization Details</h4>
            <div className="space-y-1">
              <label className="text-[#432457] font-bold">NGO Organization Name *</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Hope Clothing Trust"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Reg. Number</label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="NGO-98765-DL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Main Office City</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="City, State"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-1.5 shadow-md"
        >
          <span>{loading ? 'Creating Account...' : `Register as ${role}`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-14 space-y-8 bg-[#FFF8EC]">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-[#432457]">Partner with LUXU E-STORE</h1>
        <p className="text-xs text-[#746A78]">Join the social-impact apparel discovery and donation network.</p>
      </div>

      <Suspense fallback={
        <div className="p-12 text-center text-[#746A78]">Loading form...</div>
      }>
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}
