import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, PlusCircle, CheckCircle, Clock, Trash, AlertCircle } from 'lucide-react';
import { Booking } from '../types';

interface BookingViewProps {
  bookings: Booking[];
  onAddBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  onCancelBooking: (id: string) => void;
  searchQuery: string;
  openModalOnMount?: boolean;
  onModalClose?: () => void;
}

export default function BookingView({
  bookings,
  onAddBooking,
  onCancelBooking,
  searchQuery,
  openModalOnMount,
  onModalClose
}: BookingViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [resourceName, setResourceName] = useState('Meeting Room - Nebula (Block B)');
  const [requesterName, setRequesterName] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:30 AM');
  const [date, setDate] = useState('2026-07-12');

  const resources = [
    'Meeting Room - Nebula (Block B)',
    'Meeting Room - Cosmos (Block A)',
    'IT Lab Testing Bench A',
    'Conference Room - Zenith',
    '3D Printing Station',
    'Executive Boardroom'
  ];

  const slots = [
    '09:00 AM - 10:30 AM',
    '10:30 AM - 12:00 PM',
    '12:00 PM - 01:30 PM',
    '01:30 PM - 03:00 PM',
    '03:00 PM - 04:30 PM',
    '04:30 PM - 06:00 PM'
  ];

  useEffect(() => {
    if (openModalOnMount) {
      openCreateModal();
    }
  }, [openModalOnMount]);

  const openCreateModal = () => {
    setResourceName('Meeting Room - Nebula (Block B)');
    setRequesterName('');
    setTimeSlot('10:00 AM - 11:30 AM');
    setDate(new Date().toISOString().split('T')[0]);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onModalClose) {
      onModalClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onAddBooking({
        resourceName,
        requesterName,
        timeSlot,
        date,
        status: 'Upcoming'
      });
      handleCloseModal();
    } catch (err) {
      console.error('Booking submit failed:', err);
      setSubmitError('Could not save this booking. Check your connection/permissions and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((bk) => {
    return (
      bk.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bk.requesterName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Upcoming': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="booking-view-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Resource Booking Scheduler</h1>
          <p className="text-slate-400 text-sm">Coordinate reservations for shared physical assets, engineering workspaces, and meeting halls.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
          id="new-booking-btn"
        >
          <Plus className="h-4 w-4" />
          <span>New Booking</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Right side: Active Bookings Listing */}
        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-5 xl:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
              <h3 className="font-semibold text-white">Active Reservations</h3>
              <span className="text-slate-400 text-xs font-mono">{filteredBookings.length} Bookings Scheduled</span>
            </div>

            <div className="space-y-3">
              {filteredBookings.length === 0 ? (
                <p className="text-slate-500 text-xs italic text-center py-10">No active bookings match your query</p>
              ) : (
                filteredBookings.map((bk) => (
                  <div 
                    key={bk.id}
                    className="bg-[#0a1122]/60 border border-slate-800/80 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white leading-tight">{bk.resourceName}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-400 font-sans">
                          <span className="font-medium text-slate-300">By {bk.requesterName}</span>
                          <span className="hidden sm:inline text-slate-700">•</span>
                          <span className="font-mono">{bk.timeSlot}</span>
                          <span className="hidden sm:inline text-slate-700">•</span>
                          <span className="font-mono text-[11px] text-slate-500">{bk.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:justify-end">
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(bk.status)}`}>
                        {bk.status}
                      </span>
                      
                      {bk.status !== 'Cancelled' && bk.status !== 'Completed' && (
                        <button
                          onClick={() => onCancelBooking(bk.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Cancel Reservation"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Left Side: Schedule calendar placeholder cards */}
        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-5 h-fit space-y-4">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="font-semibold text-white">Resource Capacity</h3>
            <p className="text-slate-400 text-xs mt-0.5">Physical space usage & diagnostic equipment compliance.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-[#0a1122]/80 border border-slate-800 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">Nebula Space (Block B)</span>
                <span className="text-emerald-400 font-bold">90% Free</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[10%]" />
              </div>
            </div>

            <div className="p-3.5 bg-[#0a1122]/80 border border-slate-800 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">Cosmos Suite (Block A)</span>
                <span className="text-blue-400 font-bold">50% Booked</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-500 h-full w-[50%]" />
              </div>
            </div>

            <div className="p-3.5 bg-[#0a1122]/80 border border-slate-800 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">IT Lab Diagnostics Bench</span>
                <span className="text-orange-400 font-bold">75% Active</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-orange-500 h-full w-[75%]" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl flex gap-2 text-xs">
            <AlertCircle className="h-5 w-5 text-blue-400 shrink-0" />
            <span className="text-slate-300 leading-tight">
              Reservations default to "Upcoming". Automatic notifications are transmitted to staff attendees 1 hour prior to check-in.
            </span>
          </div>
        </div>
      </div>

      {/* New Booking Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="booking-modal">
          <div 
            className="bg-[#0f1830] border border-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up"
            id="booking-modal-content"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131d3a]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Reserve Shared Resource</span>
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Select Shared Resource</label>
                <select
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  {resources.map((res) => (
                    <option key={res} value={res}>{res}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Your Full Name (Requester)</label>
                <input
                  type="text"
                  required
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="e.g. Sneha Patil"
                  className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Time Slot Window</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {slots.map((sl) => (
                      <option key={sl} value={sl}>{sl}</option>
                    ))}
                  </select>
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-slate-800/60 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Confirm Reservation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
