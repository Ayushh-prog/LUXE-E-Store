import React from 'react';
import Link from 'next/link';
import { Building2, CheckCircle2, MapPin, Phone, Gift } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export default async function NgosPage() {
  const ngos = await prisma.nGO.findMany({
    where: { isVerified: true },
    include: {
      _count: { select: { donations: true } },
    },
    orderBy: { orgName: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FFF8EC]">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C3B8F]">Verified Non-Profit Partners</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#432457]">Partner NGO Directory</h1>
        <p className="text-[#746A78] text-sm">
          Audited non-governmental organizations partnered with LUXU E-STORE accepting apparel donations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ngos.map((ngo) => (
          <div key={ngo.id} className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 flex flex-col justify-between space-y-6 hover:border-[#6C3B8F]/40 transition shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#E9DDF0] text-[#6C3B8F] flex items-center justify-center font-bold text-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-[#6C3B8F] text-[#FFF8EC] flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Audit Verified
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#432457]">{ngo.orgName}</h3>
                <p className="text-xs text-[#6C3B8F] font-bold">{ngo.city}, {ngo.state}</p>
                <p className="text-[10px] text-[#746A78] font-mono mt-0.5">Registration #{ngo.registrationNumber}</p>
              </div>

              <p className="text-xs text-[#746A78] leading-relaxed">
                {ngo.description}
              </p>

              <div className="p-4 rounded-2xl bg-[#FFF8EC] border border-[#6C3B8F]/10 space-y-2 text-xs">
                <span className="font-bold text-[#432457] block">Current Donation Needs:</span>
                <p className="text-[#746A78]">{ngo.donationRequirements}</p>
              </div>

              <div className="space-y-1 text-xs text-[#746A78] pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#6C3B8F]" />
                  <span>{ngo.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#6C3B8F]" />
                  <span>{ngo.phone}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/donate?ngoId=${ngo.id}`}
              className="w-full bg-[#432457] hover:bg-[#6C3B8F] text-[#FFF8EC] font-bold py-3.5 rounded-2xl border border-[#6C3B8F]/30 text-xs text-center transition flex items-center justify-center gap-2 shadow-md"
            >
              <Gift className="w-4 h-4 text-[#FFF8EC]" />
              <span>Donate to {ngo.orgName}</span>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
