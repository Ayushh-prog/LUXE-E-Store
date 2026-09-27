'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, ArrowUpRight, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#432457] text-[#FFF8EC] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#6C3B8F] flex items-center justify-center text-[#FFF8EC] shadow-lg">
                <Sparkles className="w-5 h-5 text-[#FFF8EC]" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#FFF8EC]">
                  LUXU
                </span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#E9DDF0] font-bold -mt-0.5">
                  E-STORE
                </span>
              </div>
            </Link>
            <p className="text-[#E9DDF0] max-w-sm leading-relaxed text-xs">
              LUXU E-STORE is a modern fashion discovery and referral marketplace connected with verified NGO apparel donation networks.
            </p>
            <p className="font-serif text-base italic text-[#E9DDF0] pt-1">
              "Fashion that gives back."
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-[#6C3B8F]/30 flex items-center justify-center hover:bg-[#6C3B8F] text-[#FFF8EC] transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#6C3B8F]/30 flex items-center justify-center hover:bg-[#6C3B8F] text-[#FFF8EC] transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#6C3B8F]/30 flex items-center justify-center hover:bg-[#6C3B8F] text-[#FFF8EC] transition">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-[#FFF8EC] font-bold mb-4 tracking-wider uppercase text-xs">Discover</h4>
            <ul className="space-y-2 text-xs text-[#E9DDF0]">
              <li><Link href="/discover" className="hover:text-[#FFF8EC] transition">All Apparel</Link></li>
              <li><Link href="/discover?category=womens-clothing" className="hover:text-[#FFF8EC] transition">Women's Fashion</Link></li>
              <li><Link href="/discover?category=mens-clothing" className="hover:text-[#FFF8EC] transition">Men's Collection</Link></li>
              <li><Link href="/discover?category=ethnic-traditional-wear" className="hover:text-[#FFF8EC] transition">Ethnic & Handloom</Link></li>
              <li><Link href="/discover?category=winter-wear" className="hover:text-[#FFF8EC] transition">Winter Essentials</Link></li>
            </ul>
          </div>

          {/* Social Impact */}
          <div>
            <h4 className="text-[#FFF8EC] font-bold mb-4 tracking-wider uppercase text-xs">Social Impact</h4>
            <ul className="space-y-2 text-xs text-[#E9DDF0]">
              <li><Link href="/donate" className="hover:text-[#FFF8EC] transition font-bold text-[#FFF8EC]">Donate Clothes Now</Link></li>
              <li><Link href="/ngos" className="hover:text-[#FFF8EC] transition">Verified Partner NGOs</Link></li>
              <li><Link href="/impact" className="hover:text-[#FFF8EC] transition">Our Impact Metrics</Link></li>
              <li><Link href="/donate#guidelines" className="hover:text-[#FFF8EC] transition">Donation Guidelines</Link></li>
              <li><Link href="/register?role=NGO" className="hover:text-[#FFF8EC] transition">Register as NGO Partner</Link></li>
            </ul>
          </div>

          {/* Partner Portals */}
          <div>
            <h4 className="text-[#FFF8EC] font-bold mb-4 tracking-wider uppercase text-xs">Partner With Us</h4>
            <ul className="space-y-2 text-xs text-[#E9DDF0]">
              <li><Link href="/register?role=SELLER" className="hover:text-[#FFF8EC] transition">List Clothing Shop</Link></li>
              <li><Link href="/login" className="hover:text-[#FFF8EC] transition">Shop Owner Portal</Link></li>
              <li><Link href="/login" className="hover:text-[#FFF8EC] transition">NGO Portal</Link></li>
              <li><Link href="/login" className="hover:text-[#FFF8EC] transition">Admin Portal</Link></li>
              <li><Link href="/impact" className="hover:text-[#FFF8EC] transition">Contact & Support</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#6C3B8F]/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#E9DDF0]">
          <p>© {new Date().getFullYear()} LUXU E-STORE. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Referral Policy</a>
            <a href="#" className="hover:underline">NGO Verification Standard</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
