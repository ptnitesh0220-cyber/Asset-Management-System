import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import OrganizationView from './components/OrganizationView';
import AssetsView from './components/AssetsView';
import AllocationView from './components/AllocationView';
import BookingView from './components/BookingView';
import MaintenanceView from './components/MaintenanceView';
import AuditView from './components/AuditView';
import ReportsView from './components/ReportsView';
import NotificationsView from './components/NotificationsView';
import LogsView from './components/LogsView';
import MailView from './components/MailView';
import SettingsView from './components/SettingsView';

import {
  Asset,
  Employee,
  TransferRequest,
  Booking,
  MaintenanceTicket,
  AuditItem,
  AppNotification,
  ActivityLog,
  MailMessage,
  AppSettings,
  ActiveSection
} from './types';

import { defaultSettings } from './mockData';

// Firestore collection names. Each document id matches the entity's own
// `id` field so that relational references (assetId, assignedToId, etc.)
// keep working exactly like they did with the in-memory mock data.
// Every collection lives under `users/{uid}/...` so each signed-in account
// only ever sees and writes its own private data.
type CollectionName =
  | 'assets'
  | 'employees'
  | 'transferRequests'
  | 'bookings'
  | 'maintenanceTickets'
  | 'auditItems'
  | 'notifications'
  | 'activityLogs'
  | 'mails';

export default function App() {
  // Session State - driven by real Firebase Authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Per-user Firestore path helpers. Every read/write is scoped under
  // `users/{uid}/...` so different accounts never see each other's data.
  const userCollection = (name: CollectionName) => collection(db, 'users', uid as string, name);
  const userDoc = (name: CollectionName, id: string) => doc(db, 'users', uid as string, name, id);
  const userSettingsDoc = () => doc(db, 'users', uid as string, 'meta', 'settings');

  // Domain Database states - now populated live from Firestore.
  // They start empty (no dummy data) and fill in as soon as the
  // Firestore listeners return real documents from your database.
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>([]);
  const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [mails, setMails] = useState<MailMessage[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Deep interaction helpers
  const [openModalOnNav, setOpenModalOnNav] = useState<boolean>(false);

  // ---------------------------------------------------------------------
  // Track real Firebase Auth session state.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsLoggedIn(!!user);
      setUid(user ? user.uid : null);
      setAuthChecked(true);

      // Clear out any previously loaded data immediately on sign-out /
      // account switch, so a new account never briefly sees stale data
      // from the previous session before its own listeners attach.
      if (!user) {
        setAssets([]);
        setEmployees([]);
        setTransferRequests([]);
        setBookings([]);
        setMaintenanceTickets([]);
        setAuditItems([]);
        setNotifications([]);
        setActivityLogs([]);
        setMails([]);
        setSettings(defaultSettings);
      }
    });
    return () => unsubscribe();
  }, []);

  // ---------------------------------------------------------------------
  // Live Firestore subscriptions. Each one keeps local state in sync with
  // your Firestore database in real time (no dummy/mock data is loaded).
  // Scoped to the current user's uid so each account has its own data.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!isLoggedIn || !uid) return;

    const unsubscribers = [
      onSnapshot(userCollection('assets'), snap =>
        setAssets(snap.docs.map(d => d.data() as Asset))
      ),
      onSnapshot(userCollection('employees'), snap =>
        setEmployees(snap.docs.map(d => d.data() as Employee))
      ),
      onSnapshot(userCollection('transferRequests'), snap =>
        setTransferRequests(snap.docs.map(d => d.data() as TransferRequest))
      ),
      onSnapshot(userCollection('bookings'), snap =>
        setBookings(snap.docs.map(d => d.data() as Booking))
      ),
      onSnapshot(userCollection('maintenanceTickets'), snap =>
        setMaintenanceTickets(snap.docs.map(d => d.data() as MaintenanceTicket))
      ),
      onSnapshot(userCollection('auditItems'), snap =>
        setAuditItems(snap.docs.map(d => d.data() as AuditItem))
      ),
      onSnapshot(
        query(userCollection('notifications'), orderBy('timestamp', 'desc')),
        snap => setNotifications(snap.docs.map(d => d.data() as AppNotification))
      ),
      onSnapshot(
        query(userCollection('activityLogs'), orderBy('timestamp', 'desc')),
        snap => setActivityLogs(snap.docs.map(d => d.data() as ActivityLog))
      ),
      onSnapshot(
        query(userCollection('mails'), orderBy('timestamp', 'desc')),
        snap => setMails(snap.docs.map(d => d.data() as MailMessage))
      ),
      onSnapshot(userSettingsDoc(), snap => {
        if (snap.exists()) {
          setSettings(snap.data() as AppSettings);
        }
      }),
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, [isLoggedIn, uid]);

  // Helper: Append Action to Activity Logs
  const logAction = async (action: string, status: 'Success' | 'Failed' = 'Success') => {
    const newLog: ActivityLog = {
      id: `LOG-0${activityLogs.length + 101}`,
      timestamp: new Date().toISOString(),
      user: settings.profile.name,
      action,
      status,
      ipAddress: '192.168.1.150'
    };
    await setDoc(userDoc('activityLogs', newLog.id), newLog);
  };

  // Helper: Create internal system notification
  const createNotification = async (
    type: AppNotification['type'],
    title: string,
    description: string,
    tag?: string
  ) => {
    const newNotif: AppNotification = {
      id: `NT-${notifications.length + 1}`,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
      isUnread: true,
      tag
    };
    await setDoc(userDoc('notifications', newNotif.id), newNotif);
  };

  // Authentication Handlers
  const handleLoginSuccess = () => {
    // isLoggedIn is already driven by onAuthStateChanged; this just records
    // the session for the activity log / notifications feed.
    logAction('Logged into AssetFlow admin console');
    createNotification('security', 'Admin login session authorized', 'Successful sign in from standard workstation.', 'Security Alert');
  };

  const handleLogout = async () => {
    await logAction('Logged out of AssetFlow admin console');
    await signOut(auth);
    setActiveSection('dashboard');
    setSearchQuery('');
  };

  // Quick Action Routing Handler
  const handleQuickAction = (action: 'addAsset' | 'addTransfer' | 'addBooking' | 'addMaintenance') => {
    setOpenModalOnNav(true);
    switch (action) {
      case 'addAsset':
        setActiveSection('assets');
        break;
      case 'addTransfer':
        setActiveSection('allocation');
        break;
      case 'addBooking':
        setActiveSection('booking');
        break;
      case 'addMaintenance':
        setActiveSection('maintenance');
        break;
    }
  };

  // STATEFUL CRUDS: ASSETS
  const handleAddAsset = async (newAsset: Omit<Asset, 'id'>) => {
    const assetId = `${settings.system.assetIdPrefix}0${assets.length + 101}`;
    const created: Asset = { id: assetId, ...newAsset };
    await setDoc(userDoc('assets', created.id), created);
    logAction(`Registered new hardware asset: ${created.name} (${created.id})`);
    createNotification('asset', 'New asset added', `${created.name} (${created.id}) was registered successfully.`, 'Asset Added');

    // If allocated, immediately increment employee asset count representation
    if (newAsset.status === 'Allocated' && newAsset.assignedToId) {
      const emp = employees.find(e => e.id === newAsset.assignedToId);
      if (emp) {
        await updateDoc(userDoc('employees', emp.id), {
          assignedAssets: [...emp.assignedAssets, created.name]
        });
      }
    }
  };

  const handleEditAsset = async (updatedAsset: Asset) => {
    // Resolve previous asset to check for allocation employee shift
    const prevAsset = assets.find(a => a.id === updatedAsset.id);

    await setDoc(userDoc('assets', updatedAsset.id), updatedAsset);
    logAction(`Updated asset inventory: ${updatedAsset.name} (${updatedAsset.id})`);

    // Dynamic relational cross-referencing: Update employee collections
    if (prevAsset) {
      for (const emp of employees) {
        let updatedList = [...emp.assignedAssets];
        let changed = false;

        // Remove from old custodian if changed
        if (prevAsset.status === 'Allocated' && prevAsset.assignedToId === emp.id && updatedAsset.assignedToId !== emp.id) {
          updatedList = updatedList.filter(name => name !== prevAsset.name);
          changed = true;
        }

        // Add to new custodian if newly assigned
        if (updatedAsset.status === 'Allocated' && updatedAsset.assignedToId === emp.id && prevAsset.assignedToId !== emp.id) {
          if (!updatedList.includes(updatedAsset.name)) {
            updatedList.push(updatedAsset.name);
            changed = true;
          }
        }

        if (changed) {
          await updateDoc(userDoc('employees', emp.id), { assignedAssets: updatedList });
        }
      }
    }
  };

  const handleDeleteAsset = async (id: string) => {
    const asset = assets.find(a => a.id === id);
    if (!asset) return;

    await deleteDoc(userDoc('assets', id));
    logAction(`Removed asset from inventory: ${asset.name} (${id})`);

    // Clean up employee list references
    const emp = employees.find(e => e.id === asset.assignedToId);
    if (emp) {
      await updateDoc(userDoc('employees', emp.id), {
        assignedAssets: emp.assignedAssets.filter(name => name !== asset.name)
      });
    }
  };

  // STATEFUL CRUDS: EMPLOYEES
  const handleAddEmployee = async (newEmp: Omit<Employee, 'id'>) => {
    const empId = `EMP-0${employees.length + 1}`;
    const created: Employee = { id: empId, ...newEmp };
    await setDoc(userDoc('employees', created.id), created);
    logAction(`Added team member profile: ${created.name} (${created.id})`);
  };

  const handleEditEmployee = async (updatedEmp: Employee) => {
    await setDoc(userDoc('employees', updatedEmp.id), updatedEmp);
    logAction(`Modified employee profile: ${updatedEmp.name} (${updatedEmp.id})`);
  };

  const handleDeleteEmployee = async (id: string) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    await deleteDoc(userDoc('employees', id));
    logAction(`Deleted employee profile: ${emp.name} (${id})`);

    // Release all assets currently assigned to this deleted user
    const assignedAssets = assets.filter(asset => asset.assignedToId === id);
    for (const asset of assignedAssets) {
      await updateDoc(userDoc('assets', asset.id), {
        status: 'Available',
        assignedTo: deleteField(),
        assignedToId: deleteField()
      });
    }
  };

  // TRANSFERS & APPROVAL WORKFLOW
  const handleAddTransfer = async (newReq: Omit<TransferRequest, 'id'>) => {
    const reqId = `TR-${transferRequests.length + 101}`;
    const created: TransferRequest = { id: reqId, ...newReq };
    await setDoc(userDoc('transferRequests', created.id), created);
    logAction(`Initiated asset transfer request TR-${created.id}`);
    createNotification('transfer', 'New transfer requested', `Request filed to transfer ${created.assetName} to ${created.toEmployee}.`, 'Transfers');
  };

  const handleApproveTransfer = async (id: string) => {
    const transfer = transferRequests.find(tr => tr.id === id);
    if (!transfer) return;

    // 1. Set Transfer request to Allocated
    await updateDoc(userDoc('transferRequests', id), { status: 'Allocated' });

    // 2. Resolve target employee for state references
    const targetEmp = employees.find(e => e.name === transfer.toEmployee);

    // 3. Relational action: Statefully update the asset holder and change status to 'Allocated'
    const asset = assets.find(a => a.id === transfer.assetId);
    if (asset) {
      await updateDoc(userDoc('assets', asset.id), {
        status: 'Allocated',
        assignedTo: transfer.toEmployee,
        assignedToId: targetEmp?.id ?? deleteField()
      });
    }

    // 4. Update employee asset lists statefully
    for (const emp of employees) {
      let updatedList = [...emp.assignedAssets];
      let changed = false;

      // Remove from previous holder
      if (emp.name === transfer.fromEmployee) {
        updatedList = updatedList.filter(name => name !== transfer.assetName);
        changed = true;
      }

      // Add to new holder
      if (emp.name === transfer.toEmployee) {
        if (!updatedList.includes(transfer.assetName)) {
          updatedList.push(transfer.assetName);
          changed = true;
        }
      }

      if (changed) {
        await updateDoc(userDoc('employees', emp.id), { assignedAssets: updatedList });
      }
    }

    logAction(`Approved & completed asset transfer ${id} for ${transfer.assetName}`);
    createNotification('transfer', 'Asset transfer approved', `${transfer.assetName} has been reassigned to ${transfer.toEmployee}.`, 'Transfers');
  };

  const handleRejectTransfer = async (id: string) => {
    const transfer = transferRequests.find(tr => tr.id === id);
    if (!transfer) return;

    await deleteDoc(userDoc('transferRequests', id));
    logAction(`Rejected asset transfer request ${id} for ${transfer.assetName}`, 'Failed');
  };

  // BOOKINGS HANDLERS
  const handleAddBooking = async (newBooking: Omit<Booking, 'id'>) => {
    // Date.now() avoids ID collisions that `bookings.length` can produce
    // when local state hasn't re-rendered yet (e.g. rapid submissions,
    // or right after the Firestore listener first attaches).
    const bkId = `BK-${Date.now()}`;
    const created: Booking = { id: bkId, ...newBooking };
    try {
      await setDoc(userDoc('bookings', created.id), created);
      logAction(`Scheduled shared resource reservation: ${created.resourceName}`);
      createNotification('booking', 'Reservation confirmed', `${created.resourceName} booked for ${created.requesterName}.`, 'Bookings');
    } catch (err) {
      // Previously this failure was silent — the modal would close as if
      // it worked, but nothing was ever written to Firestore.
      console.error('Failed to save booking to Firestore:', err);
      logAction(`Failed to schedule reservation: ${created.resourceName}`, 'Failed');
      throw err; // let BookingView know so it can show the user an error
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await updateDoc(userDoc('bookings', id), { status: 'Cancelled' });
      logAction(`Cancelled resource reservation: ${id}`);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      logAction(`Failed to cancel reservation ${id}`, 'Failed');
    }
  };

  // MAINTENANCE HANDLERS
  const handleAddMaintenance = async (newTicket: Omit<MaintenanceTicket, 'id'>) => {
    const ticketId = `MT-${maintenanceTickets.length + 201}`;
    const created: MaintenanceTicket = { id: ticketId, ...newTicket };
    await setDoc(userDoc('maintenanceTickets', created.id), created);
    logAction(`Filed maintenance repair request: ${created.id}`);
    createNotification('maintenance', 'Maintenance request filed', `Ticket filed for ${created.assetName}. Awaiting approval.`, 'Maintenance');
  };

  const handleUpdateTicketStatus = async (id: string, newStatus: MaintenanceTicket['status']) => {
    const ticket = maintenanceTickets.find(t => t.id === id);
    if (!ticket) return;

    // Advance ticket stage state
    await updateDoc(userDoc('maintenanceTickets', id), { status: newStatus });
    logAction(`Advanced maintenance ticket ${id} to ${newStatus}`);

    // Relational updates: modify target asset status based on repair stage
    const asset = assets.find(a => a.id === ticket.assetId);
    if (asset) {
      if (newStatus === 'In Progress') {
        await updateDoc(userDoc('assets', asset.id), { status: 'Under Maintenance' });
      } else if (newStatus === 'Resolved') {
        await updateDoc(userDoc('assets', asset.id), { status: 'Available' }); // Return to storage
      }
    }

    if (newStatus === 'In Progress') {
      createNotification('maintenance', 'Maintenance ticket approved', `Ticket MT-${ticket.id} approved. Repair work started.`, 'Maintenance');
    } else if (newStatus === 'Resolved') {
      createNotification('maintenance', 'Maintenance ticket completed', `Ticket MT-${ticket.id} resolved successfully. Asset available.`, 'Maintenance');
    }
  };

  // AUDIT OPERATIONS
  const handleStartAuditCycle = async () => {
    // Clear any previous audit cycle documents
    const existingSnap = await getDocs(userCollection('auditItems'));
    for (const d of existingSnap.docs) {
      await deleteDoc(d.ref);
    }

    // Generate new scheduled audit items from all active laptops and monitors
    const freshAudits: AuditItem[] = assets.slice(0, 5).map((asset, idx) => ({
      id: `AD-90${idx + 1}`,
      assetId: asset.id,
      assetName: asset.name,
      status: 'Scheduled',
      date: new Date().toISOString().split('T')[0]
    }));

    for (const item of freshAudits) {
      await setDoc(userDoc('auditItems', item.id), item);
    }

    logAction('Initiated a fresh organizational audit cycle');
    createNotification('system', 'Audit Cycle Q3 started', 'Physical assets compliance checklist generated.', 'System Update');
  };

  const handleUpdateAuditItem = async (
    id: string,
    newStatus: AuditItem['status'],
    notes?: string,
    verifiedName?: string
  ) => {
    const auditItem = auditItems.find(a => a.id === id);
    if (!auditItem) return;

    await updateDoc(userDoc('auditItems', id), {
      status: newStatus,
      notes: notes ?? deleteField(),
      verifiedBy: verifiedName || settings.profile.name,
      date: new Date().toISOString().split('T')[0]
    });

    // Update physical asset condition state based on audit discovery
    const asset = assets.find(a => a.id === auditItem.assetId);
    if (asset) {
      let finalStatus = asset.status;
      let finalCondition = asset.condition;

      if (newStatus === 'Damaged') {
        finalCondition = 'Poor';
        finalStatus = 'Under Maintenance';
      } else if (newStatus === 'Missing') {
        finalStatus = 'Retired';
      } else if (newStatus === 'Completed') {
        finalCondition = 'Excellent';
      }

      await updateDoc(userDoc('assets', asset.id), { status: finalStatus, condition: finalCondition });
    }

    logAction(`Verified physical compliance audit for item ${id}: Result ${newStatus}`);
  };

  // NOTIFICATIONS OPERATORS
  const handleMarkAllAsRead = async () => {
    for (const n of notifications.filter(n => n.isUnread)) {
      await updateDoc(userDoc('notifications', n.id), { isUnread: false });
    }
    logAction('Cleared notification inbox (marked all as read)');
  };

  const handleMarkAsRead = async (id: string) => {
    await updateDoc(userDoc('notifications', id), { isUnread: false });
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteDoc(userDoc('notifications', id));
  };

  // MAIL CORRESPONDENCE
  const handleMarkMailAsRead = async (id: string) => {
    await updateDoc(userDoc('mails', id), { isUnread: false });
  };

  const handleSendMail = async (sub: string, bodyText: string, recipient: string) => {
    const newMail: MailMessage = {
      id: `ML-sent-${mails.length + 1}`,
      senderName: settings.profile.name,
      senderRole: settings.profile.role,
      senderAvatar: settings.profile.avatar,
      subject: sub,
      body: bodyText,
      timestamp: new Date().toISOString(),
      isUnread: false
    };

    await setDoc(userDoc('mails', newMail.id), newMail);
    logAction(`Sent internal mail to ${recipient}: ${sub}`);
  };

  // SETTINGS CONFIGURATION SAVES
  const handleSaveSettings = async (updated: AppSettings) => {
    await setDoc(userSettingsDoc(), updated);
    logAction('Updated application settings and workspace preferences');
  };

  // Render Section Selector Routing
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardView
            assets={assets}
            bookings={bookings}
            activityLogs={activityLogs}
            setActiveSection={setActiveSection}
            onQuickAction={handleQuickAction}
          />
        );
      case 'organization':
        return (
          <OrganizationView
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            searchQuery={searchQuery}
          />
        );
      case 'assets':
        return (
          <AssetsView
            assets={assets}
            employees={employees}
            onAddAsset={handleAddAsset}
            onEditAsset={handleEditAsset}
            onDeleteAsset={handleDeleteAsset}
            searchQuery={searchQuery}
            openModalOnMount={openModalOnNav}
            onModalClose={() => setOpenModalOnNav(false)}
          />
        );
      case 'allocation':
        return (
          <AllocationView
            transferRequests={transferRequests}
            assets={assets}
            employees={employees}
            onAddTransfer={handleAddTransfer}
            onApproveTransfer={handleApproveTransfer}
            onRejectTransfer={handleRejectTransfer}
            searchQuery={searchQuery}
            openModalOnMount={openModalOnNav}
            onModalClose={() => setOpenModalOnNav(false)}
          />
        );
      case 'booking':
        return (
          <BookingView
            bookings={bookings}
            onAddBooking={handleAddBooking}
            onCancelBooking={handleCancelBooking}
            searchQuery={searchQuery}
            openModalOnMount={openModalOnNav}
            onModalClose={() => setOpenModalOnNav(false)}
          />
        );
      case 'maintenance':
        return (
          <MaintenanceView
            tickets={maintenanceTickets}
            assets={assets}
            onAddTicket={handleAddMaintenance}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            searchQuery={searchQuery}
            openModalOnMount={openModalOnNav}
            onModalClose={() => setOpenModalOnNav(false)}
          />
        );
      case 'audit':
        return (
          <AuditView
            auditItems={auditItems}
            assets={assets}
            onStartAuditCycle={handleStartAuditCycle}
            onUpdateAuditItem={handleUpdateAuditItem}
            searchQuery={searchQuery}
          />
        );
      case 'reports':
        return (
          <ReportsView
            assets={assets}
            bookings={bookings}
            employees={employees}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onMarkAsRead={handleMarkAsRead}
            onDeleteNotification={handleDeleteNotification}
          />
        );
      case 'logs':
        return (
          <LogsView
            activityLogs={activityLogs}
            searchQuery={searchQuery}
          />
        );
      case 'mail':
        return (
          <MailView
            mails={mails}
            onMarkMailAsRead={handleMarkMailAsRead}
            onSendMail={handleSendMail}
          />
        );
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        );
      default:
        return (
          <div className="text-center p-12 text-white">
            <h2 className="text-lg font-bold">Section Not Found</h2>
            <button onClick={() => setActiveSection('dashboard')} className="mt-4 bg-blue-600 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">
              Go Home
            </button>
          </div>
        );
    }
  };

  // Wait for Firebase Auth to report the initial session state before
  // deciding whether to show the login screen or the app shell.
  if (!authChecked) {
    return (
      <div className="min-h-screen w-full bg-[#0a1122] flex items-center justify-center">
        <span className="h-8 w-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Render Login state vs Shell Frame
  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const unreadNotifCount = notifications.filter(n => n.isUnread).length;
  const unreadMailsCount = mails.filter(m => m.isUnread).length;

  return (
    <div className="flex bg-[#0a1122] min-h-screen text-slate-100 font-sans" id="app-shell-container">
      {/* Sidebar Frame */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        unreadNotificationsCount={unreadNotifCount}
        unreadMailsCount={unreadMailsCount}
        onLogout={handleLogout}
      />

      {/* Main Panel Frame */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar Frame */}
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unreadNotificationsCount={unreadNotifCount}
          unreadMailsCount={unreadMailsCount}
          setActiveSection={setActiveSection}
          profile={settings.profile}
          onLogout={handleLogout}
        />

        {/* Dynamic Page Content Frame (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8" id="app-content-frame">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
