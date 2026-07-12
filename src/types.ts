export interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'Available' | 'Allocated' | 'Reserved' | 'Under Maintenance' | 'Retired';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  purchaseDate: string;
  value: number;
  assignedTo?: string; // Employee name
  assignedToId?: string; // Employee ID
  location: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatar: string;
  assignedAssets: string[]; // List of Asset names/IDs
}

export interface TransferRequest {
  id: string;
  assetId: string;
  assetName: string;
  fromEmployee: string;
  toEmployee: string;
  requestDate: string;
  status: 'Allocated' | 'Overdue' | 'Good' | 'Pending'; // Match user-requested status pills + workflow state
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface Booking {
  id: string;
  resourceName: string;
  requesterName: string;
  timeSlot: string; // e.g., "10:00 AM - 11:30 AM"
  date: string; // e.g., "2026-07-13"
  status: 'Ongoing' | 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface MaintenanceTicket {
  id: string;
  assetId: string;
  assetName: string;
  issueDescription: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending Approval' | 'In Progress' | 'Resolved' | 'Rejected';
  requestDate: string;
  photoUrl?: string;
}

export interface AuditItem {
  id: string;
  assetId: string;
  assetName: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Damaged' | 'Missing';
  verifiedBy?: string;
  notes?: string;
  date: string;
}

export interface AppNotification {
  id: string;
  type: 'overdue' | 'maintenance' | 'booking' | 'transfer' | 'asset' | 'security' | 'report' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
  tag?: string; // e.g., "Overdue", "Maintenance", "View Report"
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  status: 'Success' | 'Failed';
  ipAddress: string;
}

export interface MailMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  subject: string;
  body: string;
  timestamp: string;
  isUnread: boolean;
}

export interface AppSettings {
  profile: {
    name: string;
    role: string;
    avatar: string;
  };
  security: {
    loginAlerts: boolean;
    sessionTimeout: number; // minutes
  };
  notifications: {
    email: boolean;
    browser: boolean;
    overdueAlerts: boolean;
    maintenanceAlerts: boolean;
    bookingConfirmations: boolean;
  };
  preferences: {
    defaultDashboard: string;
    itemsPerPage: number;
    fontSize: 'Small' | 'Medium' | 'Large';
    compactMode: boolean;
    primaryColor: string;
    autoRefresh: boolean;
  };
  system: {
    assetIdPrefix: string;
    exportFormat: 'PDF' | 'CSV';
    maintainLogs: boolean;
  };
}

export type ActiveSection =
  | 'dashboard'
  | 'organization'
  | 'assets'
  | 'allocation'
  | 'booking'
  | 'maintenance'
  | 'audit'
  | 'reports'
  | 'notifications'
  | 'logs'
  | 'mail'
  | 'settings';
