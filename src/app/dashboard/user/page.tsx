'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User as UserIcon, 
  Gift, 
  Heart, 
  MapPin, 
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';

export default function UserDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'donations' | 'wishlist' | 'addresses'>('donations');
  
  const [donations, setDonations] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // New Address Form State
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoadingData(true);
    try {
      const [donRes, wishRes, addrRes] = await Promise.all([
        fetch('/api/donations'),
        fetch('/api/wishlist'),
        fetch('/api/user/addresses'),
      ]);

      const donData = await donRes.json();
      const wishData = await wishRes.json();
      const addrData = await addrRes.json();

      if (donData.donations) setDonations(donData.donations);
      if (wishData.items) setWishlistItems(wishData.items);
      if (addrData.addresses) setAddresses(addrData.addresses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAddr, isDefault: addresses.length === 0 }),
      });
      if (res.ok) {
        setNewAddr({ fullName: '', phone: '', streetAddress: '', city: '', state: '', pincode: '' });
        fetchUserData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loadingData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-[#FFF8EC]">
        <div className="w-10 h-10 mx-auto border-4 border-[#6C3B8F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 bg-[#FFF8EC]">
        <h2 className="font-serif text-2xl font-bold text-[#432457]">Sign In Required</h2>
        <p className="text-[#746A78] text-sm">Please log in to access your LUXU E-STORE dashboard, wishlist, and donation tracking.</p>
        <Link href="/login" className="inline-block bg-[#6C3B8F] text-[#FFF8EC] font-bold px-6 py-3 rounded-xl text-xs">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FFF8EC]">
      
      {/* User Header Profile Card */}
      <div className="p-8 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#6C3B8F] text-[#FFF8EC] font-bold text-2xl flex items-center justify-center shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#432457]">{user.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E9DDF0] text-[#6C3B8F] px-2.5 py-0.5 rounded-full border border-[#6C3B8F]/20">
                {user.role} Member
              </span>
            </div>
            <p className="text-xs text-[#746A78] mt-0.5">{user.email}</p>
          </div>
        </div>

        <Link
          href="/donate"
          className="bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold px-6 py-3 rounded-xl text-xs transition shadow-md flex items-center gap-2"
        >
          <Gift className="w-4 h-4" />
          <span>New Clothing Donation</span>
        </Link>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#6C3B8F]/15 pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('donations')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition ${
            activeTab === 'donations' ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md' : 'text-[#746A78] hover:text-[#432457] hover:bg-[#E9DDF0]'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Donation History ({donations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition ${
            activeTab === 'wishlist' ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md' : 'text-[#746A78] hover:text-[#432457] hover:bg-[#E9DDF0]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition ${
            activeTab === 'addresses' ? 'bg-[#6C3B8F] text-[#FFF8EC] shadow-md' : 'text-[#746A78] hover:text-[#432457] hover:bg-[#E9DDF0]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        
        {/* DONATION HISTORY TAB */}
        {activeTab === 'donations' && (
          <div className="space-y-4">
            {donations.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 text-center space-y-3">
                <Gift className="w-12 h-12 text-[#6C3B8F] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#432457]">No clothing donations submitted yet</h3>
                <p className="text-xs text-[#746A78]">Give clean unused clothes a second life by connecting with verified NGO partners.</p>
                <Link href="/donate" className="inline-block bg-[#6C3B8F] text-[#FFF8EC] font-bold text-xs px-5 py-2.5 rounded-xl">
                  Submit First Donation
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {donations.map((don) => (
                  <div key={don.id} className="p-6 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#6C3B8F]/15 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#6C3B8F] font-bold">Tracking #{don.trackingNumber}</span>
                        <h3 className="font-serif font-bold text-[#432457] text-base">{don.clothingCategory}</h3>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#6C3B8F] text-[#FFF8EC] w-fit">
                        Status: {don.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#241B29]">
                      <div>
                        <span className="text-[#746A78] block text-[10px]">NGO Partner</span>
                        <span className="font-bold text-[#432457]">{don.ngo?.orgName || 'Assigned Coordinator'}</span>
                      </div>

                      <div>
                        <span className="text-[#746A78] block text-[10px]">Quantity & Condition</span>
                        <span className="font-bold text-[#432457]">{don.approximateQuantity} Items ({don.condition})</span>
                      </div>

                      <div>
                        <span className="text-[#746A78] block text-[10px]">Pickup Date</span>
                        <span className="font-bold text-[#432457]">{don.preferredPickupDate || 'Scheduled'}</span>
                      </div>

                      <div>
                        <span className="text-[#746A78] block text-[10px]">Submitted Date</span>
                        <span className="font-bold text-[#432457]">{new Date(don.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {don.statusHistory && don.statusHistory.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/10 text-[11px] text-[#241B29] space-y-1">
                        <span className="font-bold text-[#432457] block">Latest Activity:</span>
                        <p className="text-[#746A78]">{don.statusHistory[0].notes} - <span className="text-[#432457] font-semibold">{new Date(don.statusHistory[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistItems.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 text-center space-y-3">
                <Heart className="w-12 h-12 text-[#6C3B8F] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#432457]">Your wishlist is empty</h3>
                <p className="text-xs text-[#746A78]">Explore fashion on LUXU E-STORE and save products you love.</p>
                <Link href="/discover" className="inline-block bg-[#6C3B8F] text-[#FFF8EC] font-bold text-xs px-5 py-2.5 rounded-xl">
                  Explore Apparel Marketplace
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
        )}

        {/* ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#432457] text-sm">{addr.fullName}</h4>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#6C3B8F] text-[#FFF8EC] px-2 py-0.5 rounded">
                        Default Address
                      </span>
                    )}
                  </div>
                  <p className="text-[#241B29]">{addr.streetAddress}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-[#746A78]">Phone: {addr.phone}</p>
                </div>
              ))}
            </div>

            {/* Add Address Form */}
            <form onSubmit={handleAddAddress} className="p-6 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-4 text-xs shadow-md">
              <h3 className="font-serif font-bold text-[#432457] text-base">Add New Address</h3>
              
              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Phone</label>
                <input
                  type="text"
                  required
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddr.streetAddress}
                  onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[#432457] font-bold">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#432457] font-bold">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold py-2.5 rounded-xl transition">
                Save Address
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
