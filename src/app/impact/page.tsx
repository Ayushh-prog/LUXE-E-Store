import React from 'react';
import Link from 'next/link';
import { Sparkles, Gift, Heart, Building2, Store, Users, CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export default async function ImpactPage() {
  const totalDonations = await prisma.donation.count();
  const allDonations = await prisma.donation.findMany({
    select: { approximateQuantity: true, status: true },
  });

  const totalClothesDonated = allDonations.reduce((acc, curr) => acc + curr.approximateQuantity, 0);
  const collectedClothes = allDonations
    .filter(d => ['COLLECTED', 'DISTRIBUTED'].includes(d.status))
    .reduce((acc, curr) => acc + curr.approximateQuantity, 0);

  const peopleSupported = Math.round(collectedClothes * 1.8);
  const verifiedNGOs = await prisma.nGO.count({ where: { isVerified: true } });
  const activeSellers = await prisma.seller.count({ where: { isApproved: true } });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-[#FFF8EC]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C3B8F]">Transparent Social Governance</span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#432457]">Our Measurable Impact</h1>
        <p className="text-[#746A78] text-base leading-relaxed">
          LUXU E-STORE bridges ethical apparel discovery with direct NGO clothing distribution. Every referral generated and garment donated creates tangible social value.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        
        <div className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-2 shadow-sm">
          <span className="block font-serif text-4xl sm:text-5xl font-bold text-[#432457] font-mono">{totalClothesDonated.toLocaleString()}+</span>
          <span className="block text-xs text-[#6C3B8F] font-bold uppercase tracking-wider">Garments Donated</span>
        </div>

        <div className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-2 shadow-sm">
          <span className="block font-serif text-4xl sm:text-5xl font-bold text-[#432457] font-mono">{peopleSupported.toLocaleString()}+</span>
          <span className="block text-xs text-[#6C3B8F] font-bold uppercase tracking-wider">People Supported</span>
        </div>

        <div className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-2 shadow-sm">
          <span className="block font-serif text-4xl sm:text-5xl font-bold text-[#432457] font-mono">{verifiedNGOs}</span>
          <span className="block text-xs text-[#6C3B8F] font-bold uppercase tracking-wider">Verified NGO Partners</span>
        </div>

        <div className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-2 shadow-sm">
          <span className="block font-serif text-4xl sm:text-5xl font-bold text-[#432457] font-mono">{activeSellers}</span>
          <span className="block text-xs text-[#6C3B8F] font-bold uppercase tracking-wider">Independent Shops</span>
        </div>

      </div>

      {/* Philosophy Section */}
      <div className="p-10 rounded-3xl bg-[#E9DDF0] border border-[#6C3B8F]/20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-md">
        <div className="space-y-4">
          <h2 className="font-serif text-3xl font-bold text-[#432457]">Zero-Waste Clothing Lifecycle</h2>
          <p className="text-sm text-[#746A78] leading-relaxed">
            Fast fashion leads to millions of tons of wearable textiles entering landfills every year. LUXU E-STORE's dual model ensures that conscious apparel purchases empower independent shops, while unused garments reach individuals in need with full status tracking.
          </p>
          <div className="space-y-2 text-xs text-[#241B29]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6C3B8F]" />
              <span className="font-medium">Transparent status history from Submission to Distribution</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6C3B8F]" />
              <span className="font-medium">Affiliate referral margin allocated to NGO logistics</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#FFF8EC] border border-[#6C3B8F]/15 text-center space-y-4 shadow-sm">
          <Sparkles className="w-10 h-10 text-[#6C3B8F] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#432457]">Join the Social Impact Movement</h3>
          <p className="text-xs text-[#746A78] max-w-sm mx-auto">Whether you are a donor, fashion brand owner, or NGO coordinator, your participation matters.</p>
          <div className="flex justify-center gap-3">
            <Link href="/donate" className="bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] text-xs font-bold px-5 py-2.5 rounded-xl shadow-md">
              Donate Clothes Now
            </Link>
            <Link href="/discover" className="bg-[#E9DDF0] hover:bg-[#6C3B8F] text-[#432457] hover:text-[#FFF8EC] text-xs font-bold px-5 py-2.5 rounded-xl transition">
              Explore Apparel
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
