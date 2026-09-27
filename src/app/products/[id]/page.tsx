'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Heart, 
  ExternalLink, 
  Store, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  Share2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user, updateWishlistCount } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [liked, setLiked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
        if (data.product.sizes) {
          const sizesArr = data.product.sizes.split(',');
          setSelectedSize(sizesArr[0]);
        }
        if (data.product.colors) {
          const colorsArr = data.product.colors.split(',');
          setSelectedColor(colorsArr[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    setLiked(!liked);
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
      console.error(err);
    }
  };

  const handleShopAtSeller = async () => {
    setRedirecting(true);
    try {
      const res = await fetch('/api/referrals/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          source: 'product_detail_page',
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
      setRedirecting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center bg-[#FFF8EC]">
        <div className="w-12 h-12 rounded-full border-4 border-[#6C3B8F] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 bg-[#FFF8EC]">
        <h2 className="font-serif text-2xl font-bold text-[#432457]">Product Not Found</h2>
        <p className="text-[#746A78] text-sm">The item you are looking for may have been updated or removed.</p>
        <Link href="/discover" className="inline-block bg-[#6C3B8F] text-[#FFF8EC] px-6 py-2.5 rounded-xl text-xs font-bold">
          Return to Discover
        </Link>
      </div>
    );
  }

  const sizesList = product.sizes ? product.sizes.split(',') : [];
  const colorsList = product.colors ? product.colors.split(',') : [];
  const imagesList = product.images && product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#FFF8EC]">
      
      {/* Back link */}
      <Link href="/discover" className="inline-flex items-center gap-2 text-xs font-bold text-[#6C3B8F] hover:text-[#432457] transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Collection</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#F6EEDC] border border-[#6C3B8F]/15 shadow-xl">
            <Image
              src={imagesList[activeImageIndex]?.url || imagesList[0].url}
              alt={product.title}
              fill
              priority
              className="object-cover object-center"
            />
            {product.category && (
              <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider bg-[#432457] text-[#FFF8EC] px-3 py-1 rounded-full shadow">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imagesList.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIndex === idx ? 'border-[#6C3B8F] scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Details */}
        <div className="space-y-8">
          
          {/* Seller Header */}
          <div className="flex items-center justify-between border-b border-[#6C3B8F]/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E9DDF0] text-[#6C3B8F] flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#432457] text-sm">{product.seller?.shopName || 'Partner Shop'}</span>
                  <CheckCircle2 className="w-4 h-4 text-[#6C3B8F]" />
                </div>
                <span className="text-xs text-[#746A78]">{product.seller?.location || 'Verified Boutique'}</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-[#F6EEDC] hover:bg-[#E9DDF0] text-[#432457] transition text-xs flex items-center gap-1.5 font-bold"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied Link!' : 'Share'}</span>
            </button>
          </div>

          {/* Title & Price */}
          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#432457] leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#6C3B8F] font-mono">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-[#746A78] line-through font-mono">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-bold uppercase tracking-wider bg-[#6C3B8F] text-[#FFF8EC] px-2.5 py-0.5 rounded-full shadow">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 text-xs text-[#241B29] leading-relaxed">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#432457]">Garment Description</h4>
            <p className="text-[#746A78] text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Options: Sizes & Colors */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            {/* Sizes */}
            {sizesList.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#432457]">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizesList.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                        selectedSize === size
                          ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md'
                          : 'bg-[#F6EEDC] text-[#241B29] border border-[#6C3B8F]/15 hover:bg-[#E9DDF0]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {colorsList.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#432457]">Available Colors</label>
                <div className="flex flex-wrap gap-2">
                  {colorsList.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                        selectedColor === color
                          ? 'bg-[#6C3B8F] text-[#FFF8EC]'
                          : 'bg-[#F6EEDC] text-[#241B29] border border-[#6C3B8F]/15 hover:bg-[#E9DDF0]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Material & Specifications */}
          <div className="p-4 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#746A78]">Material Composition:</span>
              <span className="text-[#432457] font-bold">{product.material || 'Sustainable Fabric'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#746A78]">Brand / Collection:</span>
              <span className="text-[#432457] font-bold">{product.brand || product.seller?.shopName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#746A78]">Referral Commission:</span>
              <span className="text-[#6C3B8F] font-bold">12.5% Allocated to Social Impact</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleShopAtSeller}
              disabled={redirecting}
              className="w-full bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold py-4 rounded-2xl transition shadow-lg shadow-[#6C3B8F]/25 flex items-center justify-center gap-2 text-base"
            >
              <span>{redirecting ? 'Generating referral link...' : 'Shop at Original Seller'}</span>
              <ExternalLink className="w-5 h-5" />
            </button>

            <button
              onClick={handleLike}
              className={`w-full font-bold py-3.5 rounded-2xl transition border flex items-center justify-center gap-2 text-sm ${
                liked
                  ? 'bg-[#6C3B8F] text-[#FFF8EC] border-[#6C3B8F]'
                  : 'bg-[#F6EEDC] text-[#432457] border-[#6C3B8F]/20 hover:bg-[#E9DDF0]'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{liked ? 'Saved in Wishlist' : '♡ Save to Wishlist'}</span>
            </button>
          </div>

          {/* Social Impact Explanation Box */}
          <div className="p-5 rounded-2xl bg-[#E9DDF0] border border-[#6C3B8F]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#432457] font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#6C3B8F]" />
              <span>LUXU E-STORE Referral Model</span>
            </div>
            <p className="text-xs text-[#746A78] leading-relaxed">
              When you click "Shop at Original Seller", LUXU E-STORE tracks your referral to the shop owner's website. Agreed partner margins help fund clothing pickup logistics for underprivileged communities.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
