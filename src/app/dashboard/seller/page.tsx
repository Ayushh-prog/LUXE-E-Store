'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Store, 
  Package, 
  MousePointerClick, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  ExternalLink, 
  X,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SellerDashboardPage() {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    sizes: 'S,M,L,XL',
    colors: 'Black,White,Beige',
    material: '100% Organic Cotton',
    brand: '',
    externalProductUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
  });

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchDashboard();
    fetchCategories();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seller/dashboard');
      const data = await res.json();
      if (data.stats) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
        if (data.categories.length > 0) {
          setNewProduct(prev => ({ ...prev, categoryId: data.categories[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          imageUrls: [newProduct.imageUrl],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || 'Failed to create product');
        return;
      }

      setMsg('Product added successfully!');
      setShowAddModal(false);
      fetchDashboard();
    } catch (err: any) {
      setMsg(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-[#FFF8EC]">
        <div className="w-10 h-10 mx-auto border-4 border-[#432457] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const products = dashboardData?.products || [];
  const referrals = dashboardData?.recentReferrals || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#FFF8EC]">
      
      {/* Header Bar */}
      <div className="p-8 rounded-3xl bg-[#432457] border border-[#6C3B8F]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-[#FFF8EC]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6C3B8F] text-[#FFF8EC] flex items-center justify-center font-bold text-2xl shadow-md">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#FFF8EC]">
                {dashboardData?.seller?.shopName || 'Shop Owner Dashboard'}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E9DDF0] text-[#432457] px-2.5 py-0.5 rounded border border-white/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#6C3B8F]" /> Partner Boutique
              </span>
            </div>
            <p className="text-xs text-[#E9DDF0] mt-1">
              LUXU E-STORE Storefront & Referral Commerce Metrics
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#6C3B8F] hover:bg-[#A77BC4] text-[#FFF8EC] font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#6C3B8F]" /> Active Products
          </span>
          <span className="block font-serif text-2xl font-bold text-[#432457] font-mono">{stats.totalProducts || 0}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1.5">
            <MousePointerClick className="w-4 h-4 text-[#6C3B8F]" /> Referral Clicks
          </span>
          <span className="block font-serif text-2xl font-bold text-[#432457] font-mono">{stats.totalReferralClicks || 0}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#6C3B8F]" /> Conversions
          </span>
          <span className="block font-serif text-2xl font-bold text-[#432457] font-mono">{stats.totalConversions || 0}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#6C3B8F]" /> Gross Orders
          </span>
          <span className="block font-serif text-2xl font-bold text-[#432457] font-mono">₹{(stats.totalRevenueGenerated || 0).toLocaleString()}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1 col-span-2 md:col-span-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#6C3B8F]" /> Est. Commission
          </span>
          <span className="block font-serif text-2xl font-bold text-[#6C3B8F] font-mono">₹{(stats.totalEstimatedCommission || 0).toLocaleString()}</span>
        </div>

      </div>

      {/* Main Grid: Products Table + Referral Clicks Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Product Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#432457]">Your Listed Apparel ({products.length})</h3>
          </div>

          <div className="space-y-3">
            {products.map((p: any) => (
              <div key={p.id} className="p-4 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[#E9DDF0] shrink-0">
                    <Image src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'} alt={p.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#432457] text-sm line-clamp-1">{p.title}</h4>
                    <p className="text-xs text-[#6C3B8F] font-bold">{p.category?.name} • ₹{p.price}</p>
                    <span className="text-[10px] text-[#746A78] font-mono">Referral Clicks: {p._count?.referrals || 0}</span>
                  </div>
                </div>

                <a
                  href={p.externalProductUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#FFF8EC] hover:bg-[#E9DDF0] text-[#432457] text-xs font-bold flex items-center gap-1 border border-[#6C3B8F]/20"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#6C3B8F]" />
                  <span className="hidden sm:inline">External Link</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Referral Activity Stream */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#432457]">Recent Referral Activity</h3>
          <div className="p-5 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-3 text-xs">
            {referrals.length === 0 ? (
              <p className="text-[#746A78] text-center py-6">No referral clicks logged yet.</p>
            ) : (
              referrals.map((ref: any) => (
                <div key={ref.id} className="p-3.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/10 space-y-1">
                  <div className="flex justify-between font-bold text-[#432457]">
                    <span className="truncate max-w-[160px]">{ref.product?.title}</span>
                    <span className="font-mono text-[#6C3B8F]">₹{ref.product?.price}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#746A78]">
                    <span>Code: {ref.trackingCode}</span>
                    <span>{new Date(ref.clickedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#432457]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF8EC] border border-[#6C3B8F]/20 rounded-3xl max-w-xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#6C3B8F]/15 pb-4">
              <h3 className="font-serif text-xl font-bold text-[#432457]">Add Apparel to LUXU E-STORE</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#746A78] hover:text-[#432457]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="Handcrafted Linen Shirt"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6EEDC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#432457] font-bold">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F6EEDC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#432457] font-bold">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F6EEDC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Category *</label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6EEDC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Original External Shop URL *</label>
                <input
                  type="url"
                  required
                  value={newProduct.externalProductUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, externalProductUrl: e.target.value })}
                  placeholder="https://yourshop.com/product/123"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6EEDC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Image URL</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6EEDC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6EEDC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold py-3.5 rounded-xl transition text-sm shadow-md"
              >
                {submitting ? 'Publishing Product...' : 'Publish Product to LUXU E-STORE'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
