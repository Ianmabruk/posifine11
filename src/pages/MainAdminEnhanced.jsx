import { useState, useEffect } from 'react';
import {
  Users, DollarSign, Mail, Lock, Unlock, CheckCircle, AlertTriangle,
  Calendar, Search, TrendingUp, Clock, XCircle, Send, Eye, LogOut, Zap
} from 'lucide-react';
import { mainAdmin, users, BASE_API_URL } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function MainAdminEnhanced() {
  const [allUsers, setAllUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [lockingUser, setLockingUser] = useState(null);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    freeTrialUsers: 0,
    upgradeExpiredUsers: 0,
    reaching30Days: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    const user = localStorage.getItem('ownerUser');

    if (!token || !user) {
      navigate('/main.admin');
      return;
    }

    loadData().finally(() => setLoading(false));
  }, [navigate]);

  const loadData = async () => {
    try {
      let usersData = [];

      try {
        // Try to get users with subscription data from new backend endpoint
        const token = localStorage.getItem('ownerToken');
        const response = await fetch(`${BASE_API_URL}/api/main-admin/users-with-subscriptions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          usersData = await response.json();
        } else {
          throw new Error('Failed to fetch subscription data');
        }
      } catch (error) {
        console.warn('Subscription API failed, using fallback:', error.message);
        try {
          usersData = await mainAdmin.getUsers();
        } catch (error2) {
          usersData = await users.getAll();
        }
        
        // Enhance users with subscription data (client-side fallback)
        usersData = usersData.map(user => {
          const createdAt = new Date(user.createdAt || Date.now());
          const now = new Date();
          const daysActive = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
          const isFreeTrial = user.plan === 'free' || !user.plan;
          const hasReachedTrialLimit = daysActive >= 30 && isFreeTrial;
          const daysUntilExpiry = Math.max(0, 30 - daysActive);

          return {
            ...user,
            createdAt: createdAt.toISOString(),
            daysActive,
            isFreeTrial,
            hasReachedTrialLimit,
            daysUntilExpiry,
            subscriptionStatus: isFreeTrial ? (hasReachedTrialLimit ? 'trial_expired' : 'free_trial') : 'paid',
            planPrice: user.plan === 'ultra' ? 1600 : (user.plan === 'basic' ? 900 : 0),
            trialExpireDate: new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
        });
      }

      // If we already got enriched data from backend, use it directly
      if (usersData.length > 0 && usersData[0].daysActive !== undefined) {
        setAllUsers(usersData);
        calculateStats(usersData);
      } else {
        // Otherwise enhance on client side
        const enhancedUsers = usersData.map(user => {
          const createdAt = new Date(user.createdAt || Date.now());
          const now = new Date();
          const daysActive = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
          const isFreeTrial = user.plan === 'free' || !user.plan;
          const hasReachedTrialLimit = daysActive >= 30 && isFreeTrial;
          const daysUntilExpiry = Math.max(0, 30 - daysActive);

          return {
            ...user,
            createdAt: createdAt.toISOString(),
            daysActive,
            isFreeTrial,
            hasReachedTrialLimit,
            daysUntilExpiry,
            subscriptionStatus: isFreeTrial ? (hasReachedTrialLimit ? 'trial_expired' : 'free_trial') : 'paid',
            planPrice: user.plan === 'ultra' ? 1600 : (user.plan === 'basic' ? 900 : 0),
            trialExpireDate: new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
        });
        
        setAllUsers(enhancedUsers);
        calculateStats(enhancedUsers);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const calculateStats = (usersData) => {
    const now = new Date();
    const freeTrialUsers = usersData.filter(u => u.isFreeTrial).length;
    const upgradeExpiredUsers = usersData.filter(u => u.hasReachedTrialLimit).length;
    const reaching30Days = usersData.filter(u => u.daysActive >= 25 && u.daysActive < 30 && u.isFreeTrial).length;
    const totalRevenue = usersData
      .filter(u => !u.isFreeTrial && !u.hasReachedTrialLimit)
      .reduce((sum, u) => sum + (u.planPrice || 0), 0);

    setStats({
      totalUsers: usersData.length,
      activeUsers: usersData.filter(u => u.active !== false).length,
      freeTrialUsers,
      upgradeExpiredUsers,
      reaching30Days,
      totalRevenue
    });
  };

  const getStatusColor = (user) => {
    if (user.hasReachedTrialLimit) return 'bg-red-100 border-red-300';
    if (user.daysUntilExpiry <= 5 && user.isFreeTrial) return 'bg-yellow-100 border-yellow-300';
    if (user.isFreeTrial) return 'bg-blue-100 border-blue-300';
    return 'bg-green-100 border-green-300';
  };

  const getStatusBadge = (user) => {
    if (user.hasReachedTrialLimit) {
      return <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">Trial Expired</span>;
    }
    if (user.isFreeTrial) {
      return (
        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
          Free Trial - {user.daysUntilExpiry}d left
        </span>
      );
    }
    return <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Active</span>;
  };

  const handleUpgradeReminder = async (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    try {
      const token = localStorage.getItem('ownerToken');
      const response = await fetch(`${BASE_API_URL}/api/main-admin/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          type: 'upgrade'
        })
      });

      if (response.ok) {
        alert(`Upgrade reminder sent to ${user.email}`);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email');
    }
  };

  const handleLockUser = async (userId, currentLockStatus) => {
    try {
      setLockingUser(userId);
      const token = localStorage.getItem('ownerToken');
      const response = await fetch(`${BASE_API_URL}/api/main-admin/users/${userId}/lock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ locked: !currentLockStatus })
      });

      if (response.ok) {
        setAllUsers(prev =>
          prev.map(u => u.id === userId ? { ...u, locked: !currentLockStatus, active: currentLockStatus } : u)
        );
        const action = !currentLockStatus ? 'locked' : 'unlocked';
        alert(`User ${action} successfully`);
      } else {
        throw new Error('Failed to update user lock status');
      }
    } catch (error) {
      console.error('Failed to update user lock status:', error);
      alert('Failed to update user');
    } finally {
      setLockingUser(null);
    }
  };

  const handleRedirectToSignup = async (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    try {
      const token = localStorage.getItem('ownerToken');
      const response = await fetch(`${BASE_API_URL}/api/main-admin/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          type: 'upgrade'
        })
      });

      if (response.ok) {
        alert(`Redirect email sent to ${user.email}`);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Failed to send redirect email:', error);
      alert('Failed to send email');
    }
  };

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === 'all' ||
      (filter === 'free_trial' && u.isFreeTrial && !u.hasReachedTrialLimit) ||
      (filter === 'trial_expired' && u.hasReachedTrialLimit) ||
      (filter === 'paid' && !u.isFreeTrial) ||
      (filter === 'expiring_soon' && u.daysUntilExpiry <= 5 && u.isFreeTrial);

    return matchesSearch && matchesFilter;
  });

  const logout = () => {
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerUser');
    navigate('/main.admin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100 mt-1">User Management & Subscription Tracking</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Free Trial</p>
                <p className="text-3xl font-bold text-blue-400">{stats.freeTrialUsers}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Expiring Soon</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.reaching30Days}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Expired</p>
                <p className="text-3xl font-bold text-red-600">{stats.upgradeExpiredUsers}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Monthly Revenue</p>
                <p className="text-3xl font-bold text-green-600">${(stats.totalRevenue / 1000).toFixed(1)}K</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow">
          {/* Filter & Search */}
          <div className="border-b p-6 flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Users</option>
              <option value="free_trial">Free Trial</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="trial_expired">Trial Expired</option>
              <option value="paid">Paid Users</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">User</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Plan</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Days Active</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Trial Expires</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className={`border-b hover:bg-gray-50 transition ${getStatusColor(user)}`}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-semibold">
                          {user.plan || 'free'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(user)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${user.daysActive >= 25 ? 'text-red-600' : 'text-gray-900'}`}>
                          {user.daysActive} days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-600">
                          {new Date(user.trialExpireDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {user.hasReachedTrialLimit && (
                            <button
                              onClick={() => handleRedirectToSignup(user.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1"
                              title="Send upgrade prompt"
                            >
                              <Zap className="w-3 h-3" />
                              Upgrade
                            </button>
                          )}
                          {user.daysUntilExpiry <= 5 && user.isFreeTrial && !user.hasReachedTrialLimit && (
                            <button
                              onClick={() => handleUpgradeReminder(user.id)}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1"
                              title="Send trial expiry reminder"
                            >
                              <Send className="w-3 h-3" />
                              Remind
                            </button>
                          )}
                          <button
                            onClick={() => handleLockUser(user.id, user.locked)}
                            disabled={lockingUser === user.id}
                            className={`${
                              user.locked
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-orange-600 hover:bg-orange-700'
                            } text-white px-3 py-1 rounded text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1`}
                          >
                            {user.locked ? (
                              <>
                                <Unlock className="w-3 h-3" />
                                Unlock
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                Lock
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
