'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Heart, 
  Gift, 
  User as UserIcon, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Store, 
  Building2, 
  LogOut,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const { user, wishlistCount, logout, demoLogin } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#FFF8EC]/95 backdrop-blur-md border-b border-[#6C3B8F]/10 text-[#241B29] transition-all">
      {/* Top Banner Notice */}
      <div className="bg-[#432457] text-[#FFF8EC] text-xs py-1.5 px-4 text-center flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-[#6C3B8F] text-[#FFF8EC] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Social Impact</span>
          <span className="font-light">Fashion discovery + referral commerce with verified NGO clothing donations.</span>
        </div>

        {/* Demo Role Selector Bar */}
        <div className="hidden lg:flex items-center gap-2 text-[11px]">
          <span className="text-purple-200">Demo Roles:</span>
          <button onClick={() => demoLogin('USER')} className="hover:text-[#A77BC4] underline transition font-medium">User</button>
          <span>•</span>
          <button onClick={() => demoLogin('SELLER')} className="hover:text-[#A77BC4] underline transition font-medium">Shop Owner</button>
          <span>•</span>
          <button onClick={() => demoLogin('NGO')} className="hover:text-[#A77BC4] underline transition font-medium">NGO Portal</button>
          <span>•</span>
          <button onClick={() => demoLogin('ADMIN')} className="hover:text-[#A77BC4] underline transition font-medium">Admin</button>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - LUXU E-STORE */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#6C3B8F] flex items-center justify-center text-[#FFF8EC] shadow-md shadow-[#6C3B8F]/20 group-hover:bg-[#432457] transition-all">
            <Sparkles className="w-5 h-5 text-[#FFF8EC]" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#432457] leading-none block">
              LUXU
            </span>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-[#6C3B8F] font-bold mt-0.5">
              E-STORE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <Link 
            href="/" 
            className={`transition ${isActive('/') ? 'text-[#6C3B8F] font-bold border-b-2 border-[#6C3B8F] pb-1' : 'text-[#241B29] hover:text-[#6C3B8F]'}`}
          >
            Home
          </Link>
          <Link 
            href="/discover" 
            className={`transition ${isActive('/discover') ? 'text-[#6C3B8F] font-bold border-b-2 border-[#6C3B8F] pb-1' : 'text-[#241B29] hover:text-[#6C3B8F]'}`}
          >
            Discover Fashion
          </Link>
          <Link 
            href="/impact" 
            className={`transition ${isActive('/impact') ? 'text-[#6C3B8F] font-bold border-b-2 border-[#6C3B8F] pb-1' : 'text-[#241B29] hover:text-[#6C3B8F]'}`}
          >
            Our Impact
          </Link>
          <Link 
            href="/ngos" 
            className={`transition ${isActive('/ngos') ? 'text-[#6C3B8F] font-bold border-b-2 border-[#6C3B8F] pb-1' : 'text-[#241B29] hover:text-[#6C3B8F]'}`}
          >
            Partner NGOs
          </Link>
          <Link 
            href="/donate" 
            className="flex items-center gap-1.5 text-[#6C3B8F] font-bold hover:text-[#432457] transition bg-[#E9DDF0] px-3.5 py-1.5 rounded-full border border-[#6C3B8F]/20"
          >
            <Gift className="w-4 h-4" />
            <span>Donate Clothes</span>
          </Link>
        </div>

        {/* Right Utility & User Area */}
        <div className="flex items-center gap-4">
          {/* Wishlist Icon Link */}
          <Link 
            href="/wishlist" 
            className="relative p-2.5 rounded-full bg-[#F6EEDC] hover:bg-[#E9DDF0] text-[#432457] transition"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6C3B8F] text-[#FFF8EC] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Account / Login State */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#F6EEDC] hover:bg-[#E9DDF0] border border-[#6C3B8F]/20 transition text-sm text-[#432457]"
              >
                <div className="w-8 h-8 rounded-full bg-[#6C3B8F] text-[#FFF8EC] font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[100px] truncate font-semibold text-[#241B29]">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-[#746A78]" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFF8EC] border border-[#6C3B8F]/20 shadow-2xl p-2 z-50 text-sm text-[#241B29]"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#6C3B8F]/10">
                    <p className="font-semibold text-[#432457]">{user.name}</p>
                    <p className="text-xs text-[#746A78] truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E9DDF0] text-[#6C3B8F]">
                      Role: {user.role}
                    </span>
                  </div>

                  <div className="py-2 space-y-1">
                    {user.role === 'USER' && (
                      <>
                        <Link href="/dashboard/user" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#E9DDF0] transition" onClick={() => setUserDropdownOpen(false)}>
                          <UserIcon className="w-4 h-4 text-[#6C3B8F]" />
                          <span>My Dashboard</span>
                        </Link>
                        <Link href="/donate" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#E9DDF0] transition" onClick={() => setUserDropdownOpen(false)}>
                          <Gift className="w-4 h-4 text-[#6C3B8F]" />
                          <span>Submit Donation</span>
                        </Link>
                      </>
                    )}

                    {user.role === 'SELLER' && (
                      <Link href="/dashboard/seller" className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#E9DDF0] text-[#432457] hover:bg-[#A77BC4]/20 transition font-bold" onClick={() => setUserDropdownOpen(false)}>
                        <Store className="w-4 h-4 text-[#6C3B8F]" />
                        <span>Shop Owner Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'NGO' && (
                      <Link href="/dashboard/ngo" className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#E9DDF0] text-[#432457] hover:bg-[#A77BC4]/20 transition font-bold" onClick={() => setUserDropdownOpen(false)}>
                        <Building2 className="w-4 h-4 text-[#6C3B8F]" />
                        <span>NGO Portal Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link href="/dashboard/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#432457] text-[#FFF8EC] hover:bg-[#6C3B8F] transition font-bold" onClick={() => setUserDropdownOpen(false)}>
                        <ShieldCheck className="w-4 h-4 text-[#FFF8EC]" />
                        <span>Admin Portal</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-[#6C3B8F]/10 pt-2">
                    <button 
                      onClick={() => { setUserDropdownOpen(false); logout(); }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="hidden sm:inline-block text-sm font-semibold text-[#432457] hover:text-[#6C3B8F] transition"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-md shadow-[#6C3B8F]/20 flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#F6EEDC] text-[#432457]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#6C3B8F]/10 bg-[#FFF8EC] px-4 py-6 space-y-4">
          <div className="flex flex-col space-y-3 font-semibold text-[#241B29]">
            <Link href="/" className="hover:text-[#6C3B8F] py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/discover" className="hover:text-[#6C3B8F] py-2" onClick={() => setMobileMenuOpen(false)}>Discover Fashion</Link>
            <Link href="/impact" className="hover:text-[#6C3B8F] py-2" onClick={() => setMobileMenuOpen(false)}>Our Impact</Link>
            <Link href="/ngos" className="hover:text-[#6C3B8F] py-2" onClick={() => setMobileMenuOpen(false)}>Partner NGOs</Link>
            <Link href="/donate" className="text-[#6C3B8F] py-2 font-bold flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <Gift className="w-4 h-4" />
              <span>Donate Clothes</span>
            </Link>
          </div>

          <div className="border-t border-[#6C3B8F]/10 pt-4 space-y-2">
            <p className="text-xs uppercase text-[#746A78] tracking-wider font-bold">Quick Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => { demoLogin('USER'); setMobileMenuOpen(false); }} className="p-2 rounded bg-[#F6EEDC] text-left text-[#432457] font-semibold">👤 User</button>
              <button onClick={() => { demoLogin('SELLER'); setMobileMenuOpen(false); }} className="p-2 rounded bg-[#F6EEDC] text-left text-[#432457] font-semibold">🏪 Shop Owner</button>
              <button onClick={() => { demoLogin('NGO'); setMobileMenuOpen(false); }} className="p-2 rounded bg-[#F6EEDC] text-left text-[#432457] font-semibold">🏛️ NGO Portal</button>
              <button onClick={() => { demoLogin('ADMIN'); setMobileMenuOpen(false); }} className="p-2 rounded bg-[#F6EEDC] text-left text-[#432457] font-semibold">🛡️ Admin</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
