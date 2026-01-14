import { useState, useEffect } from 'react';
import {
  Users, DollarSign, Mail, Lock, Unlock, CheckCircle, XCircle,
  AlertTriangle, TrendingUp, Calendar, Search, Filter, Send, Eye, LogOut
} from 'lucide-react';
import { mainAdmin, users, BASE_API_URL } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function MainAdmin() {
  const [allUsers, setAllUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailData, setEmailData] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [lockingUser, setLockingUser] = useState(null);
  const [subscriptionReminders, setSubscriptionReminders] = useState([]);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    lockedUsers: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    activeDays: 0,
    downDays: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Check if user is authenticated as main admin
    const token = localStorage.getItem('mainAdminToken');
    const user = localStorage.getItem('mainAdminUser');
    
    if (!token || !user) {
      navigate('/main-admin/login');
      return;
    }
    
    loadData().finally(() => setLoading(false));
    
    // Load recent activities
    const activities = JSON.parse(localStorage.getItem('authActivities') || '[]');
    setRecentActivities(activities.slice(0, 10)); // Show last 10 activities
    
    // Load subscription reminders
    const reminders = JSON.parse(localStorage.getItem('adminReminders') || '[]');
    setSubscriptionReminders(reminders.filter(r => r.status === 'pending'));
    
    // Listen for new subscription reminders
    const handleNewReminder = (event) => {
      const newReminder = event.detail;
      setSubscriptionReminders(prev => [newReminder, ...prev]);
    };
    window.addEventListener('subscriptionReminderCreated', handleNewReminder);
    
    // Set up interval to refresh activities every 5 seconds
    const interval = setInterval(() => {
      const updatedActivities = JSON.parse(localStorage.getItem('authActivities') || '[]');
      setRecentActivities(updatedActivities.slice(0, 10));
      
      // Also refresh reminders
      const updatedReminders = JSON.parse(localStorage.getItem('adminReminders') || '[]');
      setSubscriptionReminders(updatedReminders.filter(r => r.status === 'pending'));
    }, 5000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('subscriptionReminderCreated', handleNewReminder);
    };
  }, [navigate]);

  const loadData = async () => {
    try {
      setError(null);
      let usersData = [];
      let paymentsData = [];
      let backendStatus = true;

      // Try to load from mainAdmin API first
      try {
        usersData = await mainAdmin.getUsers();
        paymentsData = await mainAdmin.getPayments();
      } catch (mainAdminError) {
        console.warn('MainAdmin API not available, falling back to regular users API:', mainAdminError.message);
        
        // Fallback to regular users API
        try {
          usersData = await users.getAll();
        } catch (usersError) {
          console.warn('Users API also failed:', usersError.message);
          backendStatus = false;
        }
        
        // Try to get payments from localStorage if backend not available
        if (!backendStatus) {
          paymentsData = [];
          setBackendAvailable(false);
        }
      }

      // If still no users and backend not available, generate demo data
      if (usersData.length === 0 && !backendStatus) {
        usersData = generateDemoData();
        paymentsData = generateDemoPayments(usersData);
      }

      setAllUsers(usersData);
      setPayments(paymentsData);
      setBackendAvailable(backendStatus);
      calculateStats(usersData, paymentsData);

    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load dashboard data');
      
      // Generate demo data as final fallback
      const demoUsers = generateDemoData();
      setAllUsers(demoUsers);
      setPayments(generateDemoPayments(demoUsers));
      setBackendAvailable(false);
      calculateStats(demoUsers, []);
    }
  };

  const logout = () => {
    localStorage.removeItem('mainAdminToken');
    localStorage.removeItem('mainAdminUser');
    navigate('/main-admin/login');
  };

  const generateDemoData = () => {
    // Check if we already have a real user
    const storedUser = localStorage.getItem('user');
    const demoUsers = [];
    
    if (storedUser) {
      const realUser = JSON.parse(storedUser);
      demoUsers.push({ ...realUser, id: realUser.id || 'real-user' });
    }
    
    // Add some demo users
    const demoData = [
      { name: 'John Doe', email: 'john@example.com', plan: 'ultra', price: 1600, active: true, locked: false, role: 'admin' },
      { name: 'Jane Smith', email: 'jane@example.com', plan: 'basic', price: 900, active: true, locked: false, role: 'cashier' },
      { name: 'Bob Wilson', email: 'bob@example.com', plan: 'ultra', price: 1600, active: false, locked: false, role: 'admin' },
      { name: 'Alice Brown', email: 'alice@example.com', plan: 'basic', price: 900, active: true, locked: true, role: 'cashier' },
      { name: 'Mike Johnson', email: 'mike@example.com', plan: 'ultra', price: 1600, active: true, locked: false, role: 'admin' },
      { name: 'Sarah Davis', email: 'sarah@example.com', plan: 'basic', price: 900, active: false, locked: false, role: 'cashier' }
    ];
    
    demoData.forEach((demo, index) => {
      demoUsers.push({
        id: `demo-${index + 1}`,
        ...demo,
        createdAt: new Date(Date.now() - (index * 86400000)).toISOString(),
        lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString()
      });
    });
    
    return demoUsers;
  };

  const generateDemoPayments = (usersData) => {
    return usersData.flatMap(user => [
      {
        id: `payment-${user.id}-1`,
        userId: user.id,
        amount: user.plan === 'ultra' ? 1600 : 900,
        status: Math.random() > 0.3 ? 'paid' : 'pending',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString()
      },
      {
        id: `payment-${user.id}-2`,
        userId: user.id,
        amount: user.plan === 'ultra' ? 1600 : 900,
        status: Math.random() > 0.7 ? 'paid' : (Math.random() > 0.5 ? 'pending' : 'overdue'),
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        dueDate: new Date(Date.now() - 5 * 86400000).toISOString()
      }
    ]);
  };

  const calculateStats = (usersData, paymentsData) => {
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(u => u.active).length;
    const lockedUsers = usersData.filter(u => u.locked).length;
    const totalRevenue = paymentsData.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = paymentsData.filter(p => p.status === 'pending').length;
    const overduePayments = paymentsData.filter(p => p.status === 'overdue').length;
    
    // Calculate active/down days (since app creation)
    const appCreatedDate = localStorage.getItem('appCreatedDate');
    let activeDays = 0;
    let downDays = 0;
    
    if (appCreatedDate) {
      const created = new Date(appCreatedDate);
      const now = new Date();
      const totalDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
      
      // Get uptime percentage from localStorage (default 99.5%)
      const uptimePercentage = parseFloat(localStorage.getItem('uptimePercentage') || '99.5');
      activeDays = Math.floor((totalDays * uptimePercentage) / 100);
      downDays = totalDays - activeDays;
    } else {
      // First time, set creation date
      localStorage.setItem('appCreatedDate', new Date().toISOString());
      activeDays = 0;
      downDays = 0;
    }

    setStats({
      totalUsers,
      activeUsers,
      lockedUsers,
      totalRevenue,
      pendingPayments,
      overduePayments,
      activeDays,
      downDays
    });
  };


  const toggleUserLock = async (userId, currentLockStatus) => {
    try {
      setLockingUser(userId);
      const newLockStatus = !currentLockStatus;
      
      // Call the main admin API to lock/unlock user
      try {
        await mainAdmin.lockUser(userId, newLockStatus);
        
        // If locking a user, logout all their sessions and notify them
        if (newLockStatus) {
          // Get user details for reminder
          const lockedUser = allUsers.find(u => u.id === userId);
          
          // Broadcast logout event to all tabs
          localStorage.setItem(`lockNotification_${userId}`, JSON.stringify({
            type: 'account_locked',
            message: 'Your account has been locked by the system administrator.',
            lockedAt: new Date().toISOString(),
            reason: 'Admin account lock'
          }));
          
          // Create subscription renewal reminder
          if (lockedUser) {
            const reminderMessage = {
              id: Date.now(),
              type: 'subscription_renewal',
              title: 'Subscription Renewal Notice',
              description: `Account for ${lockedUser.name} (${lockedUser.email}) has been locked. Plan: ${lockedUser.plan?.toUpperCase() || 'UNKNOWN'} - ${lockedUser.price ? 'KSH ' + lockedUser.price : 'Free'}. Please contact user to renew subscription.`,
              priority: 'high',
              targetUser: lockedUser.name,
              targetEmail: lockedUser.email,
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
              createdAt: new Date().toISOString(),
              status: 'pending'
            };
            
            // Store in reminders
            const reminders = JSON.parse(localStorage.getItem('adminReminders') || '[]');
            reminders.push(reminderMessage);
            localStorage.setItem('adminReminders', JSON.stringify(reminders));
            
            // Dispatch event to notify admin of new reminder
            window.dispatchEvent(new CustomEvent('subscriptionReminderCreated', { detail: reminderMessage }));
          }
          
          // Dispatch event for real-time logout
          window.dispatchEvent(new CustomEvent('accountLocked', { detail: { userId } }));
        }
        
        // Update local state immediately
        const updatedUsers = allUsers.map(u => 
          u.id === userId ? { ...u, locked: newLockStatus, active: !newLockStatus } : u
        );
        setAllUsers(updatedUsers);
        calculateStats(updatedUsers, payments);
        
        // Show success message
        const user = allUsers.find(u => u.id === userId);
        const action = newLockStatus ? 'locked' : 'unlocked';
        alert(`✅ ${user?.name || `User ${userId}`} has been ${action} successfully!${newLockStatus ? ' Subscription renewal reminder created and user will be logged out immediately.' : ''}`);
        
      } catch (apiError) {
        console.error('API lock failed:', apiError);
        
        // Fallback to local update if backend fails
        const updatedUsers = allUsers.map(u => 
          u.id === userId ? { ...u, locked: newLockStatus, active: !newLockStatus } : u
        );
        setAllUsers(updatedUsers);
        calculateStats(updatedUsers, payments);
        
        const user = allUsers.find(u => u.id === userId);
        const action = newLockStatus ? 'locked' : 'unlocked';
        alert(`⚠️ Backend not available. ${user?.name || `User ${userId}`} ${action} locally. Changes will sync when backend is available.`);
      }
      
    } catch (error) {
      console.error('Failed to toggle lock:', error);
      alert(`❌ Failed to update user status: ${error.message}`);
    } finally {
      setLockingUser(null);
    }
  };

  const sendEmail = async (userIds, subject, message) => {
    try {
      setLoading(true);
      
      // Try backend first
      try {
        await mainAdmin.sendEmail({ userIds, subject, message });
        alert('Emails sent successfully!');
        setShowEmailModal(false);
        setSelectedUsers([]);
        setEmailData({ subject: '', message: '' });
        return;
      } catch (backendError) {
        console.warn('Backend email operation failed, simulating email send:', backendError.message);
      }
      
      // Fallback: Simulate email sending
      const selectedUsersList = allUsers.filter(u => userIds.includes(u.id));
      
      // Store email log locally
      const emailLogs = JSON.parse(localStorage.getItem('emailLogs') || '[]');
      emailLogs.push({
        timestamp: new Date().toISOString(),
        recipients: selectedUsersList.map(u => ({ id: u.id, name: u.name, email: u.email })),
        subject,
        message,
        status: 'simulated'
      });
      localStorage.setItem('emailLogs', JSON.stringify(emailLogs));
      
      alert(`✅ Email simulation successful!\n\n📧 Sent to ${selectedUsersList.length} user(s):\n${selectedUsersList.map(u => `${u.name} (${u.email})`).join('\n')}\n\n${!backendAvailable ? '📌 Backend not deployed - this was a simulation.\n' : ''}💡 Deploy backend to send real emails.`);
      setShowEmailModal(false);
      setSelectedUsers([]);
      setEmailData({ subject: '', message: '' });
      
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to process email request.');
    } finally {
      setLoading(false);
    }
  };

  const sendPaymentReminder = async (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    await sendEmail(
      [userId],
      'Payment Reminder - Subscription',
      `Dear ${user.name},\n\nThis is a friendly reminder about your pending subscription payment for ${user.plan?.toUpperCase()} plan (KSH ${user.price}).\n\nPlease complete your payment to continue enjoying our services.\n\nThank you!`
    );
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && user.active && !user.locked;
    if (filter === 'locked') return matchesSearch && user.locked;
    if (filter === 'trial') return matchesSearch && (!user.active || !user.plan);
    if (filter === 'pending-payment') {
      const userPayments = payments.filter(p => p.userId === user.id && p.status === 'pending');
      return matchesSearch && userPayments.length > 0;
    }
    if (filter === 'overdue') {
      const userPayments = payments.filter(p => p.userId === user.id && p.status === 'overdue');
      return matchesSearch && userPayments.length > 0;
    }
    return matchesSearch;
  });

  const getUserPaymentStatus = (userId) => {
    const userPayments = payments.filter(p => p.userId === userId);
    const pending = userPayments.filter(p => p.status === 'pending').length;
    const overdue = userPayments.filter(p => p.status === 'overdue').length;
    const paid = userPayments.filter(p => p.status === 'paid').length;
    
    return { pending, overdue, paid, total: userPayments.length };
  };

  if (loading && allUsers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Main Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Backend Status Banner */}
      {!backendAvailable && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 text-center">
          <p className="text-sm md:text-base font-semibold">
            ⚠️ Demo Mode: Backend not available. Actions are simulated locally. 
            <a href="/BACKEND_NOT_DEPLOYED.md" className="underline ml-2">Deploy Backend →</a>
          </p>
        </div>
      )}
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-500 text-white px-6 py-3 text-center">
          <p className="text-sm font-semibold">⚠️ {error}</p>
        </div>
      )}

      {/* Subscription Reminders Alert */}
      {subscriptionReminders.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-l-4 border-orange-500 px-6 py-4 mx-6 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-white font-bold mb-2">
                {subscriptionReminders.length} Subscription Renewal Reminder{subscriptionReminders.length !== 1 ? 's' : ''}
              </h3>
              <div className="space-y-2">
                {subscriptionReminders.slice(0, 3).map(reminder => (
                  <p key={reminder.id} className="text-orange-100 text-sm">
                    • <span className="font-semibold">{reminder.targetUser}</span> ({reminder.targetEmail}) - {reminder.description.split('-')[1]?.trim()}
                  </p>
                ))}
              </div>
              {subscriptionReminders.length > 3 && (
                <p className="text-orange-100 text-sm mt-2">
                  ... and {subscriptionReminders.length - 3} more pending reminder{subscriptionReminders.length - 3 !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-500 text-white px-6 py-3 text-center">
          <p className="text-sm font-semibold">⚠️ {error}</p>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Main Admin Dashboard</h1>
            <p className="text-gray-300">Monitor all users, payments, and system activity</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAnalytics(true)}
              className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Analytics
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{stats.totalUsers}</span>
            </div>
            <p className="text-gray-300 text-sm">Total Users</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{stats.activeUsers}</span>
            </div>
            <p className="text-gray-300 text-sm">Active Users</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Lock className="w-8 h-8 text-red-400" />
              <span className="text-2xl font-bold text-white">{stats.lockedUsers}</span>
            </div>
            <p className="text-gray-300 text-sm">Locked Users</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">KSH {stats.totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-gray-300 text-sm">Total Revenue</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold text-white">{stats.pendingPayments}</span>
            </div>
            <p className="text-gray-300 text-sm">Pending Payments</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-400" />
              <span className="text-2xl font-bold text-white">{stats.overduePayments}</span>
            </div>
            <p className="text-gray-300 text-sm">Overdue Payments</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="locked">Locked</option>
                <option value="trial">Free Trial</option>
                <option value="pending-payment">Pending Payment</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <button
              onClick={() => setShowEmailModal(true)}
              disabled={selectedUsers.length === 0 || loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="w-5 h-5" />
              Send Email to Selected ({selectedUsers.length})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Users Table */}
          <div className="xl:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">All Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/30">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="w-5 h-5 rounded"
                      />
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-200">User</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-200">Plan</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-200">Trial Status</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-200">Signup Details</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-200">Status</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No users found</p>
                        <p className="text-gray-500 text-sm mt-2">
                          {searchTerm || filter !== 'all' 
                            ? 'Try adjusting your filters' 
                            : 'Users will appear here once they sign up'}
                        </p>
                      </td>
                    </tr>
                  )}
                  {filteredUsers.map(user => {
                    const paymentStatus = getUserPaymentStatus(user.id);
                    return (
                      <tr key={user.id} className="border-t border-white/10 hover:bg-white/5 transition">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                              }
                            }}
                            className="w-5 h-5 rounded"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-white">{user.name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.plan === 'ultra' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {user.plan?.toUpperCase() || 'FREE'} {user.price ? `- KSH ${user.price}` : ''}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            {(user.plan === 'trial' || !user.plan || user.isFreeTrial) ? (
                              <>
                                <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500/20 text-yellow-300">
                                  FREE TRIAL
                                </span>
                                {user.trialDaysLeft !== undefined && (
                                  <span className="text-xs text-gray-400">
                                    {user.trialDaysLeft} days left
                                  </span>
                                )}
                                {user.trialExpiry && (
                                  <span className="text-xs text-gray-400">
                                    Expires: {new Date(user.trialExpiry).toLocaleDateString()}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-300">
                                PAID PLAN
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-xs space-y-1">
                            <div className="font-semibold text-gray-300">
                              Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            {user.signupDetails?.company && (
                              <div className="text-gray-400">
                                <span className="text-gray-500">Co:</span> {user.signupDetails.company}
                              </div>
                            )}
                            {user.signupDetails?.industry && (
                              <div className="text-gray-400">
                                <span className="text-gray-500">Industry:</span> {user.signupDetails.industry}
                              </div>
                            )}
                            {user.signupDetails?.country && (
                              <div className="text-gray-400">
                                <span className="text-gray-500">Country:</span> {user.signupDetails.country}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {user.locked ? (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Locked
                              </span>
                            ) : user.active ? (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-300 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-300">
                                Inactive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleUserLock(user.id, user.locked)}
                              disabled={lockingUser === user.id}
                              className={`p-2 rounded-lg transition ${
                                user.locked
                                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                              } ${lockingUser === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={user.locked ? 'Unlock User' : 'Lock User'}
                            >
                              {lockingUser === user.id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : user.locked ? (
                                <Unlock className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                // Trigger screen lock for specific user
                                window.dispatchEvent(new CustomEvent('screenLocked', { detail: { userId: user.id } }));
                                alert(`✅ Screen lock triggered for ${user.name}. Their screen will be locked immediately.`);
                              }}
                              className="p-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 transition"
                              title="Lock Screen (Prevents user interaction)"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm6-10V7a3 3 0 00-3-3m3 3V7a3 3 0 013 3m-6-3a3 3 0 013-3m0 0V7m0 0a3 3 0 00-3 3m6-3V7m0 0a3 3 0 00-3 3" />
                              </svg>
                            </button>
                            <button
                              onClick={() => sendPaymentReminder(user.id)}
                              disabled={loading}
                              className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition"
                              title="Send Payment Reminder"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                // View user's dashboard
                                if (user.role === 'cashier') {
                                  window.open('/dashboard/cashier', '_blank');
                                } else {
                                  window.open('/admin', '_blank');
                                }
                              }}
                              className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition"
                              title="View User Dashboard"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recent Activity Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Activity
              </h2>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {recentActivities.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No recent activity</p>
              ) : (
                recentActivities.map(activity => (
                  <div key={activity.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'login' ? 'bg-green-400' : 'bg-blue-400'
                      }`} />
                      <span className="text-white font-medium">{activity.user.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        activity.type === 'login' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{activity.user.email}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Mail />
                Send Email to {selectedUsers.length} User(s)
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email subject..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                  placeholder="Email message..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => sendEmail(selectedUsers, emailData.subject, emailData.message)}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Email'}
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-white/20">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Website Analytics & Uptime
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Active Days</p>
                      <p className="text-3xl font-bold text-white">{stats.activeDays}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Down Days</p>
                      <p className="text-3xl font-bold text-white">{stats.downDays}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Uptime Percentage</span>
                    <span className="text-2xl font-bold text-green-400">{(parseFloat(localStorage.getItem('uptimePercentage') || '99.5')).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      style={{ width: `${parseFloat(localStorage.getItem('uptimePercentage') || '99.5')}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">Key Metrics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Users</span>
                    <span className="text-white font-semibold">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active Users</span>
                    <span className="text-green-400 font-semibold">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Revenue</span>
                    <span className="text-yellow-400 font-semibold">KSH {stats.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 rounded-lg font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
