'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      if (data.items) {
        setWishlistItems(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-[#FFF8EC]">
        <div className="w-10 h-10 mx-auto border-4 border-[#6C3B8F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 bg-[#FFF8EC]">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#E9DDF0] text-[#6C3B8F] flex items-center justify-center">
          <Heart className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#432457]">Sign In Required</h2>
        <p className="text-[#746A78] text-sm">Save your favorite luxury fashion pieces to your personal wishlist by signing in.</p>
        <Link href="/login" className="inline-block bg-[#6C3B8F] text-[#FFF8EC] font-bold px-6 py-3 rounded-xl text-xs">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FFF8EC]">
      <div className="border-b border-[#6C3B8F]/15 pb-6">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C3B8F]">Your Saved Pieces</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#432457] mt-1">My Wishlist ({wishlistItems.length})</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E9DDF0] text-[#6C3B8F] flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#432457]">Your wishlist is currently empty</h3>
          <p className="text-xs text-[#746A78] max-w-sm mx-auto">Explore LUXU E-STORE apparel collection and click the heart icon on products you love.</p>
          <Link href="/discover" className="inline-block bg-[#6C3B8F] text-[#FFF8EC] font-bold text-xs px-6 py-3 rounded-xl shadow">
            Explore Apparel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
