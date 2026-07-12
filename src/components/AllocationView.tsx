import React, { useState, useEffect } from 'react';
import { Repeat, Plus, CheckCircle, XCircle, Clock, X, PlusCircle, ArrowRightLeft, ShieldCheck, Clipboard } from 'lucide-react';
import { TransferRequest, Asset, Employee } from '../types';

interface AllocationViewProps {
  transferRequests: TransferRequest[];
  assets: Asset[];
  employees: Employee[];
  onAddTransfer: (request: Omit<TransferRequest, 'id'>) => void;
  onApproveTransfer: (id: string) => void;
  onRejectTransfer: (id: string) => void;
  searchQuery: string;
  openModalOnMount?: boolean;
  onModalClose?: () => void;
}

export default function AllocationView({
  transferRequests,
  assets,
  employees,
  onAddTransfer,
  onApproveTransfer,
  onRejectTransfer,
  searchQuery,
  openModalOnMount,
  onModalClose
}: AllocationViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [fromEmployee, setFromEmployee] = useState('');
  const [toEmployeeId, setToEmployeeId] = useState('');
  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Excellent');

  useEffect(() => {
    if (openModalOnMount) {
      openCreateModal();
    }
  }, [openModalOnMount]);

  const openCreateModal = () => {
    setSelectedAssetId('');
    setFromEmployee('');
    setToEmployeeId('');
    setCondition('Excellent');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onModalClose) {
      onModalClose();
    }
  };

  // Auto-fill "fromEmployee" when user selects an asset
  const handleAssetChange = (assetId: string) => {
    setSelectedAssetId(assetId);
    const assetObj = assets.find(a => a.id === assetId);
    if (assetObj) {
      setFromEmployee(assetObj.assignedTo || 'Warehouse Storage');
    } else {
      setFromEmployee('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !toEmployeeId) return;

    const assetObj = assets.find(a => a.id === selectedAssetId);
    const targetEmployeeObj = employees.find(emp => emp.id === toEmployeeId);

    if (assetObj && targetEmployeeObj) {
      onAddTransfer({
        assetId: assetObj.id,
        assetName: assetObj.name,
        fromEmployee: fromEmployee || 'Warehouse Inventory',
        toEmployee: targetEmployeeObj.name,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        condition: condition
      });
    }

    handleCloseModal();
  };

  // Filter transfers
  const filteredRequests = transferRequests.filter((req) => {
    const matchesSearch = 
      req.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.fromEmployee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.toEmployee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusStyle = (st: string) => {
    switch (st) {
      case 'Allocated': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'Overdue': return 'bg-red-500/15 text-red-400 border border-red-500/30';
      case 'Good': return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'Pending': return 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="allocation-view-root">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Allocation & Transfer</h1>
          <p className="text-slate-400 text-sm font-sans">Approve asset requests and route physical inventory transfers between company employees.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
          id="new-transfer-btn"
        >
          <Repeat className="h-4 w-4" />
          <span>New Transfer</span>
        </button>
      </div>

      {/* Allocation Requests Sheet */}
      <div className="bg-[#0f1830] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#131d3a] border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Transfer ID</th>
                <th className="px-6 py-4">Asset Details</th>
                <th className="px-6 py-4">From Employee</th>
                <th className="px-6 py-4">To Employee</th>
                <th className="px-6 py-4">Request Date</th>
                <th className="px-6 py-4">Status Tag</th>
                <th className="px-6 py-4 text-center">Transfer Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-blue-400">{req.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{req.assetName}</div>
                    <span className="text-xxs text-slate-500">Asset ID: {req.assetId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                      <span>{req.fromEmployee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-medium text-white">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{req.toEmployee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    {req.requestDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xxs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusStyle(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {req.status === 'Pending' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onApproveTransfer(req.id)}
                          className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 hover:text-white font-medium text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                          title="Approve transfer and assign asset"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => onRejectTransfer(req.id)}
                          className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white font-medium text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                          title="Reject transfer request"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 text-xs flex items-center justify-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span>Action Audited</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modal form for a new Transfer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="transfer-modal">
          <div 
            className="bg-[#0f1830] border border-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up"
            id="transfer-modal-content"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131d3a]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-emerald-500" />
                <span>Initiate Inventory Transfer</span>
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
              {/* Asset choice */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Hardware Asset to Transfer</label>
                <select
                  required
                  value={selectedAssetId}
                  onChange={(e) => handleAssetChange(e.target.value)}
                  className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Asset...</option>
                  {assets.map((ast) => (
                    <option key={ast.id} value={ast.id}>{ast.id} - {ast.name} ({ast.status})</option>
                  ))}
                </select>
              </div>

              {/* Current Employee Holder - auto-completed */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Current Asset Custodian</label>
                <input
                  type="text"
                  disabled
                  value={fromEmployee}
                  placeholder="Auto-fills upon asset selection..."
                  className="w-full bg-[#0a1122]/60 text-sm text-slate-400 px-3.5 py-2 rounded-xl border border-slate-800 cursor-not-allowed"
                />
              </div>

              {/* Target Employee */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Custodian Employee</label>
                <select
                  required
                  value={toEmployeeId}
                  onChange={(e) => setToEmployeeId(e.target.value)}
                  className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Target Custodian...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role} - {emp.department})</option>
                  ))}
                </select>
              </div>

              {/* Condition Tag */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Condition at Transfer</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              {/* Submit panel */}
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
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
