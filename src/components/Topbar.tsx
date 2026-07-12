import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Mail, ChevronDown, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { ActiveSection } from '../types';

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadNotificationsCount: number;
  unreadMailsCount: number;
  setActiveSection: (section: ActiveSection) => void;
  profile: { name: string; role: string; avatar: string };
  onLogout: () => void;
}

export default function Topbar({
  searchQuery,
  setSearchQuery,
  unreadNotificationsCount,
  unreadMailsCount,
  setActiveSection,
  profile,
  onLogout
}: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header 
      className="h-16 border-b border-slate-800 bg-[#0f1830] px-6 flex items-center justify-between sticky top-0 z-40"
      id="app-topbar"
    >
      {/* Search Input Bar */}
      <div className="flex-1 max-w-md relative mr-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assets, employees, bookings, logs..."
          className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          id="global-search-input"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Action Buttons & Profile Panel */}
      <div className="flex items-center gap-4">
        {/* Mail Inbox Shortcut */}
        <button
          onClick={() => setActiveSection('mail')}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all relative cursor-pointer"
          title="Internal Mail Center"
          id="topbar-mail-btn"
        >
          <Mail className="h-5 w-5" />
          {unreadMailsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-blue-600 text-xxs font-bold text-white flex items-center justify-center scale-90">
              {unreadMailsCount}
            </span>
          )}
        </button>

        {/* Notifications Shortcut */}
        <button
          onClick={() => setActiveSection('notifications')}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all relative cursor-pointer"
          title="Notification Inbox"
          id="topbar-bell-btn"
        >
          <Bell className="h-5 w-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-red-500 text-xxs font-bold text-white flex items-center justify-center scale-90">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-slate-800" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800 transition-all cursor-pointer group"
            id="profile-dropdown-trigger"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-8 w-8 rounded-full object-cover border border-slate-700 group-hover:border-blue-500 transition-colors"
              referrerPolicy="no-referrer"
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">{profile.name}</p>
              <p className="text-xs text-slate-400 leading-tight">{profile.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0f1830] border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-slate-200">
              <div className="px-4 py-2.5 border-b border-slate-800 sm:hidden">
                <p className="text-sm font-semibold text-white leading-tight">{profile.name}</p>
                <p className="text-xs text-slate-400 leading-tight">{profile.role}</p>
              </div>

              <button
                onClick={() => {
                  setActiveSection('settings');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-800 text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>My Profile</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveSection('settings');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-800 text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <SettingsIcon className="h-4 w-4 text-slate-400" />
                <span>Account Settings</span>
              </button>

              <div className="border-t border-slate-800 my-1" />

              <button
                onClick={() => {
                  onLogout();
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400 text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
