import React, { useState } from 'react';
import { User, Shield, Bell, Sliders, Settings2, CheckCircle2, Lock, KeyRound, Eye } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

type SettingsTab = 'profile' | 'security' | 'notifications' | 'preferences' | 'system';

export default function SettingsView({ settings, onSaveSettings }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [successToast, setSuccessToast] = useState(false);

  // Profile States
  const [profileName, setProfileName] = useState(settings.profile.name);
  const [profileRole, setProfileRole] = useState(settings.profile.role);
  const [profileAvatar, setProfileAvatar] = useState(settings.profile.avatar);

  // Security States
  const [loginAlerts, setLoginAlerts] = useState(settings.security.loginAlerts);
  const [sessionTimeout, setSessionTimeout] = useState(settings.security.sessionTimeout);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  // Notifications States
  const [emailNotify, setEmailNotify] = useState(settings.notifications.email);
  const [browserNotify, setBrowserNotify] = useState(settings.notifications.browser);
  const [overdueAlerts, setOverdueAlerts] = useState(settings.notifications.overdueAlerts);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(settings.notifications.maintenanceAlerts);
  const [bookingConfirm, setBookingConfirm] = useState(settings.notifications.bookingConfirmations);

  // Preferences States
  const [defaultDashboard, setDefaultDashboard] = useState(settings.preferences.defaultDashboard);
  const [itemsPerPage, setItemsPerPage] = useState(settings.preferences.itemsPerPage);
  const [fontSize, setFontSize] = useState(settings.preferences.fontSize);
  const [compactMode, setCompactMode] = useState(settings.preferences.compactMode);
  const [primaryColor, setPrimaryColor] = useState(settings.preferences.primaryColor);
  const [autoRefresh, setAutoRefresh] = useState(settings.preferences.autoRefresh);

  // System States
  const [assetIdPrefix, setAssetIdPrefix] = useState(settings.system.assetIdPrefix);
  const [exportFormat, setExportFormat] = useState(settings.system.exportFormat);
  const [maintainLogs, setMaintainLogs] = useState(settings.system.maintainLogs);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: AppSettings = {
      profile: {
        name: profileName,
        role: profileRole,
        avatar: profileAvatar
      },
      security: {
        loginAlerts,
        sessionTimeout: Number(sessionTimeout)
      },
      notifications: {
        email: emailNotify,
        browser: browserNotify,
        overdueAlerts,
        maintenanceAlerts,
        bookingConfirmations: bookingConfirm
      },
      preferences: {
        defaultDashboard,
        itemsPerPage: Number(itemsPerPage),
        fontSize,
        compactMode,
        primaryColor,
        autoRefresh
      },
      system: {
        assetIdPrefix,
        exportFormat,
        maintainLogs
      }
    };

    onSaveSettings(updated);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const colorPresets = [
    { value: '#2563eb', label: 'Default Blue' },
    { value: '#059669', label: 'Emerald' },
    { value: '#7c3aed', label: 'Purple' },
    { value: '#0284c7', label: 'Sky' },
    { value: '#d97706', label: 'Amber' }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="settings-view-root">
      {/* Toast message */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e293b] border-l-4 border-blue-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
          <span className="text-xs font-semibold">AssetFlow configurations saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-slate-400 text-sm">Customize platform UI layouts, profile roles, alert parameters and compliance logs.</p>
      </div>

      {/* Settings Grid Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left column navigation tabs */}
        <div className="md:col-span-1 space-y-1 bg-[#0f1830] border border-slate-800 p-3 rounded-xl h-fit">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'security', label: 'Security & Access', icon: Shield },
            { id: 'notifications', label: 'Alert Channels', icon: Bell },
            { id: 'preferences', label: 'UI Preferences', icon: Sliders },
            { id: 'system', label: 'Admin & System', icon: Settings2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right column detailed panels (Form wrapped) */}
        <form onSubmit={handleSave} className="md:col-span-3 bg-[#0f1830] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          
          {/* My Profile Section */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-semibold text-white">Profile Details</h3>
                <p className="text-slate-400 text-xs mt-0.5">Manage your operator name, role title, and avatar icon.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
                <img
                  src={profileAvatar}
                  alt={profileName}
                  className="h-16 w-16 rounded-full object-cover border-2 border-blue-500 shadow-xl shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="w-full">
                  <label className="block text-xxs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Avatar Image URL</label>
                  <input
                    type="url"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    className="w-full bg-[#0a1122] text-xs text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Operator Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Staff Role Title</label>
                  <input
                    type="text"
                    disabled
                    value={profileRole}
                    className="w-full bg-[#0a1122]/60 text-sm text-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-800 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security & Access Section */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-semibold text-white">Security & Session Toggles</h3>
                <p className="text-slate-400 text-xs mt-0.5">Control login verification, timeout lengths, and update password credentials.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-[#0a1122]/60 border border-slate-800 rounded-xl">
                  <div>
                    <span className="block text-xs font-semibold text-white">Login Alerts Notification</span>
                    <span className="block text-[10px] text-slate-500">Dispatch mail triggers when login from new IP occurs.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={loginAlerts}
                    onChange={(e) => setLoginAlerts(e.target.checked)}
                    className="h-4 w-4 bg-slate-800 border-slate-700 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-[#0a1122]/60 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block text-xs font-semibold text-white">Session Timeout Interval</span>
                      <span className="block text-[10px] text-slate-500">Automatically logout idle operators.</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{sessionTimeout} minutes</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number(e.target.value))}
                    className="w-full accent-blue-600 bg-slate-800 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Password credentials block */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-blue-500" />
                  <span>Update Password Credentials</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                    className="bg-[#0a1122] text-xs text-white placeholder-slate-600 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordForm.next}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, next: e.target.value }))}
                    className="bg-[#0a1122] text-xs text-white placeholder-slate-600 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                    className="bg-[#0a1122] text-xs text-white placeholder-slate-600 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Alert Channels Section */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-semibold text-white">Alert Toggles</h3>
                <p className="text-slate-400 text-xs mt-0.5">Control transmission channels for physical inventory events.</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { state: emailNotify, set: setEmailNotify, label: 'Email Notifications', sub: 'Receive reports and compliance registers in your personal inbox.' },
                  { state: browserNotify, set: setBrowserNotify, label: 'Push Toggles', sub: 'Enable sound and desktop alerts for urgent asset handovers.' },
                  { state: overdueAlerts, set: setOverdueAlerts, label: 'Overdue Hardware Deadlines', sub: 'Trigger alerts immediately when asset return windows close.' },
                  { state: maintenanceAlerts, set: setMaintenanceAlerts, label: 'Maintenance Stage Transitions', sub: 'Notify when tickets move from In Progress to Completed.' },
                  { state: bookingConfirm, set: setBookingConfirm, label: 'Booking Approvals', sub: 'Dispatched on room scheduler confirmation.' }
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0a1122]/60 border border-slate-800 rounded-xl">
                    <div>
                      <span className="block text-xs font-semibold text-white">{row.label}</span>
                      <span className="block text-[10px] text-slate-500 leading-normal">{row.sub}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={row.state}
                      onChange={(e) => row.set(e.target.checked)}
                      className="h-4 w-4 bg-slate-800 border-slate-700 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences Section */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-semibold text-white">Interface Configuration</h3>
                <p className="text-slate-400 text-xs mt-0.5">Adjust dashboard layout, typography scaling, theme color presets, and auto refreshing.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Default Statistics View</label>
                  <select
                    value={defaultDashboard}
                    onChange={(e) => setDefaultDashboard(e.target.value)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none"
                  >
                    <option value="all">All Enterprise Assets</option>
                    <option value="allocated">Allocated Devices Only</option>
                    <option value="available">Storage Depots Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Items Displayed Per Page</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none"
                  >
                    <option value={5}>5 entries</option>
                    <option value={10}>10 entries</option>
                    <option value={20}>20 entries</option>
                    <option value={50}>50 entries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Typography Scale Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value as any)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none"
                  >
                    <option value="Small">Small font size</option>
                    <option value="Medium">Medium density font</option>
                    <option value="Large">High accessibility text</option>
                  </select>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Theme Accent Color</label>
                  <select
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none font-mono"
                  >
                    {colorPresets.map(preset => (
                      <option key={preset.value} value={preset.value}>{preset.label} ({preset.value})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center justify-between p-3.5 bg-[#0a1122]/60 border border-slate-800 rounded-xl">
                  <div>
                    <span className="block text-xs font-semibold text-white">Enable Compact Density Mode</span>
                    <span className="block text-[10px] text-slate-500">Reduces screen margins to show more tables.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                    className="h-4 w-4 bg-slate-800 border-slate-700 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#0a1122]/60 border border-slate-800 rounded-xl">
                  <div>
                    <span className="block text-xs font-semibold text-white">Interactive Auto Refresh</span>
                    <span className="block text-[10px] text-slate-500">Periodically polls database every 30 seconds.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="h-4 w-4 bg-slate-800 border-slate-700 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Admin & System Section */}
          {activeTab === 'system' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-semibold text-white">System Settings (Admin-only)</h3>
                <p className="text-slate-400 text-xs mt-0.5">Configure global hardware parameters, default export schemes and audit logs compliance.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Asset ID Prefix</label>
                  <input
                    type="text"
                    required
                    value={assetIdPrefix}
                    onChange={(e) => setAssetIdPrefix(e.target.value)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Default Export Format</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none"
                  >
                    <option value="PDF">PDF Portable Document Format</option>
                    <option value="CSV">Comma Separated Values Spreadsheet</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#0a1122]/60 border border-slate-800 rounded-xl pt-2">
                <div>
                  <span className="block text-xs font-semibold text-white">Maintain Persistent Security Logs</span>
                  <span className="block text-[10px] text-slate-500">Store and index operator transaction histories indefinitely.</span>
                </div>
                <input
                  type="checkbox"
                  checked={maintainLogs}
                  onChange={(e) => setMaintainLogs(e.target.checked)}
                  className="h-4 w-4 bg-slate-800 border-slate-700 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Form Save Button Footer */}
          <div className="pt-5 border-t border-slate-800 flex items-center justify-between">
            <a href="#privacy" className="text-xxs text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy & Data Compliancy Guidelines
            </a>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              id="save-settings-btn"
            >
              Save Configuration Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
