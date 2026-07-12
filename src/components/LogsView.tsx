import { useState } from 'react';
import { Activity, ShieldCheck, FileSpreadsheet, Search, Filter } from 'lucide-react';
import { ActivityLog } from '../types';

interface LogsViewProps {
  activityLogs: ActivityLog[];
  searchQuery: string;
}

export default function LogsView({ activityLogs, searchQuery }: LogsViewProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Success' | 'Failed'>('All');

  // Filter logs
  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesStatus = 
      statusFilter === 'All' || 
      log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="logs-view-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Activity Logs</h1>
          <p className="text-slate-400 text-sm">Review full audit logs, active login sessions, and database transactional histories.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 bg-[#0f1830] border border-slate-800 p-1.5 rounded-xl self-start sm:self-auto">
          {(['All', 'Success', 'Failed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log spreadsheet list */}
      <div className="bg-[#0f1830] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-[#131d3a] border-b border-slate-800/60 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-blue-500" />
            <span>Compliance Audit Trail</span>
          </h3>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
            Active session: encrypted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a1122]/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Operator / User</th>
                <th className="px-6 py-4">Action Description</th>
                <th className="px-6 py-4">Status Tag</th>
                <th className="px-6 py-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    No matching activity logs discovered.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {log.action}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        log.status === 'Success' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 text-right">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
