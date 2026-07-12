import React, { useState, useEffect } from 'react';
import { Wrench, Plus, X, PlusCircle, CheckCircle, XCircle, AlertCircle, Eye, Image as ImageIcon } from 'lucide-react';
import { MaintenanceTicket, Asset } from '../types';

interface MaintenanceViewProps {
  tickets: MaintenanceTicket[];
  assets: Asset[];
  onAddTicket: (ticket: Omit<MaintenanceTicket, 'id'>) => void;
  onUpdateTicketStatus: (id: string, status: MaintenanceTicket['status']) => void;
  searchQuery: string;
  openModalOnMount?: boolean;
  onModalClose?: () => void;
}

export default function MaintenanceView({
  tickets,
  assets,
  onAddTicket,
  onUpdateTicketStatus,
  searchQuery,
  openModalOnMount,
  onModalClose
}: MaintenanceViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (openModalOnMount) {
      openCreateModal();
    }
  }, [openModalOnMount]);

  const openCreateModal = () => {
    setSelectedAssetId('');
    setIssueDescription('');
    setPriority('Medium');
    setPhotoUrl('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onModalClose) {
      onModalClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !issueDescription) return;

    const assetObj = assets.find(a => a.id === selectedAssetId);
    if (assetObj) {
      onAddTicket({
        assetId: assetObj.id,
        assetName: assetObj.name,
        issueDescription,
        priority,
        status: 'Pending Approval',
        requestDate: new Date().toISOString().split('T')[0],
        photoUrl: photoUrl || undefined
      });
    }

    handleCloseModal();
  };

  // Filter tickets
  const filteredTickets = tickets.filter((tk) => {
    return (
      tk.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tk.issueDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tk.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Group tickets by status for Kanban Board representation
  const columns: { label: MaintenanceTicket['status']; color: string; border: string; bg: string }[] = [
    { label: 'Pending Approval', color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5' },
    { label: 'In Progress', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
    { label: 'Resolved', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
    { label: 'Rejected', color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5' }
  ];

  const getPriorityStyle = (prio: 'Low' | 'Medium' | 'High') => {
    switch (prio) {
      case 'High': return 'bg-red-500/15 text-red-400 border border-red-500/20';
      case 'Medium': return 'bg-orange-500/15 text-orange-400 border border-orange-500/20';
      case 'Low': return 'bg-slate-800 text-slate-400 border border-slate-700/60';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="maintenance-view-root">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Maintenance Tickets</h1>
          <p className="text-slate-400 text-sm">Raise hardware diagnostic queries, track ongoing repairs, and approve asset safety overhauls.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
          id="raise-request-btn"
        >
          <Plus className="h-4 w-4" />
          <span>Raise Maintenance Request</span>
        </button>
      </div>

      {/* Kanban Board Board Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" id="maintenance-kanban">
        {columns.map((col) => {
          const colTickets = filteredTickets.filter(t => t.status === col.label);
          return (
            <div 
              key={col.label} 
              className={`bg-[#0f1830] border border-slate-800 rounded-xl p-4 flex flex-col h-[600px] overflow-hidden ${col.bg}`}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-3.5 shrink-0">
                <span className={`font-semibold text-xs uppercase tracking-wider ${col.color}`}>{col.label}</span>
                <span className="text-xxs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{colTickets.length}</span>
              </div>

              {/* Tickets Container (Scrollable) */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {colTickets.length === 0 ? (
                  <p className="text-slate-600 text-xxs italic text-center py-10">No active tickets</p>
                ) : (
                  colTickets.map((tk) => (
                    <div 
                      key={tk.id}
                      className="bg-[#0a1122]/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all space-y-3"
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-mono text-xxs font-semibold text-blue-400">{tk.id}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${getPriorityStyle(tk.priority)}`}>
                          {tk.priority}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white text-xs leading-snug">{tk.assetName}</h4>
                        <p className="text-slate-400 text-xxs line-clamp-2 mt-1 leading-normal">{tk.issueDescription}</p>
                      </div>

                      {/* Photo indicator if attached */}
                      {tk.photoUrl && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">
                          <ImageIcon className="h-3.5 w-3.5" />
                          <span>Photo Attachment Included</span>
                        </div>
                      )}

                      <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <span>Filed: {tk.requestDate}</span>
                        
                        {/* Interactive actions inside Kanban card */}
                        <div className="flex gap-1.5">
                          {tk.status === 'Pending Approval' && (
                            <>
                              <button
                                onClick={() => onUpdateTicketStatus(tk.id, 'In Progress')}
                                className="text-[10px] text-blue-400 hover:text-white hover:bg-blue-600 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                                title="Approve & Begin Repair"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => onUpdateTicketStatus(tk.id, 'Rejected')}
                                className="text-[10px] text-red-400 hover:text-white hover:bg-red-600 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                                title="Reject Ticket"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {tk.status === 'In Progress' && (
                            <button
                              onClick={() => onUpdateTicketStatus(tk.id, 'Resolved')}
                              className="text-[10px] text-emerald-400 hover:text-white hover:bg-emerald-600 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                              title="Mark Resolved"
                            >
                              Resolve
                            </button>
                          )}
                          
                          <button
                            onClick={() => setSelectedTicket(tk)}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
                            title="Inspect ticket details"
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Inspector dialog */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="ticket-inspect-modal">
          <div className="bg-[#0f1830] border border-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131d3a]">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-500" />
                <span>Ticket Inspector: {selectedTicket.id}</span>
              </h2>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Asset ID & Model</p>
                <p className="text-white font-semibold text-sm mt-0.5">{selectedTicket.assetName} ({selectedTicket.assetId})</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Issue Diagnostic Summary</p>
                <div className="bg-[#0a1122]/95 border border-slate-800/80 p-3.5 rounded-xl text-slate-200 text-xs mt-1 leading-relaxed">
                  {selectedTicket.issueDescription}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ticket Status</p>
                  <span className="inline-block mt-1 bg-slate-800 text-slate-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {selectedTicket.status}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Priority level</p>
                  <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${getPriorityStyle(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
              </div>

              {selectedTicket.photoUrl && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Attached Photo Diagnostic</p>
                  <img 
                    src={selectedTicket.photoUrl} 
                    alt="Asset issue" 
                    className="w-full h-40 object-cover rounded-xl border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raise Maintenance Request Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="maintenance-modal">
          <div 
            className="bg-[#0f1830] border border-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up"
            id="maintenance-modal-content"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131d3a]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-400" />
                <span>Raise Maintenance Request</span>
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
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Select Damaged Asset</label>
                <select
                  required
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Asset ID...</option>
                  {assets.map((ast) => (
                    <option key={ast.id} value={ast.id}>{ast.id} - {ast.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Priority Classification</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Attach Photo Diagnostic URL (Optional)</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Issue & Damage Description</label>
                <textarea
                  required
                  rows={4}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe the sticky keyboard, screen discoloration, power adapter issues, battery expansion..."
                  className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Raise Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
