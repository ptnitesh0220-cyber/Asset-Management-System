import { 
  Laptop, 
  CheckCircle, 
  TrendingUp, 
  Wrench, 
  Archive, 
  Calendar, 
  Activity, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  Repeat
} from 'lucide-react';
import { Asset, Booking, ActivityLog, ActiveSection } from '../types';

interface DashboardViewProps {
  assets: Asset[];
  bookings: Booking[];
  activityLogs: ActivityLog[];
  setActiveSection: (section: ActiveSection) => void;
  onQuickAction: (action: 'addAsset' | 'addTransfer' | 'addBooking' | 'addMaintenance') => void;
}

export default function DashboardView({
  assets,
  bookings,
  activityLogs,
  setActiveSection,
  onQuickAction
}: DashboardViewProps) {
  // Compute real-time KPIs
  const totalAssets = assets.length;
  const availableAssets = assets.filter(a => a.status === 'Available').length;
  const allocatedAssets = assets.filter(a => a.status === 'Allocated').length;
  const maintenanceAssets = assets.filter(a => a.status === 'Under Maintenance').length;
  const reservedOrRetired = assets.filter(a => a.status === 'Reserved' || a.status === 'Retired').length;

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

  const kpis = [
    {
      title: 'Total Assets',
      value: totalAssets,
      subtext: `Valued at $${totalValue.toLocaleString()}`,
      trend: '+12% MoM',
      isTrendPositive: true,
      icon: Laptop,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    },
    {
      title: 'Available',
      value: availableAssets,
      subtext: 'In storage depots',
      trend: `${Math.round((availableAssets / (totalAssets || 1)) * 100)}% of total`,
      isTrendPositive: true,
      icon: CheckCircle,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      title: 'Allocated',
      value: allocatedAssets,
      subtext: 'Assigned to staff',
      trend: '+4 this week',
      isTrendPositive: true,
      icon: TrendingUp,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      title: 'Under Repair',
      value: maintenanceAssets,
      subtext: 'Active work tickets',
      trend: '2 urgent swaps',
      isTrendPositive: false,
      icon: Wrench,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    },
    {
      title: 'Reserved/Retired',
      value: reservedOrRetired,
      subtext: 'Saved or decommissioned',
      trend: 'No change',
      isTrendPositive: true,
      icon: Archive,
      color: 'text-slate-400 bg-slate-500/10 border-slate-500/30'
    }
  ];

  // Compute additional metric for dynamic Asset Health Score based on actual condition states
  const excellentCount = assets.filter(a => a.condition === 'Excellent').length;
  const goodCount = assets.filter(a => a.condition === 'Good').length;
  const fairCount = assets.filter(a => a.condition === 'Fair').length;
  const poorCount = assets.filter(a => a.condition === 'Poor').length;
  
  const healthScore = totalAssets > 0 
    ? Math.round(((excellentCount * 100 + goodCount * 85 + fairCount * 60 + poorCount * 30) / totalAssets)) 
    : 92;

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-view-root">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm">Organization real-time asset health, utilization, and workspace allocation.</p>
        </div>
        
        {/* Quick Actions Shortcuts Panel */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => onQuickAction('addAsset')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer"
            id="dash-quick-add-asset"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Asset</span>
          </button>
          <button 
            onClick={() => onQuickAction('addTransfer')}
            className="flex items-center gap-2 bg-[#0f1830] hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            id="dash-quick-transfer"
          >
            <Repeat className="h-4 w-4 text-emerald-400" />
            <span>New Transfer</span>
          </button>
          <button 
            onClick={() => onQuickAction('addMaintenance')}
            className="flex items-center gap-2 bg-[#0f1830] hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            id="dash-quick-maintenance"
          >
            <Wrench className="h-4 w-4 text-orange-400" />
            <span>Raise Request</span>
          </button>
        </div>
      </div>

      {/* Bento style KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="kpi-cards-grid">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <div 
              key={idx}
              className={`bg-[#0f1830] border border-slate-800/80 rounded-xl p-4 md:p-5 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group ${idx === 4 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{kpi.title}</p>
                <div className={`p-2 rounded-lg border ${kpi.color} transition-transform group-hover:scale-105`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{kpi.value}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 truncate max-w-[120px]">{kpi.subtext}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  kpi.isTrendPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                } shrink-0`}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: 12-Column High-Density Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Recent Asset Bookings / Allocations (Wide Bento Panel) */}
        <div className="col-span-12 lg:col-span-8 bg-[#0f1830] rounded-xl border border-slate-800 p-6 flex flex-col justify-between shadow-lg h-[440px]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-white">Upcoming Resource Bookings</h3>
                <p className="text-slate-400 text-xs">Shared hardware, lab bays, and facilities bookings</p>
              </div>
              <span 
                onClick={() => setActiveSection('booking')}
                className="text-blue-500 hover:text-blue-400 text-sm font-semibold cursor-pointer transition-colors"
              >
                View Calendar
              </span>
            </div>

            {/* Bookings bento rows */}
            <div className="space-y-3 overflow-y-auto max-h-[260px] pr-1">
              {bookings.slice(0, 3).map((bk) => (
                <div 
                  key={bk.id}
                  className="flex items-center justify-between p-3.5 bg-[#0a1122]/50 hover:bg-[#0a1122] rounded-lg border border-slate-800/50 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:scale-105 transition-transform">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{bk.resourceName} <span className="text-slate-500 font-mono font-normal text-xs">{bk.id}</span></p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Reserved for <span className="text-blue-400 font-medium">{bk.requesterName}</span> • Slot: <span className="text-slate-300 font-mono">{bk.timeSlot}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      bk.status === 'Ongoing'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : bk.status === 'Upcoming'
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {bk.status}
                    </span>
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">{bk.date}</span>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No resource reservations active.
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => onQuickAction('addBooking')}
            className="w-full bg-[#0a1122] hover:bg-[#0c163a] border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Reservation</span>
          </button>
        </div>

        {/* Right Column: Mini Bento Stack (Asset Health & Alerts) */}
        <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-6 h-[440px]">
          
          {/* Asset Health Bento Block */}
          <div className="bg-[#0f1830] rounded-xl border border-slate-800 p-5 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-white">Asset Health Score</h3>
                <p className="text-slate-500 text-xxs uppercase tracking-wider font-semibold mt-0.5">Real-time compilation</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="flex items-center justify-center h-24 relative">
              <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
                <path 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="#1e293b" 
                  strokeWidth="3.2" 
                  strokeDasharray="100, 100"
                ></path>
                <path 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="3.2" 
                  strokeDasharray={`${healthScore}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                ></path>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{healthScore}%</span>
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Health</span>
              </div>
            </div>

            <p className="text-xs text-center text-slate-400">
              Fleet integrity is <span className="text-emerald-400 font-bold">{healthScore >= 90 ? 'Excellent' : healthScore >= 75 ? 'Optimal' : 'Needs Action'}</span> based on active repairs.
            </p>
          </div>

          {/* Security & Workspace Alerts Bento Block */}
          <div className="bg-[#0f1830] rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
              <h3 className="font-bold text-sm text-white">System Monitor</h3>
              <div className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                <span>Active Alerts</span>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                <p className="text-xxs text-slate-300 truncate">Unregistered login warning on AF-1042</p>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                <p className="text-xxs text-slate-300 truncate">Pending audit verification for 4 laptops</p>
              </div>
              <div className="flex items-center space-x-2.5 opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                <p className="text-xxs text-slate-400 truncate">IP Geo-Restriction lists updated</p>
              </div>
              <div className="flex items-center space-x-2.5 opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                <p className="text-xxs text-slate-400 truncate">Admin session token rotation completed</p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-800/80">
              <div className="flex justify-between text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                <span>Scanner Engine</span>
                <span className="text-emerald-400">● Live Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Row 3: Secondary Bento Grid (Logs + compliance gradients) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Bento: Timeline Logs */}
        <div className="lg:col-span-5 bg-[#0f1830] border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/50">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-400" />
                <h4 className="font-bold text-sm text-white">Recent System Logs</h4>
              </div>
              <span 
                onClick={() => setActiveSection('logs')}
                className="text-slate-400 hover:text-white text-xxs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Full Logs →
              </span>
            </div>

            {/* Activities Vertical timeline */}
            <div className="mt-4 space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
              {activityLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex gap-3 relative">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center border shrink-0 text-white text-[10px] z-10 font-bold ${
                    log.status === 'Success' 
                      ? 'bg-[#0a1122] border-emerald-500/40 text-emerald-400' 
                      : 'bg-[#0a1122] border-red-500/40 text-red-400'
                  }`}>
                    {log.status === 'Success' ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-200 leading-tight">
                      <span className="font-semibold text-white">{log.user}</span>: {log.action}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono">
                      <span>IP: {log.ipAddress}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No activity logs registered.
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => setActiveSection('logs')}
            className="w-full mt-4 bg-transparent hover:bg-slate-800/40 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Complete Audit Log Feed</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Right Bento: Stunning Double Compliance Banners */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-gradient-to-br from-blue-950/30 to-[#0f1830] border border-blue-500/15 p-5 rounded-xl flex flex-col justify-between shadow-md hover:border-blue-500/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-[9px] uppercase font-extrabold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10">Active Standard</span>
              </div>
              <h4 className="font-bold text-white text-sm mt-4">System Compliance Verified</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Your organization is fully aligned with the active IT Audit Standard Q3. Physical verification logs and access histories are signed and recorded.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/60 mt-4 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Audit Status</span>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Compliant
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-950/30 to-[#0f1830] border border-purple-500/15 p-5 rounded-xl flex flex-col justify-between shadow-md hover:border-purple-500/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 shrink-0">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <span className="text-[9px] uppercase font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/10">Ledger Metrics</span>
              </div>
              <h4 className="font-bold text-white text-sm mt-4">Asset Capital Value Tracker</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                The current aggregate value of hardware in system inventory is <span className="text-white font-semibold">${totalValue.toLocaleString()}</span>. Depreciating models are flagged for review.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/60 mt-4 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Fiscal Year</span>
              <span className="text-purple-400 text-xs font-semibold cursor-pointer hover:underline" onClick={() => setActiveSection('reports')}>
                Generate Reports →
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
