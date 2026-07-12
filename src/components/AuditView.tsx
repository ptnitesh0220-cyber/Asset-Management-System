import React, { useState } from 'react';
import { ClipboardCheck, Play, Check, AlertTriangle, ShieldCheck, X, CheckSquare, RefreshCw } from 'lucide-react';
import { AuditItem, Asset } from '../types';

interface AuditViewProps {
  auditItems: AuditItem[];
  assets: Asset[];
  onStartAuditCycle: () => void;
  onUpdateAuditItem: (id: string, status: AuditItem['status'], notes?: string, verifiedBy?: string) => void;
  searchQuery: string;
}

export default function AuditView({
  auditItems,
  assets,
  onStartAuditCycle,
  onUpdateAuditItem,
  searchQuery
}: AuditViewProps) {
  const [updatingItem, setUpdatingItem] = useState<AuditItem | null>(null);
  const [status, setStatus] = useState<AuditItem['status']>('Completed');
  const [notes, setNotes] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('Arun Kumar');

  // Compute stats dynamically
  const scheduledCount = auditItems.filter(i => i.status === 'Scheduled').length;
  const inProgressCount = auditItems.filter(i => i.status === 'In Progress').length;
  const completedCount = auditItems.filter(i => i.status === 'Completed').length;
  const damagedCount = auditItems.filter(i => i.status === 'Damaged').length;
  const missingCount = auditItems.filter(i => i.status === 'Missing').length;

  const stats = [
    { label: 'Scheduled', count: scheduledCount, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
    { label: 'In Progress', count: inProgressCount, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Completed', count: completedCount, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Damaged', count: damagedCount, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { label: 'Missing', count: missingCount, color: 'text-red-400 bg-red-500/10 border-red-500/20' }
  ];

  // Filter items
  const filteredAudits = auditItems.filter((item) => {
    return (
      item.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.verifiedBy && item.verifiedBy.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'Scheduled': return 'bg-slate-500/15 text-slate-400 border border-slate-500/20';
      case 'In Progress': return 'bg-blue-500/15 text-blue-400 border border-blue-500/20';
      case 'Completed': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
      case 'Damaged': return 'bg-orange-500/15 text-orange-400 border border-orange-500/20';
      case 'Missing': return 'bg-red-500/15 text-red-400 border border-red-500/20';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const handleOpenUpdate = (item: AuditItem) => {
    setUpdatingItem(item);
    setStatus(item.status);
    setNotes(item.notes || '');
    setVerifiedBy(item.verifiedBy || 'Arun Kumar');
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingItem) return;

    onUpdateAuditItem(updatingItem.id, status, notes, verifiedBy);
    setUpdatingItem(null);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="audit-view-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Audit Overview</h1>
          <p className="text-slate-400 text-sm">Physical asset inventory inspections, device health checking and verification registers.</p>
        </div>
        <button
          onClick={onStartAuditCycle}
          className="flex items-center gap-2 bg-[#0f1830] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg cursor-pointer self-start sm:self-auto"
          id="start-audit-cycle-btn"
        >
          <RefreshCw className="h-4 w-4 text-blue-500" />
          <span>Start New Audit Cycle</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="audit-stat-cards">
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className="bg-[#0f1830] border border-slate-800/80 rounded-xl p-4 text-center hover:border-slate-750 transition-all"
          >
            <p className="text-xxs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-2 leading-none">{stat.count}</p>
            <div className={`mt-2 h-1 w-8 mx-auto rounded-full ${stat.color.split(' ')[0]}`} />
          </div>
        ))}
      </div>

      {/* Active Audit Table */}
      <div className="bg-[#0f1830] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-[#131d3a] border-b border-slate-800/60 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <CheckSquare className="h-4.5 w-4.5 text-blue-500" />
            <span>Audit Ledger Checklist</span>
          </h3>
          <span className="text-slate-500 text-xxs font-mono">Cycle Year: 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a1122]/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Audit ID</th>
                <th className="px-6 py-4">Hardware Asset</th>
                <th className="px-6 py-4">Audit Status</th>
                <th className="px-6 py-4">Verified By</th>
                <th className="px-6 py-4">Audit Assessment Notes</th>
                <th className="px-6 py-4">Assessment Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {filteredAudits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-blue-400">{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{item.assetName}</div>
                    <span className="text-xxs text-slate-500">Asset ID: {item.assetId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xxs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-white">
                    {item.verifiedBy || <span className="text-slate-500 italic">Not Verified</span>}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate" title={item.notes}>
                    {item.notes || <span className="text-slate-600 italic">Awaiting assessment review</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleOpenUpdate(item)}
                      className="inline-flex items-center gap-1 bg-[#0a1122]/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <ClipboardCheck className="h-3.5 w-3.5 text-blue-500" />
                      <span>Verify</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verify Update Modal dialog */}
      {updatingItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="verify-modal">
          <div 
            className="bg-[#0f1830] border border-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up"
            id="verify-modal-content"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131d3a]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-blue-500" />
                <span>Verify Asset Verification: {updatingItem.id}</span>
              </h2>
              <button 
                onClick={() => setUpdatingItem(null)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Device</p>
                <p className="text-white text-sm font-semibold mt-1">{updatingItem.assetName} ({updatingItem.assetId})</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Verification Assessor</label>
                <input
                  type="text"
                  required
                  value={verifiedBy}
                  onChange={(e) => setVerifiedBy(e.target.value)}
                  placeholder="e.g. Arun Kumar"
                  className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Inspection Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AuditItem['status'])}
                  className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Completed">Completed (Excellent/Good)</option>
                  <option value="In Progress">In Progress (Reviewing)</option>
                  <option value="Damaged">Damaged (Fault Discovered)</option>
                  <option value="Missing">Missing (Asset Unaccounted)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Inspection Notes</label>
                <textarea
                  required
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Verified physically at Mumbai Desk 4. Screen has minor scratch, working diagnostics passed."
                  className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 resize-none text-xs"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUpdatingItem(null)}
                  className="bg-slate-800/60 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Verify Assessment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
