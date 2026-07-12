import { Asset, Employee, TransferRequest, Booking, MaintenanceTicket, AuditItem, AppNotification, ActivityLog, MailMessage, AppSettings } from './types';

export const initialEmployees: Employee[] = [
  {
    id: 'EMP-01',
    name: 'Sneha Patil',
    role: 'Lead UX Designer',
    department: 'Design',
    email: 'sneha.patil@assetflow.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedAssets: ['Apple MacBook Pro 16"', 'Dell UltraSharp 32"']
  },
  {
    id: 'EMP-02',
    name: 'Amit Sharma',
    role: 'Senior Backend Engineer',
    department: 'Engineering',
    email: 'amit.sharma@assetflow.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedAssets: ['Lenovo ThinkPad P16', 'Keychron K8 Keyboard']
  },
  {
    id: 'EMP-03',
    name: 'Priya Nair',
    role: 'HR Specialist',
    department: 'Human Resources',
    email: 'priya.nair@assetflow.io',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedAssets: ['Apple iPad Air', 'HP EliteBook 840']
  },
  {
    id: 'EMP-04',
    name: 'Rohan Mehta',
    role: 'Financial Analyst',
    department: 'Finance',
    email: 'rohan.mehta@assetflow.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedAssets: ['Dell Latitude 7420']
  },
  {
    id: 'EMP-05',
    name: 'Deepika Rao',
    role: 'Product Manager',
    department: 'Product Management',
    email: 'deepika.rao@assetflow.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedAssets: ['Apple MacBook Air M2', 'Apple iPhone 15 Pro']
  },
  {
    id: 'EMP-06',
    name: 'Karan Malhotra',
    role: 'IT Support Engineer',
    department: 'IT Infrastructure',
    email: 'karan.m@assetflow.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    assignedAssets: ['Apple MacBook Pro 14"', 'Flogi Network Switch Tester']
  }
];

export const initialAssets: Asset[] = [
  {
    id: 'AF-0101',
    name: 'Apple MacBook Pro 16"',
    category: 'Laptops',
    status: 'Allocated',
    condition: 'Excellent',
    purchaseDate: '2025-03-10',
    value: 2499,
    assignedTo: 'Sneha Patil',
    assignedToId: 'EMP-01',
    location: 'Bangalore HQ - Block B'
  },
  {
    id: 'AF-0102',
    name: 'Lenovo ThinkPad P16',
    category: 'Laptops',
    status: 'Allocated',
    condition: 'Good',
    purchaseDate: '2024-09-15',
    value: 1890,
    assignedTo: 'Amit Sharma',
    assignedToId: 'EMP-02',
    location: 'Bangalore HQ - Block A'
  },
  {
    id: 'AF-0103',
    name: 'Dell UltraSharp 32" 4K',
    category: 'Monitors',
    status: 'Allocated',
    condition: 'Excellent',
    purchaseDate: '2025-01-20',
    value: 699,
    assignedTo: 'Sneha Patil',
    assignedToId: 'EMP-01',
    location: 'Bangalore HQ - Block B'
  },
  {
    id: 'AF-0104',
    name: 'Apple iPad Air 256GB',
    category: 'Tablets',
    status: 'Allocated',
    condition: 'Good',
    purchaseDate: '2024-05-12',
    value: 749,
    assignedTo: 'Priya Nair',
    assignedToId: 'EMP-03',
    location: 'Mumbai Office'
  },
  {
    id: 'AF-0105',
    name: 'HP EliteBook 840 G10',
    category: 'Laptops',
    status: 'Allocated',
    condition: 'Excellent',
    purchaseDate: '2025-02-18',
    value: 1250,
    assignedTo: 'Priya Nair',
    assignedToId: 'EMP-03',
    location: 'Mumbai Office'
  },
  {
    id: 'AF-0106',
    name: 'Dell Latitude 7420',
    category: 'Laptops',
    status: 'Allocated',
    condition: 'Fair',
    purchaseDate: '2023-11-02',
    value: 1100,
    assignedTo: 'Rohan Mehta',
    assignedToId: 'EMP-04',
    location: 'Bangalore HQ - Block A'
  },
  {
    id: 'AF-0107',
    name: 'Apple MacBook Air M2',
    category: 'Laptops',
    status: 'Allocated',
    condition: 'Excellent',
    purchaseDate: '2025-04-05',
    value: 1299,
    assignedTo: 'Deepika Rao',
    assignedToId: 'EMP-05',
    location: 'Remote - Delhi'
  },
  {
    id: 'AF-0108',
    name: 'Apple iPhone 15 Pro 256GB',
    category: 'Mobile Phones',
    status: 'Allocated',
    condition: 'Excellent',
    purchaseDate: '2025-05-22',
    value: 1099,
    assignedTo: 'Deepika Rao',
    assignedToId: 'EMP-05',
    location: 'Remote - Delhi'
  },
  {
    id: 'AF-0109',
    name: 'Logitech MX Master 3S Mouse',
    category: 'Accessories',
    status: 'Available',
    condition: 'Good',
    purchaseDate: '2024-08-11',
    value: 99,
    location: 'Bangalore Storage B'
  },
  {
    id: 'AF-0110',
    name: 'Cisco Meraki MR44 AP',
    category: 'Networking',
    status: 'Reserved',
    condition: 'Excellent',
    purchaseDate: '2025-06-01',
    value: 850,
    location: 'Server Room 1'
  },
  {
    id: 'AF-0111',
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Accessories',
    status: 'Under Maintenance',
    condition: 'Poor',
    purchaseDate: '2024-02-14',
    value: 399,
    location: 'IT Repair Center'
  },
  {
    id: 'AF-0112',
    name: 'Epson EcoTank Pro Printer',
    category: 'Printers',
    status: 'Retired',
    condition: 'Poor',
    purchaseDate: '2021-03-19',
    value: 799,
    location: 'Disposal Unit'
  }
];

export const initialTransferRequests: TransferRequest[] = [
  {
    id: 'TR-101',
    assetId: 'AF-0101',
    assetName: 'Apple MacBook Pro 16"',
    fromEmployee: 'Sneha Patil',
    toEmployee: 'Amit Sharma',
    requestDate: '2026-07-01',
    status: 'Allocated',
    condition: 'Excellent'
  },
  {
    id: 'TR-102',
    assetId: 'AF-0106',
    assetName: 'Dell Latitude 7420',
    fromEmployee: 'Rohan Mehta',
    toEmployee: 'Karan Malhotra',
    requestDate: '2026-07-09',
    status: 'Overdue',
    condition: 'Fair'
  },
  {
    id: 'TR-103',
    assetId: 'AF-0109',
    assetName: 'Logitech MX Master 3S Mouse',
    fromEmployee: 'Warehouse Inventory',
    toEmployee: 'Amit Sharma',
    requestDate: '2026-07-11',
    status: 'Good',
    condition: 'Good'
  },
  {
    id: 'TR-104',
    assetId: 'AF-0107',
    assetName: 'Apple MacBook Air M2',
    fromEmployee: 'Deepika Rao',
    toEmployee: 'Priya Nair',
    requestDate: '2026-07-12',
    status: 'Pending',
    condition: 'Excellent'
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'BK-501',
    resourceName: 'Meeting Room - Nebula (Block B)',
    requesterName: 'Sneha Patil',
    timeSlot: '10:00 AM - 11:30 AM',
    date: '2026-07-12',
    status: 'Ongoing'
  },
  {
    id: 'BK-502',
    resourceName: 'Meeting Room - Cosmos (Block A)',
    requesterName: 'Amit Sharma',
    timeSlot: '02:00 PM - 03:30 PM',
    date: '2026-07-12',
    status: 'Upcoming'
  },
  {
    id: 'BK-503',
    resourceName: 'IT Lab Testing Bench A',
    requesterName: 'Karan Malhotra',
    timeSlot: '09:00 AM - 01:00 PM',
    date: '2026-07-13',
    status: 'Upcoming'
  },
  {
    id: 'BK-504',
    resourceName: 'Conference Room - Zenith',
    requesterName: 'Deepika Rao',
    timeSlot: '04:00 PM - 05:00 PM',
    date: '2026-07-11',
    status: 'Completed'
  }
];

export const initialMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'MT-201',
    assetId: 'AF-0111',
    assetName: 'Sony WH-1000XM5 Headphones',
    issueDescription: 'Right ear cup audio is intermittent and crackles during active noise cancellation.',
    priority: 'Medium',
    status: 'In Progress',
    requestDate: '2026-07-08'
  },
  {
    id: 'MT-202',
    assetId: 'AF-0106',
    assetName: 'Dell Latitude 7420',
    issueDescription: 'Battery swelling has slightly lifted the lower trackpad edge. Needs urgent battery swap.',
    priority: 'High',
    status: 'Pending Approval',
    requestDate: '2026-07-11'
  },
  {
    id: 'MT-203',
    assetId: 'AF-0102',
    assetName: 'Lenovo ThinkPad P16',
    issueDescription: 'Thermal throttling under load. Requesting dust extraction and thermal paste re-application.',
    priority: 'Low',
    status: 'Resolved',
    requestDate: '2026-07-02'
  },
  {
    id: 'MT-204',
    assetId: 'AF-0105',
    assetName: 'HP EliteBook 840 G10',
    issueDescription: 'User spilled plain water. Keyboard keys sticking.',
    priority: 'High',
    status: 'Rejected',
    requestDate: '2026-07-05'
  }
];

export const initialAuditItems: AuditItem[] = [
  {
    id: 'AD-801',
    assetId: 'AF-0101',
    assetName: 'Apple MacBook Pro 16"',
    status: 'Completed',
    verifiedBy: 'Karan Malhotra',
    notes: 'Verified physically. No cosmetic damage, functional diagnostics passed.',
    date: '2026-07-10'
  },
  {
    id: 'AD-802',
    assetId: 'AF-0102',
    assetName: 'Lenovo ThinkPad P16',
    status: 'In Progress',
    verifiedBy: 'Arun Kumar',
    notes: 'Awaiting user to bring device to IT center.',
    date: '2026-07-12'
  },
  {
    id: 'AD-803',
    assetId: 'AF-0106',
    assetName: 'Dell Latitude 7420',
    status: 'Damaged',
    verifiedBy: 'Karan Malhotra',
    notes: 'Swollen battery discovered. Sent to repair queue immediately.',
    date: '2026-07-11'
  },
  {
    id: 'AD-804',
    assetId: 'AF-0108',
    assetName: 'Apple iPhone 15 Pro 256GB',
    status: 'Scheduled',
    date: '2026-07-15'
  },
  {
    id: 'AD-805',
    assetId: 'AF-0104',
    assetName: 'Apple iPad Air 256GB',
    status: 'Missing',
    verifiedBy: 'Arun Kumar',
    notes: 'Not found in Mumbai Locker 4. Calling employee to locate.',
    date: '2026-07-12'
  }
];

// Exactly 34 notifications to match "Showing 1 to 8 of 34 notifications"
export const initialNotifications: AppNotification[] = [
  {
    id: 'NT-01',
    type: 'overdue',
    title: 'Asset return overdue',
    description: 'Dell Latitude 7420 (AF-0106) assigned to Rohan Mehta is overdue for return by 4 days.',
    timestamp: '2026-07-12T10:15:00',
    isUnread: true,
    tag: 'Overdue'
  },
  {
    id: 'NT-02',
    type: 'maintenance',
    title: 'Maintenance request approved',
    description: 'Ticket MT-201 for Sony WH-1000XM5 Headphones has been approved and moved to In Progress.',
    timestamp: '2026-07-12T09:30:00',
    isUnread: true,
    tag: 'Maintenance'
  },
  {
    id: 'NT-03',
    type: 'booking',
    title: 'Upcoming room reservation',
    description: 'Meeting Room - Cosmos reserved by Amit Sharma starts in 45 minutes.',
    timestamp: '2026-07-12T08:15:00',
    isUnread: true,
    tag: 'Bookings'
  },
  {
    id: 'NT-04',
    type: 'transfer',
    title: 'Transfer request received',
    description: 'Deepika Rao requested to transfer Apple MacBook Air M2 (AF-0107) to Priya Nair.',
    timestamp: '2026-07-12T07:45:00',
    isUnread: true,
    tag: 'Transfers'
  },
  {
    id: 'NT-05',
    type: 'asset',
    title: 'New asset registered',
    description: 'Cisco Meraki MR44 AP (AF-0110) added to active inventory list.',
    timestamp: '2026-07-11T16:20:00',
    isUnread: false,
    tag: 'Asset Added'
  },
  {
    id: 'NT-06',
    type: 'security',
    title: 'New login detected',
    description: 'Login from IP 192.168.1.144 using Chrome on macOS detected for Arun Kumar.',
    timestamp: '2026-07-11T14:10:00',
    isUnread: false,
    tag: 'Security Alert'
  },
  {
    id: 'NT-07',
    type: 'report',
    title: 'Monthly inventory report generated',
    description: 'The Q2 Asset Depreciations & Fleet Summary PDF has been generated successfully.',
    timestamp: '2026-07-11T12:00:00',
    isUnread: false,
    tag: 'View Report'
  },
  {
    id: 'NT-08',
    type: 'system',
    title: 'System backup complete',
    description: 'Daily automated snapshot backup of AssetFlow database successfully saved to Cloud Bucket.',
    timestamp: '2026-07-11T03:00:00',
    isUnread: false,
    tag: 'System Update'
  },
  // Extra items to make up exactly 34 notifications for testing pagination and real tabs
  {
    id: 'NT-09',
    type: 'maintenance',
    title: 'New maintenance request filed',
    description: 'Rohan Mehta reported swollen battery issue on Dell Latitude 7420 (AF-0106).',
    timestamp: '2026-07-11T11:00:00',
    isUnread: true,
    tag: 'Maintenance'
  },
  {
    id: 'NT-10',
    type: 'booking',
    title: 'Resource reservation confirmed',
    description: 'IT Lab Testing Bench A successfully booked for Karan Malhotra on 2026-07-13.',
    timestamp: '2026-07-11T09:12:00',
    isUnread: false,
    tag: 'Bookings'
  },
  {
    id: 'NT-11',
    type: 'transfer',
    title: 'Asset transfer completed',
    description: 'Transfer TR-101 (Apple MacBook Pro) from Sneha Patil to Amit Sharma was fully verified.',
    timestamp: '2026-07-10T17:35:00',
    isUnread: false,
    tag: 'Transfers'
  },
  {
    id: 'NT-12',
    type: 'overdue',
    title: 'Return Warning: Upcoming deadline',
    description: 'Lenovo ThinkPad P16 assigned to Amit Sharma is due for audit review tomorrow.',
    timestamp: '2026-07-10T15:00:00',
    isUnread: false,
    tag: 'Overdue'
  },
  {
    id: 'NT-13',
    type: 'system',
    title: 'Maintenance database reindexed',
    description: 'Scheduled index operations successfully executed during midnight window.',
    timestamp: '2026-07-10T01:30:00',
    isUnread: false,
    tag: 'System Update'
  },
  {
    id: 'NT-14',
    type: 'security',
    title: 'Password change alert',
    description: 'Your user account password was updated 3 days ago. No action required if this was you.',
    timestamp: '2026-07-09T18:40:00',
    isUnread: false,
    tag: 'Security Alert'
  },
  {
    id: 'NT-15',
    type: 'report',
    title: 'Audit Cycle Q2 results ready',
    description: 'Physical audit report compiled with 98.2% assets successfully accounted for.',
    timestamp: '2026-07-09T11:20:00',
    isUnread: false,
    tag: 'View Report'
  },
  {
    id: 'NT-16',
    type: 'maintenance',
    title: 'Ticket MT-203 Resolved',
    description: 'Lenovo ThinkPad thermal paste re-application is complete and verified.',
    timestamp: '2026-07-08T16:00:00',
    isUnread: false,
    tag: 'Maintenance'
  },
  {
    id: 'NT-17',
    type: 'booking',
    title: 'Meeting Room Cosmos cancelled',
    description: 'Priya Nair cancelled reservation for Room Cosmos due to schedule changes.',
    timestamp: '2026-07-08T10:00:00',
    isUnread: false,
    tag: 'Bookings'
  },
  {
    id: 'NT-18',
    type: 'transfer',
    title: 'Warehouse Allocation complete',
    description: 'Logitech Mouse (AF-0109) has been checked out of inventory.',
    timestamp: '2026-07-08T09:15:00',
    isUnread: false,
    tag: 'Transfers'
  },
  {
    id: 'NT-19',
    type: 'security',
    title: 'API key generated',
    description: 'New service account token created by Arun Kumar for reporting integration.',
    timestamp: '2026-07-07T14:12:00',
    isUnread: false,
    tag: 'Security Alert'
  },
  {
    id: 'NT-20',
    type: 'asset',
    title: 'Asset condition updated',
    description: 'Sony Headphones (AF-0111) condition adjusted to Poor based on audio diagnostic.',
    timestamp: '2026-07-07T11:30:00',
    isUnread: false,
    tag: 'Asset Added'
  },
  {
    id: 'NT-21',
    type: 'overdue',
    title: 'Overdue Audit Notice',
    description: 'Asset AF-0104 has remained in Missing status for over 7 business days.',
    timestamp: '2026-07-06T09:00:00',
    isUnread: false,
    tag: 'Overdue'
  },
  {
    id: 'NT-22',
    type: 'maintenance',
    title: 'Ticket MT-204 Rejected',
    description: 'Liquid spill cleaning ticket for HP EliteBook rejected - device is out of warranty.',
    timestamp: '2026-07-05T15:20:00',
    isUnread: false,
    tag: 'Maintenance'
  },
  {
    id: 'NT-23',
    type: 'report',
    title: 'Disposal audit log compiled',
    description: 'Epson Printer disposal documentation signed off and added to file.',
    timestamp: '2026-07-04T12:00:00',
    isUnread: false,
    tag: 'View Report'
  },
  {
    id: 'NT-24',
    type: 'system',
    title: 'Service Pack installed',
    description: 'AssetFlow v2.4.1 platform patch deployed successfully to staging environment.',
    timestamp: '2026-07-04T00:10:00',
    isUnread: false,
    tag: 'System Update'
  },
  {
    id: 'NT-25',
    type: 'booking',
    title: 'Weekly Standup room reservation',
    description: 'Room Nebula booked for Design team recurring session on Mondays.',
    timestamp: '2026-07-03T17:00:00',
    isUnread: false,
    tag: 'Bookings'
  },
  {
    id: 'NT-26',
    type: 'transfer',
    title: 'Transfer request rejected',
    description: 'Transfer request for Cisco Switch rejected by IT Security Officer.',
    timestamp: '2026-07-03T11:45:00',
    isUnread: false,
    tag: 'Transfers'
  },
  {
    id: 'NT-27',
    type: 'security',
    title: 'Session timeout configuration updated',
    description: 'Admin Arun Kumar updated the default login idle session length to 30 mins.',
    timestamp: '2026-07-02T16:30:00',
    isUnread: false,
    tag: 'Security Alert'
  },
  {
    id: 'NT-28',
    type: 'asset',
    title: 'Asset written off',
    description: 'HP Chromebook old developer test kit has been decommissioned and written off.',
    timestamp: '2026-07-02T14:20:00',
    isUnread: false,
    tag: 'Asset Decom'
  },
  {
    id: 'NT-29',
    type: 'overdue',
    title: 'Asset audit scheduled',
    description: 'Physical audit for Bangalore Storage HQ is scheduled for next Monday.',
    timestamp: '2026-07-01T09:00:00',
    isUnread: false,
    tag: 'Overdue'
  },
  {
    id: 'NT-30',
    type: 'maintenance',
    title: 'Preventive service warning',
    description: 'Server room HVAC filter replacement service is due in 3 business days.',
    timestamp: '2026-06-30T10:00:00',
    isUnread: false,
    tag: 'Maintenance'
  },
  {
    id: 'NT-31',
    type: 'booking',
    title: 'Boardroom reserve confirmation',
    description: 'Boardroom booked for AGM presentation on 2026-07-20.',
    timestamp: '2026-06-29T16:00:00',
    isUnread: false,
    tag: 'Bookings'
  },
  {
    id: 'NT-32',
    type: 'transfer',
    title: 'Transfer approval requested',
    description: 'TR-101 has been initiated and requires authorization from Dept head.',
    timestamp: '2026-06-29T09:30:00',
    isUnread: false,
    tag: 'Transfers'
  },
  {
    id: 'NT-33',
    type: 'system',
    title: 'Billing subscription renewed',
    description: 'Annual enterprise license for AssetFlow premium cloud module renewed.',
    timestamp: '2026-06-28T08:00:00',
    isUnread: false,
    tag: 'System Update'
  },
  {
    id: 'NT-34',
    type: 'security',
    title: 'Two-Factor Auth forced',
    description: 'Mandatory active sessions have been migrated to 2FA for all HR role users.',
    timestamp: '2026-06-27T11:00:00',
    isUnread: false,
    tag: 'Security Alert'
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-07-12T11:14:20',
    user: 'Arun Kumar',
    action: 'Approved maintenance ticket MT-201',
    status: 'Success',
    ipAddress: '192.168.1.150'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-07-12T10:45:11',
    user: 'Arun Kumar',
    action: 'Added new asset AF-0110 (Cisco Meraki AP)',
    status: 'Success',
    ipAddress: '192.168.1.150'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-07-12T09:30:05',
    user: 'Arun Kumar',
    action: 'Marked notification NT-02 as read',
    status: 'Success',
    ipAddress: '192.168.1.150'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-07-11T16:15:22',
    user: 'Karan Malhotra',
    action: 'Attempted to delete asset records from AF-0103',
    status: 'Failed',
    ipAddress: '192.168.1.182'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-07-11T11:30:44',
    user: 'Arun Kumar',
    action: 'Changed audit status of AF-0106 to Damaged',
    status: 'Success',
    ipAddress: '192.168.1.150'
  },
  {
    id: 'LOG-006',
    timestamp: '2026-07-10T14:22:10',
    user: 'Amit Sharma',
    action: 'Created meeting room Cosmos booking',
    status: 'Success',
    ipAddress: '192.168.2.14'
  },
  {
    id: 'LOG-007',
    timestamp: '2026-07-09T09:00:00',
    user: 'System Admin',
    action: 'Nightly automated inventory audit sync',
    status: 'Success',
    ipAddress: '127.0.0.1'
  }
];

export const initialMails: MailMessage[] = [
  {
    id: 'ML-01',
    senderName: 'Sneha Patil',
    senderRole: 'Lead UX Designer',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    subject: 'Request for secondary display setup',
    body: 'Hi Arun,\n\nI need a secondary monitor for the new design project. My 16" MBP is great, but multi-window UX work really requires a secondary 27" or 32" display. I see the Dell UltraSharp (AF-0103) is currently listed under my name, but I wanted to request another one for our desk in Block B.\n\nPlease let me know if we have any spare monitors available in Bangalore Storage B!\n\nBest regards,\nSneha',
    timestamp: '2026-07-12T10:14:00',
    isUnread: true
  },
  {
    id: 'ML-02',
    senderName: 'Amit Sharma',
    senderRole: 'Senior Backend Engineer',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    subject: 'Lenovo keyboard key replacement under warranty',
    body: 'Hello Arun,\n\nThe Keychron K8 Keyboard that was assigned to me is working perfectly, but the ThinkPad P16 keyboard seems to have a sticky Enter key. I am submitting this mail to ask if we should do a warranty swap or if you want me to raise a maintenance ticket for a physical diagnostic first?\n\nThanks,\nAmit',
    timestamp: '2026-07-12T08:30:00',
    isUnread: true
  },
  {
    id: 'ML-03',
    senderName: 'Karan Malhotra',
    senderRole: 'IT Support Engineer',
    senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    subject: 'Server Room 1 Rack cleanup completed',
    body: 'Hi Arun,\n\nI finished the physical cable tracing and organization for Rack B in Server Room 1. We discovered that three old Cisco switches are completely disconnected but still sitting on the shelves. I have labeled them for decommissioning.\n\nI will create the asset write-off list in AssetFlow soon, please look out for approval requests.\n\nRegards,\nKaran',
    timestamp: '2026-07-11T15:45:00',
    isUnread: false
  },
  {
    id: 'ML-04',
    senderName: 'Priya Nair',
    senderRole: 'HR Specialist',
    senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    subject: 'Onboarding assets for 3 new engineers',
    body: 'Hey Arun,\n\nWe have three new senior developers joining the Mumbai Office next month. They will need full setup workstations (MacBook Pro 14", high-quality mouse, and monitors).\n\nCould you check if we have enough available inventory, or if we need to purchase new laptops before August 1st?\n\nThanks for your help,\nPriya',
    timestamp: '2026-07-10T11:20:00',
    isUnread: false
  }
];

export const defaultSettings: AppSettings = {
  profile: {
    name: 'Arun Kumar',
    role: 'Asset Manager',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  security: {
    loginAlerts: true,
    sessionTimeout: 30
  },
  notifications: {
    email: true,
    browser: false,
    overdueAlerts: true,
    maintenanceAlerts: true,
    bookingConfirmations: true
  },
  preferences: {
    defaultDashboard: 'all',
    itemsPerPage: 10,
    fontSize: 'Medium',
    compactMode: false,
    primaryColor: '#2563eb', // blue-600
    autoRefresh: true
  },
  system: {
    assetIdPrefix: 'AF-',
    exportFormat: 'PDF',
    maintainLogs: true
  }
};
