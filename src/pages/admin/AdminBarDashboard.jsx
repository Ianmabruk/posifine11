import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, Wine, DollarSign, Package, MessageSquare } from 'lucide-react';
import api from '../../services/api';

export default function AdminBarDashboard() {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  // Available bar roles
  const barRoles = [
    { value: 'bartender', label: 'Bartender', icon: Wine },
    { value: 'cashier', label: 'Cashier', icon: DollarSign },
    { value: 'store', label: 'Store Manager', icon: Package }
  ];

  useEffect(() => {
    loadStaff();
    loadMessages();
  }, []);

  const loadStaff = async () => {
    try {
      const response = await api.get('/api/business/users');
      setStaff(response.data.users || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load staff:', error);
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await api.get('/api/messages/inbox?limit=5');
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleAddStaff = async (formData) => {
    try {
      await api.post('/api/business/users', formData);
      setShowAddStaff(false);
      loadStaff();
    } catch (error) {
      console.error('Failed to add staff:', error);
      alert('Failed to add staff member');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">🍻 Bar Admin Dashboard</h1>
              <p className="text-purple-100 mt-1">Manage your bar staff and operations</p>
            </div>
            <button
              onClick={() => setShowAddStaff(true)}
              className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Staff
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {barRoles.map((role) => {
            const Icon = role.icon;
            const count = staff.filter(s => s.business_role === role.value).length;
            return (
              <div key={role.value} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{role.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                  </div>
                  <Icon className="w-10 h-10 text-purple-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Messages */}
        {messages.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-purple-600" />
                Recent Messages
              </h2>
              <a href="/messages" className="text-purple-600 hover:text-purple-700">View all</a>
            </div>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{msg.fromUserName}</span>
                      <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{msg.content}</p>
                    <span className="text-xs text-purple-600 mt-1 inline-block">From: {msg.fromRole}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Bar Staff</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-center text-gray-600">Loading staff...</p>
            ) : staff.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No staff members yet</p>
                <button
                  onClick={() => setShowAddStaff(true)}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Add your first staff member
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staff.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{member.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {member.business_role || member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {member.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <button className="text-purple-600 hover:text-purple-700 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-700">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddStaff && (
        <AddStaffModal
          roles={barRoles}
          onClose={() => setShowAddStaff(false)}
          onSubmit={handleAddStaff}
        />
      )}
    </div>
  );
}

// Add Staff Modal Component
function AddStaffModal({ roles, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessRole: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.businessRole) {
      alert('Please fill all fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Add New Staff Member</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="john@bar.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.businessRole}
              onChange={(e) => setFormData({ ...formData, businessRole: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select role...</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
