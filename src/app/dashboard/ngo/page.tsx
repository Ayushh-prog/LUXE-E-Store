'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Gift, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Users, 
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function NgoDashboardPage() {
  const { user } = useAuth();
  
  const [ngoData, setNgoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusNotes, setStatusNotes] = useState('');

  useEffect(() => {
    fetchNgoDashboard();
  }, []);

  const fetchNgoDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngo/dashboard');
      const data = await res.json();
      if (data.stats) {
        setNgoData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (donationId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/donations/${donationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          notes: statusNotes || `Donation updated to ${newStatus}`,
        }),
      });

      if (res.ok) {
        setSelectedDonation(null);
        setStatusNotes('');
        fetchNgoDashboard();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-[#FFF8EC]">
        <div className="w-10 h-10 mx-auto border-4 border-[#6C3B8F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = ngoData?.stats || {};
  const donations = ngoData?.donations || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#FFF8EC]">
      
      {/* NGO Header */}
      <div className="p-8 rounded-3xl bg-[#E9DDF0] border border-[#6C3B8F]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6C3B8F] text-[#FFF8EC] flex items-center justify-center font-bold text-2xl shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#432457]">
                {ngoData?.ngo?.orgName || 'Verified NGO Partner Portal'}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#6C3B8F] text-[#FFF8EC] px-2.5 py-0.5 rounded flex items-center gap-1 shadow">
                <CheckCircle2 className="w-3 h-3" /> Audit Verified
              </span>
            </div>
            <p className="text-xs text-[#746A78] mt-1 font-medium">
              LUXU Partner • Reg. #{ngoData?.ngo?.registrationNumber || 'NGO-51209'} • {ngoData?.ngo?.city}, {ngoData?.ngo?.state}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#6C3B8F]" /> Pending
          </span>
          <span className="block font-serif text-2xl font-bold text-[#432457] font-mono">{stats.pendingDonations || 0}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#6C3B8F]" /> Accepted
          </span>
          <span className="block font-serif text-2xl font-bold text-[#432457] font-mono">{stats.acceptedDonations || 0}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#6C3B8F]" /> Scheduled
          </span>
          <span className="block font-serif text-2xl font-bold text-[#432457] font-mono">{stats.pickupsScheduled || 0}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-[#6C3B8F]" /> Collected
          </span>
          <span className="block font-serif text-2xl font-bold text-[#432457] font-mono">{stats.collectedDonations || 0}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-[#6C3B8F]" /> Distributed
          </span>
          <span className="block font-serif text-2xl font-bold text-[#432457] font-mono">{stats.distributedDonations || 0}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1 col-span-2 md:col-span-1">
          <span className="text-[#746A78] text-xs font-bold flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#6C3B8F]" /> Beneficiaries
          </span>
          <span className="block font-serif text-2xl font-bold text-[#6C3B8F] font-mono">~{stats.peopleSupported || 0}</span>
        </div>

      </div>

      {/* Donation Requests Management Table */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#432457]">Incoming Clothing Donation Requests ({donations.length})</h3>

        <div className="bg-[#F6EEDC] border border-[#6C3B8F]/15 rounded-3xl overflow-hidden overflow-x-auto shadow-md">
          <table className="w-full text-left text-xs text-[#241B29]">
            <thead className="bg-[#E9DDF0] border-b border-[#6C3B8F]/15 text-[#432457] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Donor & Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Clothing & Quantity</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Pickup Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6C3B8F]/10">
              {donations.map((don: any) => (
                <tr key={don.id} className="hover:bg-[#FFF8EC] transition">
                  <td className="p-4">
                    <p className="font-bold text-[#432457]">{don.donorName}</p>
                    <p className="text-[10px] text-[#746A78]">{don.donorPhone} • {don.donorEmail}</p>
                    <span className="text-[10px] font-mono text-[#6C3B8F] font-bold">#{don.trackingNumber}</span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#241B29]">{don.city}</p>
                    <p className="text-[10px] text-[#746A78] max-w-[150px] truncate">{don.streetAddress}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#432457]">{don.clothingCategory}</p>
                    <p className="text-[10px] text-[#6C3B8F] font-bold">{don.approximateQuantity} Items</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-[#FFF8EC] border border-[#6C3B8F]/20 font-semibold text-[#432457]">
                      {don.condition}
                    </span>
                  </td>
                  <td className="p-4 text-[#746A78]">
                    {don.preferredPickupDate || 'Not specified'}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#6C3B8F] text-[#FFF8EC] shadow-sm">
                      {don.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedDonation(don)}
                      className="px-3 py-1.5 rounded-xl bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold transition text-xs shadow"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Status Update Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 bg-[#432457]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF8EC] border border-[#6C3B8F]/20 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#6C3B8F]/15 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#432457]">
                Update Donation #{selectedDonation.trackingNumber}
              </h3>
              <button onClick={() => setSelectedDonation(null)} className="text-[#746A78] hover:text-[#432457]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F6EEDC] border border-[#6C3B8F]/15 space-y-1">
                <p className="font-bold text-[#432457]">{selectedDonation.donorName} ({selectedDonation.clothingCategory})</p>
                <p className="text-[#746A78]">{selectedDonation.streetAddress}, {selectedDonation.city}</p>
              </div>

              <div className="space-y-1">
                <label className="text-[#432457] font-bold">Status Note / Volunteer Comment</label>
                <input
                  type="text"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. Pickup scheduled with volunteer Team B for Thursday morning"
                  className="w-full px-3 py-2 rounded-xl bg-[#F6EEDC] border border-[#6C3B8F]/20 text-[#241B29] font-medium"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[#432457] font-bold block">Select New Lifecycle Status:</label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedDonation.id, 'ACCEPTED')}
                    disabled={updatingStatus}
                    className="p-2.5 rounded-xl bg-[#E9DDF0] hover:bg-[#6C3B8F] text-[#432457] hover:text-[#FFF8EC] font-bold border border-[#6C3B8F]/30 text-center transition"
                  >
                    Accept Donation
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedDonation.id, 'PICKUP_SCHEDULED')}
                    disabled={updatingStatus}
                    className="p-2.5 rounded-xl bg-[#E9DDF0] hover:bg-[#6C3B8F] text-[#432457] hover:text-[#FFF8EC] font-bold border border-[#6C3B8F]/30 text-center transition"
                  >
                    Schedule Pickup
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedDonation.id, 'COLLECTED')}
                    disabled={updatingStatus}
                    className="p-2.5 rounded-xl bg-[#6C3B8F] hover:bg-[#432457] text-[#FFF8EC] font-bold text-center transition"
                  >
                    Mark Collected
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedDonation.id, 'DISTRIBUTED')}
                    disabled={updatingStatus}
                    className="p-2.5 rounded-xl bg-[#432457] hover:bg-[#6C3B8F] text-[#FFF8EC] font-bold text-center transition"
                  >
                    Mark Distributed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
