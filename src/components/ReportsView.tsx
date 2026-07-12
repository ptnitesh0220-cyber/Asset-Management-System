import { useState } from 'react';
import { BarChart3, FileText, CheckCircle2, Calendar, Shield, HelpCircle, ArrowDownToLine, Users2, DollarSign } from 'lucide-react';
import { Asset, Booking, Employee } from '../types';

interface ReportsViewProps {
  assets: Asset[];
  bookings: Booking[];
  employees: Employee[];
}

export default function ReportsView({ assets, bookings, employees }: ReportsViewProps) {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [exportToast, setExportToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Compute stats
  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
  const avgValue = Math.round(totalValue / (assets.length || 1));

  // Assets by Status counts
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const allocatedCount = assets.filter(a => a.status === 'Allocated').length;
  const reservedCount = assets.filter(a => a.status === 'Reserved').length;
  const maintenanceCount = assets.filter(a => a.status === 'Under Maintenance').length;
  const retiredCount = assets.filter(a => a.status === 'Retired').length;

  // Bookings by Status
  const bookingOngoing = bookings.filter(b => b.status === 'Ongoing').length;
  const bookingUpcoming = bookings.filter(b => b.status === 'Upcoming').length;
  const bookingCompleted = bookings.filter(b => b.status === 'Completed').length;
  const bookingCancelled = bookings.filter(b => b.status === 'Cancelled').length;

  // Department-wise asset counts
  const depts = ['Design', 'Engineering', 'Human Resources', 'Finance', 'IT Infrastructure'];
  const deptAssetCounts = depts.map(dept => {
    const deptEmps = employees.filter(e => e.department === dept);
    const count = assets.filter(a => deptEmps.some(e => e.name === a.assignedTo)).length;
    return { name: dept, count };
  });

  const maxDeptCount = Math.max(...deptAssetCounts.map(d => d.count), 1);

  const triggerExport = (format: 'PDF' | 'CSV') => {
    const message = `Compiling report... AssetFlow_${format === 'PDF' ? 'Inventory_Summary.pdf' : 'Asset_Ledger.csv'} download initiated successfully!`;
    setExportToast({ message, visible: true });
    setTimeout(() => {
      setExportToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="reports-view-root">
      {/* Toast Alert */}
      {exportToast.visible && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e293b] border-l-4 border-blue-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
          <span className="text-xs font-semibold">{exportToast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-400 text-sm">Analyze organizational asset distribution, resource booking velocities, and capital expenditures.</p>
        </div>

        {/* Date Filter Panel */}
        <div className="flex flex-wrap items-center gap-3 bg-[#0f1830] border border-slate-800 p-2 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">From:</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#0a1122] text-slate-300 px-2 py-1 rounded border border-slate-800 focus:outline-none focus:border-blue-500 font-mono scale-90"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">To:</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#0a1122] text-slate-300 px-2 py-1 rounded border border-slate-800 focus:outline-none focus:border-blue-500 font-mono scale-90"
            />
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Aggregate Valuation</span>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono">${totalValue.toLocaleString()}</h3>
            <span className="text-emerald-400 text-xxs mt-1 block">Full compliant inventory</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Average Unit Value</span>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono">${avgValue.toLocaleString()}</h3>
            <span className="text-slate-400 text-xxs mt-1 block">Per hardware node</span>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Total Staff Registered</span>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono">{employees.length} Members</h3>
            <span className="text-blue-400 text-xxs mt-1 block">Across {depts.length} departments</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Users2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Custom Analytical Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="charts-panel">
        
        {/* Assets by Status Chart */}
        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-1.5 text-sm">Assets By Status</h3>
          <p className="text-slate-400 text-xs mb-5">Proportional hardware state registry breakdown.</p>
          
          <div className="space-y-4">
            {/* Custom Horizontal Progress Bar representation */}
            {[
              { label: 'Available', count: availableCount, color: 'bg-emerald-500', text: 'text-emerald-400' },
              { label: 'Allocated', count: allocatedCount, color: 'bg-purple-500', text: 'text-purple-400' },
              { label: 'Reserved', count: reservedCount, color: 'bg-blue-500', text: 'text-blue-400' },
              { label: 'Under Maintenance', count: maintenanceCount, color: 'bg-orange-500', text: 'text-orange-400' },
              { label: 'Retired', count: retiredCount, color: 'bg-slate-500', text: 'text-slate-400' },
            ].map((item) => {
              const pct = assets.length ? Math.round((item.count / assets.length) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className={`font-semibold ${item.text}`}>{item.count} Devices ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#0a1122] h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bookings by Status Chart */}
        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-1.5 text-sm">Bookings Velocity Breakdown</h3>
          <p className="text-slate-400 text-xs mb-5">Proportionate view of space reservations.</p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Ongoing', count: bookingOngoing, color: 'border-blue-500/20 text-blue-400 bg-blue-500/5' },
              { label: 'Upcoming', count: bookingUpcoming, color: 'border-orange-500/20 text-orange-400 bg-orange-500/5' },
              { label: 'Completed', count: bookingCompleted, color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' },
              { label: 'Cancelled', count: bookingCancelled, color: 'border-red-500/20 text-red-400 bg-red-500/5' },
            ].map((item) => (
              <div key={item.label} className={`border rounded-xl p-4 text-center ${item.color}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest">{item.label}</p>
                <p className="text-3xl font-bold mt-2 font-mono">{item.count}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#0a1122]/60 border border-slate-800/80 p-4 rounded-xl mt-5 text-xs text-slate-400 flex gap-2.5">
            <BarChart3 className="h-5 w-5 text-blue-500 shrink-0" />
            <span>
              Real-time synchronization tracks meeting room occupancy levels with a latency threshold of less than 4 seconds.
            </span>
          </div>
        </div>

        {/* Department-wise asset distribution */}
        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="font-semibold text-white mb-1.5 text-sm">Department-wise Asset Assignment</h3>
          <p className="text-slate-400 text-xs mb-6">Quantity of active computer hardware and screens assigned per team division.</p>
          
          <div className="space-y-4">
            {deptAssetCounts.map((dept) => {
              const barPct = Math.round((dept.count / maxDeptCount) * 100);
              return (
                <div key={dept.name} className="flex items-center gap-4">
                  <span className="w-32 text-xs text-slate-300 font-medium truncate">{dept.name}</span>
                  <div className="flex-1 bg-[#0a1122] h-4 rounded-lg overflow-hidden relative border border-slate-800/50">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-r transition-all duration-700"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs font-bold text-white font-mono">{dept.count} units</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export operations block */}
      <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white text-sm">Generate Asset Ledger Export</h3>
          <p className="text-slate-400 text-xs mt-1">Compile all hardware entries, maintenance tickets, and booking histories into standalone files.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerExport('PDF')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span>Export PDF Report</span>
          </button>
          
          <button
            onClick={() => triggerExport('CSV')}
            className="flex items-center gap-2 bg-[#0a1122] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span>Export CSV Sheet</span>
          </button>
        </div>
      </div>

      {/* Reports Footer */}
      <footer className="border-t border-slate-800 pt-6 mt-12 text-center text-slate-500 text-xs">
        <p className="font-medium">AssetFlow Management Dashboard v2.4 — All systems online</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <a href="#privacy" className="hover:text-white transition-colors flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Privacy Policy</span>
          </a>
          <span>•</span>
          <a href="#terms" className="hover:text-white transition-colors flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>Terms of Service</span>
          </a>
          <span>•</span>
          <a href="#support" className="hover:text-white transition-colors flex items-center gap-1">
            <HelpCircle className="h-3 w-3" />
            <span>Support Helpdesk</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
