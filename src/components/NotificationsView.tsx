import { useState } from 'react';
import { 
  Bell, 
  Trash2, 
  CheckCheck, 
  Wrench, 
  Calendar, 
  Repeat, 
  Laptop, 
  ShieldAlert, 
  FileSpreadsheet, 
  AlertCircle, 
  Filter, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsViewProps {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
}

type NotificationTab = 'All' | 'Unread' | 'Alerts' | 'Updates' | 'Bookings' | 'Transfers' | 'Maintenance';

export default function NotificationsView({
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onDeleteNotification
}: NotificationsViewProps) {
  const [activeTab, setActiveTab] = useState<NotificationTab>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter lists based on Tab
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'Unread':
        return notifications.filter(n => n.isUnread);
      case 'Alerts':
        return notifications.filter(n => n.type === 'overdue' || n.type === 'security');
      case 'Updates':
        return notifications.filter(n => n.type === 'asset' || n.type === 'system');
      case 'Bookings':
        return notifications.filter(n => n.type === 'booking');
      case 'Transfers':
        return notifications.filter(n => n.type === 'transfer');
      case 'Maintenance':
        return notifications.filter(n => n.type === 'maintenance');
      case 'All':
      default:
        return notifications;
    }
  };

  const filteredList = getFilteredNotifications();

  // Pagination calculation
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = filteredList.slice(startIndex, startIndex + itemsPerPage);

  // Helper to get unread counts for badges
  const getTabUnreadCount = (tab: NotificationTab) => {
    switch (tab) {
      case 'All':
        return notifications.filter(n => n.isUnread).length;
      case 'Unread':
        return notifications.filter(n => n.isUnread).length;
      case 'Alerts':
        return notifications.filter(n => n.isUnread && (n.type === 'overdue' || n.type === 'security')).length;
      case 'Updates':
        return notifications.filter(n => n.isUnread && (n.type === 'asset' || n.type === 'system')).length;
      case 'Bookings':
        return notifications.filter(n => n.isUnread && n.type === 'booking').length;
      case 'Transfers':
        return notifications.filter(n => n.isUnread && n.type === 'transfer').length;
      case 'Maintenance':
        return notifications.filter(n => n.isUnread && n.type === 'maintenance').length;
    }
  };

  // Helper for colored icons representing notification types
  const getNotificationIconBadge = (type: AppNotification['type']) => {
    switch (type) {
      case 'overdue':
        return { icon: AlertCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20' };
      case 'maintenance':
        return { icon: Wrench, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
      case 'booking':
        return { icon: Calendar, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case 'transfer':
        return { icon: Repeat, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'asset':
        return { icon: Laptop, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      case 'security':
        return { icon: ShieldAlert, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
      case 'report':
        return { icon: FileSpreadsheet, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' };
      case 'system':
      default:
        return { icon: Bell, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
    }
  };

  // Human friendly formatting for dates
  const formatTimeAgo = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTabClick = (tab: NotificationTab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page on tab shift
  };

  return (
    <div className="space-y-6 animate-fade-in" id="notifications-view-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notification Center</h1>
          <p className="text-slate-400 text-sm">Inbox messages, inventory alerts, maintenance completions, and system log status reports.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            id="mark-all-as-read-link"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
          
          <button className="flex items-center gap-1.5 bg-[#0f1830] hover:bg-slate-800 border border-slate-800 p-2 text-xs text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <span>Filter Options</span>
          </button>
        </div>
      </div>

      {/* Tabs list with counts */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3" id="notifications-tabs">
        {(['All', 'Unread', 'Alerts', 'Updates', 'Bookings', 'Transfers', 'Maintenance'] as NotificationTab[]).map((tab) => {
          const count = getTabUnreadCount(tab);
          return (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <span>{tab}</span>
              {count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-sans scale-90">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Vertical list of notifications */}
      <div className="bg-[#0f1830] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="divide-y divide-slate-800/60" id="notifications-rows-list">
          {paginatedList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <Bell className="h-10 w-12 text-slate-700 mx-auto mb-3" />
              <span>No notifications found in this category.</span>
            </div>
          ) : (
            paginatedList.map((item) => {
              const { icon: Icon, color } = getNotificationIconBadge(item.type);
              return (
                <div 
                  key={item.id}
                  onClick={() => onMarkAsRead(item.id)}
                  className={`p-4 flex gap-4 items-start hover:bg-slate-800/20 transition-all cursor-pointer relative ${
                    item.isUnread ? 'bg-blue-500/[0.02]' : ''
                  }`}
                  id={`notification-row-${item.id}`}
                >
                  {/* Left edge Blue Dot indicator for Unread items */}
                  {item.isUnread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                  )}

                  {/* Icon badge */}
                  <div className={`p-2.5 rounded-xl border shrink-0 ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Body text details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm ${item.isUnread ? 'font-bold text-white' : 'font-semibold text-slate-300'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-xs leading-relaxed pr-8">
                      {item.description}
                    </p>

                    {/* Tags or Status pills */}
                    {item.tag && (
                      <div className="pt-1.5 flex items-center gap-1.5">
                        <span className="text-[9px] font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono uppercase tracking-wider">
                          {item.tag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Trash button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering read on trash click
                      onDeleteNotification(item.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer self-center"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Real Dynamic Pagination Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0c1328] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs">
          <span>
            Showing <strong>{startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)}</strong> of {totalItems} notifications
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-7 w-7 rounded-lg text-xs font-semibold cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
