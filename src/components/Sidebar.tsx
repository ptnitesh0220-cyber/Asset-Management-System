import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Repeat, 
  Calendar, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  Bell, 
  Activity, 
  Settings, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Boxes
} from 'lucide-react';
import { ActiveSection } from '../types';

interface SidebarProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  unreadNotificationsCount: number;
  unreadMailsCount: number;
  onLogout: () => void;
}

interface MenuItem {
  id: ActiveSection;
  label: string;
  icon: any;
  badge?: number;
  badgeColor?: string;
}

export default function Sidebar({ 
  activeSection, 
  setActiveSection, 
  unreadNotificationsCount, 
  unreadMailsCount,
  onLogout 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'organization', label: 'Organization', icon: Users },
    { id: 'assets', label: 'Assets', icon: ClipboardList },
    { id: 'allocation', label: 'Allocation & Transfer', icon: Repeat },
    { id: 'booking', label: 'Resource Booking', icon: Calendar },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'audit', label: 'Audit Overview', icon: ClipboardCheck },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount, badgeColor: 'bg-red-500' },
    { id: 'mail', label: 'Mail Center', icon: Mail, badge: unreadMailsCount, badgeColor: 'bg-blue-600' },
    { id: 'logs', label: 'Activity Logs', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside 
      className={`bg-[#0f1830] border-r border-slate-800 flex flex-col transition-all duration-300 h-screen sticky top-0 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      id="sidebar"
    >
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-blue-600 rounded-lg text-white shrink-0">
            <Boxes className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <span className="font-sans font-bold text-lg tracking-tight text-white whitespace-nowrap animate-fade-in">
              Asset<span className="text-blue-500">Flow</span>
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer hidden md:block"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          id="sidebar-toggle-btn"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                isActive 
                  ? 'bg-blue-600/15 text-blue-400 border-l-4 border-blue-600 rounded-l-none' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title={isCollapsed ? item.label : undefined}
              id={`nav-item-${item.id}`}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-colors ${
                isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-white'
              }`} />
              
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {/* Status badges */}
              {item.badge && item.badge > 0 ? (
                isCollapsed ? (
                  <span className={`absolute top-1 right-1 h-2 w-2 rounded-full ${item.badgeColor}`} />
                ) : (
                  <span className={`px-1.5 py-0.5 rounded-full text-xxs text-white font-sans ${item.badgeColor} scale-90`}>
                    {item.badge}
                  </span>
                )
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile or Logout */}
      <div className="p-3 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer group"
          id="sidebar-logout-btn"
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-red-400" />
          {!isCollapsed && <span className="truncate">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
