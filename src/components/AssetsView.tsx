import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  Edit, 
  Trash, 
  Laptop, 
  Activity, 
  X, 
  PlusCircle, 
  CheckCircle2, 
  Wrench, 
  Archive, 
  BookMarked,
  Info
} from 'lucide-react';
import { Asset, Employee } from '../types';

interface AssetsViewProps {
  assets: Asset[];
  employees: Employee[];
  onAddAsset: (asset: Omit<Asset, 'id'>) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  searchQuery: string;
  openModalOnMount?: boolean;
  onModalClose?: () => void;
}

export default function AssetsView({
  assets,
  employees,
  onAddAsset,
  onEditAsset,
  onDeleteAsset,
  searchQuery,
  openModalOnMount,
  onModalClose
}: AssetsViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [purchaseDate, setPurchaseDate] = useState('2026-07-12');
  const [value, setValue] = useState(1200);
  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Excellent');
  const [status, setStatus] = useState<'Available' | 'Allocated' | 'Reserved' | 'Under Maintenance' | 'Retired'>('Available');
  const [assignedToId, setAssignedToId] = useState('');
  const [location, setLocation] = useState('Bangalore HQ');

  // Trigger modal if requested from parent (like quick action)
  useEffect(() => {
    if (openModalOnMount) {
      openCreateModal();
    }
  }, [openModalOnMount]);

  const openCreateModal = () => {
    setEditingAsset(null);
    setName('');
    setCategory('Laptops');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setValue(1200);
    setCondition('Excellent');
    setStatus('Available');
    setAssignedToId('');
    setLocation('Bangalore HQ');
    setIsModalOpen(true);
  };

  const openEditModal = (asset: Asset) => {
    setEditingAsset(asset);
    setName(asset.name);
    setCategory(asset.category);
    setPurchaseDate(asset.purchaseDate);
    setValue(asset.value);
    setCondition(asset.condition);
    setStatus(asset.status);
    setAssignedToId(asset.assignedToId || '');
    setLocation(asset.location);
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
    if (!name || !category || !location) return;

    // Resolve employee name from ID
    const employeeObj = employees.find(emp => emp.id === assignedToId);
    const assignedToName = status === 'Allocated' && employeeObj ? employeeObj.name : undefined;
    const finalAssignedId = status === 'Allocated' && assignedToId ? assignedToId : undefined;

    if (editingAsset) {
      onEditAsset({
        ...editingAsset,
        name,
        category,
        purchaseDate,
        value: Number(value),
        condition,
        status,
        assignedTo: assignedToName,
        assignedToId: finalAssignedId,
        location
      });
    } else {
      onAddAsset({
        name,
        category,
        purchaseDate,
        value: Number(value),
        condition,
        status,
        assignedTo: assignedToName,
        assignedToId: finalAssignedId,
        location
      });
    }
    handleCloseModal();
  };

  // Status Filter Pills definitions
  const statusFilters = ['All', 'Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Retired'];

  // Categories list
  const categoriesList = ['Laptops', 'Monitors', 'Tablets', 'Mobile Phones', 'Accessories', 'Networking', 'Printers'];

  // Filter criteria logic
  const filteredAssets = assets.filter((asset) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (asset.id ?? '').toLowerCase().includes(q) ||
      (asset.name ?? '').toLowerCase().includes(q) ||
      (asset.category ?? '').toLowerCase().includes(q) ||
      (asset.assignedTo ?? '').toLowerCase().includes(q);

    const matchesStatus = selectedStatus === 'All' || asset.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Get condition badge styling
  const getConditionStyle = (cond: 'Excellent' | 'Good' | 'Fair' | 'Poor') => {
    switch (cond) {
      case 'Excellent': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Good': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Fair': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'Poor': return 'bg-red-500/10 text-red-400 border border-red-500/20';
    }
  };

  // Get status badge styling
  const getStatusStyle = (st: string) => {
    switch (st) {
      case 'Available': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'Allocated': return 'bg-purple-500/15 text-purple-400 border border-purple-500/30';
      case 'Reserved': return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'Under Maintenance': return 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
      case 'Retired': return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="assets-view-root">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Asset Directory</h1>
          <p className="text-slate-400 text-sm">Review, track and filter active physical inventory and workspace workstations.</p>
        </div>
        
        {/* Buttons Panel */}
        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-1 flex">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer"
            id="add-asset-btn"
          >
            <Plus className="h-4 w-4" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 pb-2" id="assets-status-filters">
        {statusFilters.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedStatus === st
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-[#0f1830] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Directory Content List */}
      {filteredAssets.length === 0 ? (
        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-12 text-center">
          <Laptop className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-semibold text-white">No hardware assets discovered</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
            No records matched your specific filter configurations or search keyword terms. Try typing another query.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Bento Style */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="assets-grid">
          {filteredAssets.map((asset) => (
            <div 
              key={asset.id}
              className="bg-[#0f1830] border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">{asset.category}</span>
                    <h3 className="font-semibold text-white text-base mt-0.5 leading-snug">{asset.name}</h3>
                    <p className="text-slate-500 text-xs font-mono mt-1">{asset.id}</p>
                  </div>
                  
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${getStatusStyle(asset.status)}`}>
                    {asset.status}
                  </span>
                </div>

                <div className="mt-5 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-[#0a1122]/40">
                    <span className="text-slate-400">Condition</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${getConditionStyle(asset.condition)}`}>
                      {asset.condition}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-[#0a1122]/40">
                    <span className="text-slate-400">Location</span>
                    <span className="text-slate-200 font-medium">{asset.location}</span>
                  </div>
                  <div className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-[#0a1122]/40">
                    <span className="text-slate-400">Assigned To</span>
                    <span className="text-slate-200 font-semibold">{asset.assignedTo || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              {/* Grid Card Footer */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase">Purchased {asset.purchaseDate}</p>
                  <p className="text-white font-bold font-mono text-sm mt-0.5">${(asset.value ?? 0).toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(asset)}
                    className="p-1.5 bg-[#0a1122] rounded-lg border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
                    title="Edit asset"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAsset(asset.id)}
                    className="p-1.5 bg-[#0a1122] rounded-lg border border-slate-800 text-slate-400 hover:text-red-400 hover:border-slate-700 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Delete asset"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Excel Table Spreadsheet Style */
        <div className="bg-[#0f1830] border border-slate-800 rounded-xl overflow-hidden shadow-2xl" id="assets-table-container">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#131d3a] border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Asset ID</th>
                  <th className="px-6 py-4">Asset Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Assigned Employee</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-blue-400">{asset.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{asset.name}</div>
                      <span className="text-xxs text-slate-500">Purchased: {asset.purchaseDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">
                        {asset.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xxs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusStyle(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${getConditionStyle(asset.condition)}`}>
                        {asset.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-white">
                      ${(asset.value ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <span>{asset.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {asset.location}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(asset)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit asset"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteAsset(asset.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete asset"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-800 bg-[#0c1328] flex justify-between items-center text-slate-400 text-xs">
            <span>Showing <strong>{filteredAssets.length}</strong> of {assets.length} assets</span>
            <div className="flex gap-1.5">
              <span className="text-[10px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-md font-mono">compliant</span>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Asset Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="asset-form-modal">
          <div 
            className="bg-[#0f1830] border border-slate-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-slide-up"
            id="asset-form-modal-content"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131d3a]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Laptop className="h-5 w-5 text-blue-500" />
                <span>{editingAsset ? `Edit Asset File (${editingAsset.id})` : 'Register New Hardware Asset'}</span>
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Asset / Model Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apple MacBook Pro M3 Max"
                  className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Asset Value ($ USD)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    placeholder="1200"
                    className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Condition State</label>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Inventory Status</label>
                  <select
                    value={status}
                    onChange={(e) => {
                      const st = e.target.value as any;
                      setStatus(st);
                      if (st !== 'Allocated') {
                        setAssignedToId('');
                      }
                    }}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Allocated">Allocated</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Purchase Date</label>
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Physical Storage Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bangalore HQ - Block A"
                    className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Assignment Selector - only active when Allocated is selected */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  status === 'Allocated' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Assign to Employee {status !== 'Allocated' && <span className="text-[10px] text-slate-600 lowercase">(only available for 'Allocated' status)</span>}
                </label>
                <select
                  disabled={status !== 'Allocated'}
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className="w-full bg-[#0a1122] text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Company Employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role} - {emp.department})</option>
                  ))}
                </select>
              </div>

              {/* Form Action Buttons */}
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
                  <span>{editingAsset ? 'Save Asset Details' : 'Register Asset'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
