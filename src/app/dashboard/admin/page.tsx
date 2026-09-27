'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  Building2, 
  Package, 
  Gift, 
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'analytics' | 'sellers' | 'ngos' | 'products' | 'donations'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [ngos, setNgos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const res = await fetch('/api/admin/analytics');
        const data = await res.json();
        if (data.analytics) setAnalytics(data.analytics);
      } else if (activeTab === 'sellers') {
        const res = await fetch('/api/admin/sellers');
        const data = await res.json();
        if (data.sellers) setSellers(data.sellers);
      } else if (activeTab === 'ngos') {
        const res = await fetch('/api/admin/ngos');
        const data = await res.json();
        if (data.ngos) setNgos(data.ngos);
      } else if (activeTab === 'products') {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } else if (activeTab === 'donations') {
        const res = await fetch('/api/donations');
        const data = await res.json();
        if (data.donations) setDonations(data.donations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSeller = async (sellerId: string, isApproved: boolean) => {
    try {
      await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, isApproved: !isApproved }),
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleNgo = async (ngoId: string, isVerified: boolean) => {
    try {
      await fetch('/api/admin/ngos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngoId, isVerified: !isVerified }),
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProductFeature = async (productId: string, isFeatured: boolean) => {
    try {
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, isFeatured: !isFeatured }),
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FFF8EC]">
      
      {/* Admin Deep Purple Header Banner */}
      <div className="p-8 rounded-3xl bg-[#432457] border border-[#6C3B8F]/30 flex items-center justify-between shadow-xl text-[#FFF8EC]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6C3B8F] text-[#FFF8EC] flex items-center justify-center font-bold text-2xl shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#FFF8EC]">LUXU E-STORE Administrator Portal</h1>
            <p className="text-xs text-[#E9DDF0] mt-0.5 font-medium">Approve Shops, Verify NGOs, Moderate Products & Monitor Social Impact</p>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#6C3B8F]/15 pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition ${
            activeTab === 'analytics' ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md' : 'text-[#746A78] hover:text-[#432457] hover:bg-[#E9DDF0]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Platform Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('sellers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition ${
            activeTab === 'sellers' ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md' : 'text-[#746A78] hover:text-[#432457] hover:bg-[#E9DDF0]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Manage Sellers</span>
        </button>

        <button
          onClick={() => setActiveTab('ngos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition ${
            activeTab === 'ngos' ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md' : 'text-[#746A78] hover:text-[#432457] hover:bg-[#E9DDF0]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Manage NGOs</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition ${
            activeTab === 'products' ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md' : 'text-[#746A78] hover:text-[#432457] hover:bg-[#E9DDF0]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Moderate Products</span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition ${
            activeTab === 'donations' ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md' : 'text-[#746A78] hover:text-[#432457] hover:bg-[#E9DDF0]'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Donation Lifecycles</span>
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-10 h-10 mx-auto border-4 border-[#6C3B8F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-6 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
                  <span className="text-[#746A78] text-xs font-bold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#6C3B8F]" /> Total Registered Users
                  </span>
                  <span className="block font-serif text-3xl font-bold text-[#432457] font-mono">{analytics.totalUsers}</span>
                </div>

                <div className="p-6 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
                  <span className="text-[#746A78] text-xs font-bold flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-[#6C3B8F]" /> Active Sellers
                  </span>
                  <span className="block font-serif text-3xl font-bold text-[#432457] font-mono">{analytics.totalSellers}</span>
                </div>

                <div className="p-6 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
                  <span className="text-[#746A78] text-xs font-bold flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#6C3B8F]" /> Verified NGOs
                  </span>
                  <span className="block font-serif text-3xl font-bold text-[#432457] font-mono">{analytics.verifiedNGOs}</span>
                </div>

                <div className="p-6 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
                  <span className="text-[#746A78] text-xs font-bold flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-[#6C3B8F]" /> Total Clothes Donated
                  </span>
                  <span className="block font-serif text-3xl font-bold text-[#6C3B8F] font-mono">{analytics.totalClothesDonated}</span>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#432457]">Referral & Revenue Metrics</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-3.5 rounded-xl bg-[#FFF8EC]">
                      <span className="text-[#746A78]">Total Referral Clicks Logged:</span>
                      <span className="font-bold text-[#432457]">{analytics.totalReferrals}</span>
                    </div>
                    <div className="flex justify-between p-3.5 rounded-xl bg-[#FFF8EC]">
                      <span className="text-[#746A78]">Total Gross Order Value:</span>
                      <span className="font-bold text-[#6C3B8F] font-mono">₹{analytics.totalGrossMerchandise?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3.5 rounded-xl bg-[#FFF8EC]">
                      <span className="text-[#746A78]">Estimated Platform Margin Revenue:</span>
                      <span className="font-bold text-[#432457] font-mono">₹{analytics.totalCommissionEst?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#432457]">Social Impact Summary</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-3.5 rounded-xl bg-[#FFF8EC]">
                      <span className="text-[#746A78]">Clothes Collected & Distributed:</span>
                      <span className="font-bold text-[#432457]">{analytics.collectedClothes} Items</span>
                    </div>
                    <div className="flex justify-between p-3.5 rounded-xl bg-[#FFF8EC]">
                      <span className="text-[#746A78]">Estimated Beneficiaries Supported:</span>
                      <span className="font-bold text-[#6C3B8F]">~{analytics.peopleSupportedEst} People</span>
                    </div>
                    <div className="flex justify-between p-3.5 rounded-xl bg-[#FFF8EC]">
                      <span className="text-[#746A78]">Total Donation Drives Created:</span>
                      <span className="font-bold text-[#432457]">{analytics.totalDonations}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SELLERS TAB */}
          {activeTab === 'sellers' && (
            <div className="bg-[#F6EEDC] border border-[#6C3B8F]/15 rounded-3xl overflow-hidden overflow-x-auto shadow-md">
              <table className="w-full text-left text-xs text-[#241B29]">
                <thead className="bg-[#E9DDF0] border-b border-[#6C3B8F]/15 text-[#432457] uppercase font-bold">
                  <tr>
                    <th className="p-4">Shop Name</th>
                    <th className="p-4">Owner Email</th>
                    <th className="p-4">Products</th>
                    <th className="p-4">Referrals</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6C3B8F]/10">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-[#FFF8EC]">
                      <td className="p-4 font-bold text-[#432457]">{s.shopName}</td>
                      <td className="p-4 text-[#746A78]">{s.user?.email}</td>
                      <td className="p-4">{s._count?.products || 0}</td>
                      <td className="p-4">{s._count?.referrals || 0}</td>
                      <td className="p-4">
                        {s.isApproved ? (
                          <span className="px-2 py-0.5 rounded bg-[#6C3B8F] text-[#FFF8EC] font-bold">Approved</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">Pending Approval</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleSeller(s.id, s.isApproved)}
                          className="px-3 py-1.5 rounded-xl bg-[#432457] hover:bg-[#6C3B8F] text-[#FFF8EC] font-bold transition"
                        >
                          {s.isApproved ? 'Revoke Approval' : 'Approve Seller'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* NGOS TAB */}
          {activeTab === 'ngos' && (
            <div className="bg-[#F6EEDC] border border-[#6C3B8F]/15 rounded-3xl overflow-hidden overflow-x-auto shadow-md">
              <table className="w-full text-left text-xs text-[#241B29]">
                <thead className="bg-[#E9DDF0] border-b border-[#6C3B8F]/15 text-[#432457] uppercase font-bold">
                  <tr>
                    <th className="p-4">NGO Name</th>
                    <th className="p-4">Reg Number</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Donations Handled</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6C3B8F]/10">
                  {ngos.map((n) => (
                    <tr key={n.id} className="hover:bg-[#FFF8EC]">
                      <td className="p-4 font-bold text-[#432457]">{n.orgName}</td>
                      <td className="p-4 text-[#746A78] font-mono">{n.registrationNumber}</td>
                      <td className="p-4">{n.city}</td>
                      <td className="p-4">{n._count?.donations || 0}</td>
                      <td className="p-4">
                        {n.isVerified ? (
                          <span className="px-2 py-0.5 rounded bg-[#6C3B8F] text-[#FFF8EC] font-bold">Verified</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Unverified</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleNgo(n.id, n.isVerified)}
                          className="px-3 py-1.5 rounded-xl bg-[#432457] hover:bg-[#6C3B8F] text-[#FFF8EC] font-bold transition"
                        >
                          {n.isVerified ? 'Unverify' : 'Verify NGO Badge'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PRODUCTS MODERATION TAB */}
          {activeTab === 'products' && (
            <div className="bg-[#F6EEDC] border border-[#6C3B8F]/15 rounded-3xl overflow-hidden overflow-x-auto shadow-md">
              <table className="w-full text-left text-xs text-[#241B29]">
                <thead className="bg-[#E9DDF0] border-b border-[#6C3B8F]/15 text-[#432457] uppercase font-bold">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Shop</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6C3B8F]/10">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FFF8EC]">
                      <td className="p-4 font-bold text-[#432457]">{p.title}</td>
                      <td className="p-4 text-[#6C3B8F] font-bold">{p.seller?.shopName}</td>
                      <td className="p-4 text-[#746A78]">{p.category?.name}</td>
                      <td className="p-4 font-mono font-bold text-[#432457]">₹{p.price}</td>
                      <td className="p-4">
                        {p.isFeatured ? (
                          <span className="px-2 py-0.5 rounded bg-[#6C3B8F] text-[#FFF8EC] font-bold">Featured Hero</span>
                        ) : (
                          <span className="text-[#746A78]">Standard</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleProductFeature(p.id, p.isFeatured)}
                          className="px-3 py-1.5 rounded-xl bg-[#432457] hover:bg-[#6C3B8F] text-[#FFF8EC] font-bold transition"
                        >
                          {p.isFeatured ? 'Unfeature' : 'Feature Product'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DONATIONS LIFECYCLE TAB */}
          {activeTab === 'donations' && (
            <div className="bg-[#F6EEDC] border border-[#6C3B8F]/15 rounded-3xl overflow-hidden overflow-x-auto shadow-md">
              <table className="w-full text-left text-xs text-[#241B29]">
                <thead className="bg-[#E9DDF0] border-b border-[#6C3B8F]/15 text-[#432457] uppercase font-bold">
                  <tr>
                    <th className="p-4">Tracking #</th>
                    <th className="p-4">Donor</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">NGO</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6C3B8F]/10">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-[#FFF8EC]">
                      <td className="p-4 font-mono font-bold text-[#6C3B8F]">{d.trackingNumber}</td>
                      <td className="p-4 font-bold text-[#432457]">{d.donorName}</td>
                      <td className="p-4">{d.clothingCategory} ({d.approximateQuantity} items)</td>
                      <td className="p-4 text-[#6C3B8F] font-bold">{d.ngo?.orgName || 'Unassigned'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6C3B8F] text-[#FFF8EC]">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
