'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Gift, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function DonateFormContent() {
  const searchParams = useSearchParams();
  const preselectedNgoId = searchParams.get('ngoId');
  const router = useRouter();
  const { user } = useAuth();

  const [ngos, setNgos] = useState<any[]>([]);
  const [loadingNgos, setLoadingNgos] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    streetAddress: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110020',
    clothingCategory: "Winter clothes & Blankets",
    approximateQuantity: 10,
    condition: 'LIKE_NEW',
    ngoId: preselectedNgoId || '',
    pickupRequired: true,
    preferredPickupDate: '',
    additionalNotes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedDonation, setSubmittedDonation] = useState<any>(null);

  useEffect(() => {
    fetchNgos();
    if (user) {
      setFormData(prev => ({
        ...prev,
        donorName: user.name || '',
        donorEmail: user.email || '',
        donorPhone: user.phone || '',
      }));
    }
  }, [user]);

  const fetchNgos = async () => {
    try {
      const res = await fetch('/api/ngos');
      const data = await res.json();
      if (data.ngos) {
        setNgos(data.ngos);
        if (!preselectedNgoId && data.ngos.length > 0) {
          setFormData(prev => ({ ...prev, ngoId: data.ngos[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNgos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('Please log in or register to submit a clothing donation request.');
      return;
    }

    if (!formData.donorName || !formData.donorPhone || !formData.streetAddress || !formData.city) {
      setErrorMsg('Please fill in all required donor and address fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to submit donation.');
        return;
      }

      setSubmittedDonation(data.donation);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Mandatory Cleanliness Guidelines Alert */}
      <div className="p-5 rounded-2xl bg-[#E9DDF0] border border-[#6C3B8F]/30 text-[#432457] text-xs flex items-start gap-3 shadow-sm">
        <AlertCircle className="w-5 h-5 text-[#6C3B8F] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#432457]">Important Donation Requirement:</p>
          <p className="leading-relaxed text-[#746A78]">
            Please donate <strong>clean, dry, and usable clothing only</strong>. Ensure garments are free of heavy damage so they can immediately bring dignity to recipients.
          </p>
        </div>
      </div>

      {/* Success Confirmation Card */}
      {submittedDonation ? (
        <div className="p-10 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/30 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E9DDF0] text-[#6C3B8F] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C3B8F]">Donation Request Submitted</span>
            <h2 className="font-serif text-2xl font-bold text-[#432457]">Tracking #{submittedDonation.trackingNumber}</h2>
            <p className="text-sm text-[#746A78] max-w-md mx-auto">
              Thank you, <strong className="text-[#432457]">{submittedDonation.donorName}</strong>! Your request has been assigned to partner NGO coordinator.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF8EC] border border-[#6C3B8F]/15 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#6C3B8F] font-bold">
              <span>Status: {submittedDonation.status}</span>
              <span className="text-[10px] text-[#746A78] font-normal">Tracking active</span>
            </div>
            <p className="text-[#746A78]">
              The NGO team will review details and coordinate doorstep pickup for preferred date: <strong>{submittedDonation.preferredPickupDate || 'As scheduled'}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/user"
              className="bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold px-6 py-3 rounded-xl text-xs transition shadow-md"
            >
              Track in User Dashboard
            </Link>
            <button
              onClick={() => setSubmittedDonation(null)}
              className="text-[#6C3B8F] hover:underline text-xs font-bold"
            >
              Submit Another Donation
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-8 shadow-xl">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-100 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Donor & Address */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#432457] flex items-center gap-2 border-b border-[#6C3B8F]/15 pb-2">
              <MapPin className="w-4 h-4 text-[#6C3B8F]" />
              <span>1. Donor Contact & Address Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#432457] font-bold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#432457] font-bold">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.donorPhone}
                  onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#432457] font-bold">Email Address</label>
                <input
                  type="email"
                  value={formData.donorEmail}
                  onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                  placeholder="donor@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[#432457] font-bold">Street Address / House No. *</label>
                <input
                  type="text"
                  required
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder="Flat, Building, Street"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#432457] font-bold">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#432457] font-bold">Pincode *</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clothing Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#432457] flex items-center gap-2 border-b border-[#6C3B8F]/15 pb-2">
              <Gift className="w-4 h-4 text-[#6C3B8F]" />
              <span>2. Clothing Items & Condition</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#432457] font-bold">Clothing Category *</label>
                <select
                  value={formData.clothingCategory}
                  onChange={(e) => setFormData({ ...formData, clothingCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                >
                  <option value="Men's Clothing">Men's Apparel</option>
                  <option value="Women's Clothing">Women's Ethnic & Western</option>
                  <option value="Children's Wear">Children & Kids Clothes</option>
                  <option value="Winter clothes & Blankets">Winter Clothes & Heavy Blankets</option>
                  <option value="Footwear">Footwear & Shoes</option>
                  <option value="Assorted Mixed Clothes">Assorted Mixed Clothes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#432457] font-bold">Approximate Quantity (Items) *</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={formData.approximateQuantity}
                  onChange={(e) => setFormData({ ...formData, approximateQuantity: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#432457] font-bold">Garment Condition *</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                >
                  <option value="NEW">New (Unused with tags)</option>
                  <option value="LIKE_NEW">Like New (Gently worn)</option>
                  <option value="GOOD">Good (Clean and durable)</option>
                  <option value="USED">Used (Usable condition)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Partner NGO Selection & Logistics */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#432457] flex items-center gap-2 border-b border-[#6C3B8F]/15 pb-2">
              <Building2 className="w-4 h-4 text-[#6C3B8F]" />
              <span>3. Partner NGO & Pickup Scheduling</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#432457] font-bold">Preferred Verified NGO Partner</label>
                <select
                  value={formData.ngoId}
                  onChange={(e) => setFormData({ ...formData, ngoId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                >
                  <option value="">-- Assign to Any Available Nearby NGO --</option>
                  {ngos.map((ngo) => (
                    <option key={ngo.id} value={ngo.id}>
                      {ngo.orgName} ({ngo.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#432457] font-bold">Preferred Pickup Date</label>
                <input
                  type="date"
                  value={formData.preferredPickupDate}
                  onChange={(e) => setFormData({ ...formData, preferredPickupDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-[#432457] font-bold">Additional Instructions / Notes</label>
              <textarea
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Mention bag packing details, landmark, or specific instructions for pickup volunteers..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EC] border border-[#6C3B8F]/20 text-[#241B29] focus:outline-none focus:border-[#6C3B8F] font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold py-4 rounded-2xl shadow-lg shadow-[#6C3B8F]/25 transition flex items-center justify-center gap-2 text-base"
          >
            <Gift className="w-5 h-5 text-[#FFF8EC]" />
            <span>{submitting ? 'Submitting Request...' : 'Submit Clothing Donation Request'}</span>
          </button>
        </form>
      )}
    </div>
  );
}

export default function DonatePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#FFF8EC]">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E9DDF0] text-[#6C3B8F] border border-[#6C3B8F]/30 text-xs font-bold">
          <Gift className="w-4 h-4 text-[#6C3B8F]" />
          <span>LUXU Clothing Donation Portal</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#432457]">Donate Clothes & Give Back</h1>
        <p className="text-[#746A78] text-sm">
          Connect your pre-loved clothing directly with verified NGO partners supporting underprivileged families.
        </p>
      </div>

      <Suspense fallback={
        <div className="p-12 text-center text-[#746A78]">
          <div className="w-8 h-8 border-2 border-[#6C3B8F] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading donation form...
        </div>
      }>
        <DonateFormContent />
      </Suspense>
    </div>
  );
}
