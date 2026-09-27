'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ExternalLink, Eye, Store, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    brand?: string | null;
    sizes: string;
    colors: string;
    likesCount: number;
    externalProductUrl: string;
    category?: { name: string; slug: string };
    seller: { id: string; shopName: string; logoUrl?: string | null };
    images: { url: string; alt?: string | null }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user, updateWishlistCount } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(product.likesCount);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);

    try {
      await fetch(`/api/products/${product.id}/like`, { method: 'POST' });
      if (user) {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });
        updateWishlistCount();
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleShopAtSeller = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTrackingLoading(true);

    try {
      const res = await fetch('/api/referrals/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          source: 'product_card',
        }),
      });

      const data = await res.json();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.open(product.externalProductUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      window.open(product.externalProductUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setTrackingLoading(false);
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 overflow-hidden hover:border-[#6C3B8F]/40 transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:shadow-[#6C3B8F]/10 hover:-translate-y-0.5">
      
      {/* Top Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#E9DDF0]/50">
        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#241B29]/60 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.category && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#432457] text-[#FFF8EC] px-2.5 py-1 rounded-full shadow">
              {product.category.name}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#6C3B8F] text-[#FFF8EC] px-2.5 py-0.5 rounded-full shadow">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top Right Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            liked
              ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md shadow-[#6C3B8F]/30'
              : 'bg-[#FFF8EC]/80 text-[#746A78] hover:bg-[#FFF8EC] hover:text-[#6C3B8F] border border-[#6C3B8F]/20'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <Link
            href={`/products/${product.slug}`}
            className="w-full bg-[#FFF8EC] hover:bg-[#E9DDF0] text-[#432457] text-xs font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
          >
            <Eye className="w-4 h-4 text-[#6C3B8F]" />
            <span>Quick View Details</span>
          </Link>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller / Brand Info */}
          <div className="flex items-center justify-between text-xs text-[#746A78] mb-1.5 font-medium">
            <div className="flex items-center gap-1.5 truncate">
              <Store className="w-3.5 h-3.5 text-[#6C3B8F]" />
              <span className="truncate">{product.seller?.shopName || product.brand || 'Artisan Seller'}</span>
              <CheckCircle2 className="w-3 h-3 text-[#6C3B8F]" />
            </div>
            <span className="text-[11px] text-[#746A78]">♡ {likesCount}</span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-lg font-bold text-[#241B29] group-hover:text-[#6C3B8F] transition line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Description Excerpt */}
          <p className="text-xs text-[#746A78] mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#6C3B8F]/10 flex items-center justify-between gap-3">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#6C3B8F] font-mono">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#746A78] line-through font-mono">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <span className="text-[10px] text-[#432457] font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#6C3B8F]" /> 12.5% Social Margin
            </span>
          </div>

          {/* Primary Referral Action Button */}
          <button
            onClick={handleShopAtSeller}
            disabled={trackingLoading}
            className="bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-[#6C3B8F]/20"
          >
            <span>{trackingLoading ? 'Redirecting...' : 'Shop Now'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
