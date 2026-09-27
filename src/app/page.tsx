import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Gift, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  Building2, 
  Store, 
  ChevronRight
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isAvailable: true, isApproved: true },
    orderBy: { likesCount: 'desc' },
    take: 6,
    include: {
      category: true,
      seller: { select: { id: true, shopName: true, logoUrl: true } },
      images: { orderBy: { position: 'asc' } },
    },
  });

  const ngos = await prisma.nGO.findMany({
    where: { isVerified: true },
    take: 3,
  });

  const sellers = await prisma.seller.findMany({
    where: { isApproved: true },
    take: 5,
  });

  return (
    <div className="space-y-20 pb-20 bg-[#FFF8EC]">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#FFF8EC] pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8 text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E9DDF0] text-[#432457] border border-[#6C3B8F]/20 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#6C3B8F]" />
                <span>LUXU E-STORE • Fashion Discovery & Social Impact</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[#432457] tracking-tight leading-[1.1]">
                Discover Fashion. <br />
                <span className="text-[#6C3B8F] italic font-serif">
                  Give Back.
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-[#746A78] leading-relaxed font-normal">
                Explore curated clothing from independent boutique sellers while supporting nationwide apparel donations to verified NGO partners.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/discover"
                  className="bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold px-8 py-4 rounded-2xl shadow-lg shadow-[#6C3B8F]/20 transition-all flex items-center justify-center gap-2 group text-base"
                >
                  <span>Explore Clothing</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/donate"
                  className="bg-transparent border-2 border-[#6C3B8F] text-[#6C3B8F] hover:bg-[#E9DDF0] font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-base"
                >
                  <Gift className="w-5 h-5 text-[#6C3B8F]" />
                  <span>Donate Clothes</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-8 flex flex-wrap items-center gap-6 text-xs text-[#746A78] font-medium border-t border-[#6C3B8F]/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6C3B8F]" />
                  <span>100% Direct Seller Referral</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#6C3B8F]" />
                  <span>Doorstep NGO Pickup</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#F6EEDC] bg-[#E9DDF0]">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000"
                  alt="LUXU Editorial Fashion"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#432457]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-[#FFF8EC]/90 backdrop-blur-md border border-[#6C3B8F]/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C3B8F]">LUXU Social Impact</span>
                  <h3 className="font-serif font-bold text-[#432457] text-lg">Fashion that gives back.</h3>
                  <p className="text-xs text-[#746A78] mt-0.5">Every clothing click & donation creates a second life for garments.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C3B8F]">Seamless & Impactful</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#432457]">How LUXU E-STORE Works</h2>
          <p className="text-[#746A78] text-sm">Connecting conscious buyers, ethical shop owners, and verified NGOs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/10 relative group hover:border-[#6C3B8F]/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-[#6C3B8F] text-[#FFF8EC] font-bold flex items-center justify-center text-xl mb-6 shadow-md">
              1
            </div>
            <h3 className="font-serif text-xl font-bold text-[#432457] mb-2">Discover</h3>
            <p className="text-xs text-[#746A78] leading-relaxed">
              Find unique clothing, handloom kurtas, jackets, and accessories from participating sellers.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/10 relative group hover:border-[#6C3B8F]/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-[#432457] text-[#FFF8EC] font-bold flex items-center justify-center text-xl mb-6 shadow-md">
              2
            </div>
            <h3 className="font-serif text-xl font-bold text-[#432457] mb-2">Shop Direct</h3>
            <p className="text-xs text-[#746A78] leading-relaxed">
              Visit the shop owner's website directly. Sellers receive customer orders with complete transparency.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/10 relative group hover:border-[#6C3B8F]/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-[#6C3B8F] text-[#FFF8EC] font-bold flex items-center justify-center text-xl mb-6 shadow-md">
              3
            </div>
            <h3 className="font-serif text-xl font-bold text-[#432457] mb-2">Give Back</h3>
            <p className="text-xs text-[#746A78] leading-relaxed">
              Donate clean unused clothing. Schedule doorstep pickup with verified NGO partners.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/10 relative group hover:border-[#6C3B8F]/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-[#432457] text-[#FFF8EC] font-bold flex items-center justify-center text-xl mb-6 shadow-md">
              4
            </div>
            <h3 className="font-serif text-xl font-bold text-[#432457] mb-2">Create Impact</h3>
            <p className="text-xs text-[#746A78] leading-relaxed">
              Help garments reach underprivileged families and children with full status tracking.
            </p>
          </div>

        </div>
      </section>

      {/* 3. FEATURED CLOTHING GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C3B8F]">Curated Collection</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#432457] mt-1">Featured Apparel</h2>
          </div>
          <Link
            href="/discover"
            className="text-[#6C3B8F] hover:text-[#432457] text-sm font-bold flex items-center gap-1 transition"
          >
            <span>Browse All Collection</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SOCIAL IMPACT SECTION (Light Lavender Background #E9DDF0) */}
      <section className="bg-[#E9DDF0] py-20 border-y border-[#6C3B8F]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C3B8F]">Social Impact Transparency</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#432457]">Our Collective Progress</h2>
            <p className="text-[#746A78] text-sm">Real metrics powered by donor actions and partner NGO updates.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 text-center">
            
            <div className="p-6 rounded-2xl bg-[#FFF8EC] border border-[#6C3B8F]/15 shadow-sm">
              <span className="block font-serif text-3xl sm:text-4xl font-bold text-[#432457] font-mono">1,480+</span>
              <span className="block text-xs text-[#6C3B8F] uppercase tracking-wider font-bold mt-2">Clothes Donated</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFF8EC] border border-[#6C3B8F]/15 shadow-sm">
              <span className="block font-serif text-3xl sm:text-4xl font-bold text-[#432457] font-mono">2,650+</span>
              <span className="block text-xs text-[#6C3B8F] uppercase tracking-wider font-bold mt-2">People Supported</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFF8EC] border border-[#6C3B8F]/15 shadow-sm">
              <span className="block font-serif text-3xl sm:text-4xl font-bold text-[#432457] font-mono">30+</span>
              <span className="block text-xs text-[#6C3B8F] uppercase tracking-wider font-bold mt-2">Partner NGOs</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFF8EC] border border-[#6C3B8F]/15 shadow-sm">
              <span className="block font-serif text-3xl sm:text-4xl font-bold text-[#432457] font-mono">45+</span>
              <span className="block text-xs text-[#6C3B8F] uppercase tracking-wider font-bold mt-2">Partner Shops</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFF8EC] border border-[#6C3B8F]/15 shadow-sm col-span-2 lg:col-span-1">
              <span className="block font-serif text-3xl sm:text-4xl font-bold text-[#432457] font-mono">820+</span>
              <span className="block text-xs text-[#6C3B8F] uppercase tracking-wider font-bold mt-2">Completed Drives</span>
            </div>

          </div>
        </div>
      </section>

      {/* 5. VERIFIED NGO PARTNERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C3B8F]">Verified Organizations</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#432457] mt-1">Our Partner NGOs</h2>
            <p className="text-[#746A78] text-sm mt-1">Audited non-profits providing apparel support across India.</p>
          </div>
          <Link
            href="/ngos"
            className="text-[#6C3B8F] hover:text-[#432457] text-sm font-bold flex items-center gap-1 transition"
          >
            <span>View All NGOs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ngos.map((ngo) => (
            <div key={ngo.id} className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 flex flex-col justify-between space-y-6 hover:border-[#6C3B8F]/40 transition shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#E9DDF0] text-[#6C3B8F] flex items-center justify-center font-bold text-xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase px-3 py-1 rounded-full bg-[#6C3B8F] text-[#FFF8EC] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified NGO
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-[#432457]">{ngo.orgName}</h3>
                  <p className="text-xs text-[#6C3B8F] font-bold">{ngo.city}, {ngo.state}</p>
                </div>

                <p className="text-xs text-[#746A78] leading-relaxed line-clamp-3">
                  {ngo.description}
                </p>

                <div className="p-3.5 rounded-xl bg-[#FFF8EC] text-xs text-[#241B29] border border-[#6C3B8F]/10">
                  <span className="font-bold text-[#432457] block mb-1">Current Requirements:</span>
                  <p className="line-clamp-2 text-[#746A78]">{ngo.donationRequirements}</p>
                </div>
              </div>

              <Link
                href={`/donate?ngoId=${ngo.id}`}
                className="w-full bg-[#432457] hover:bg-[#6C3B8F] text-[#FFF8EC] font-bold py-3.5 rounded-xl text-xs text-center transition block shadow-md"
              >
                Donate to {ngo.orgName}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PARTICIPATING SELLER SHOPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C3B8F]">Independent Boutiques</span>
          <h2 className="font-serif text-3xl font-bold text-[#432457] mt-1">Participating Brands</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {sellers.map((seller) => (
            <div key={seller.id} className="p-4 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/10 text-center space-y-2 hover:border-[#6C3B8F]/30 transition">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#E9DDF0] text-[#6C3B8F] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#241B29] truncate">{seller.shopName}</h4>
              <p className="text-[10px] text-[#746A78] truncate">{seller.location || 'India'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#432457] p-10 sm:p-16 border border-[#6C3B8F]/30 text-center space-y-6 shadow-2xl overflow-hidden text-[#FFF8EC]">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FFF8EC]">
            Your style can make a difference.
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#E9DDF0] leading-relaxed">
            Join conscious shoppers and donors creating a zero-waste, social impact clothing movement with LUXU E-STORE.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/discover"
              className="bg-[#FFF8EC] text-[#432457] font-bold px-8 py-3.5 rounded-2xl hover:bg-[#E9DDF0] transition text-sm"
            >
              Explore Clothing
            </Link>
            <Link
              href="/donate"
              className="bg-[#6C3B8F] hover:bg-[#A77BC4] text-[#FFF8EC] font-bold px-8 py-3.5 rounded-2xl transition text-sm shadow-lg shadow-[#6C3B8F]/40"
            >
              Donate Clothes Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
