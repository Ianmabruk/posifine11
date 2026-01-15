import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, Clock, CheckCircle, AlertCircle, MoreVertical } from 'lucide-react';
import { subscriptions } from '../services/api';

export default function SubscriptionManagement() {
  const [overview, setOverview] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, plans, users

  useEffect(() => {
    loadSubscriptionData();
    
    // Refresh every 10 minutes
    const interval = setInterval(loadSubscriptionData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setError('');
      setLoading(true);
      
      const [overviewData, plansData] = await Promise.all([
        subscriptions.getOverview(),
        subscriptions.getPlans()
      ]);
      
      setOverview(overviewData);
      setPlans(plansData);
    } catch (err) {
      console.error('Failed to load subscription data:', err);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
        <button
          onClick={loadSubscriptionData}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Subscribers</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{overview.totalSubscribers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Subscriptions</p>
                <p className="text-3xl font-bold text-green-900 mt-1">{overview.totalActiveSubscriptions}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">KSH {overview.totalRevenue?.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Available Plans</p>
                <p className="text-3xl font-bold text-orange-900 mt-1">{plans.length}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-300" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'plans'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Plans
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Subscriptions
          </button>
        </div>
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          {overview?.plans?.map(plan => (
            <div key={plan.planId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{plan.planName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {plan.durationDays} days • KSH {plan.price?.toLocaleString()}/cycle
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{plan.activeSubscribers}</p>
                    <p className="text-xs text-gray-600">Active</p>
                  </div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded p-3">
                  <p className="text-xs text-blue-600 font-medium">Active</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{plan.activeSubscribers}</p>
                </div>
                <div className="bg-red-50 rounded p-3">
                  <p className="text-xs text-red-600 font-medium">Expired</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">{plan.expiredSubscribers}</p>
                </div>
                <div className="bg-green-50 rounded p-3">
                  <p className="text-xs text-green-600 font-medium">Revenue</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">KSH {plan.totalRevenue?.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 rounded p-3">
                  <p className="text-xs text-purple-600 font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{plan.activeSubscribers + plan.expiredSubscribers}</p>
                </div>
              </div>

              {/* Plan Features */}
              {plan.features && plan.features.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Active Subscriptions Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-700">User</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Plan</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Days Used</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Days Remaining</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">End Date</th>
                </tr>
              </thead>
              <tbody>
                {overview?.plans?.flatMap(plan =>
                  plan.activeSubscriptions?.map(sub => (
                    <tr key={`${plan.planId}-${sub.userId}`} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{sub.userName}</p>
                          <p className="text-xs text-gray-500">{sub.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{plan.planName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{sub.daysUsed} days</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={sub.daysRemaining <= 1 ? 'text-red-600 font-medium' : ''}>
                            {sub.daysRemaining} days
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          sub.daysRemaining <= 1
                            ? 'bg-red-100 text-red-700'
                            : sub.daysRemaining <= 7
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {sub.daysRemaining <= 1 ? <AlertCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(sub.endDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
