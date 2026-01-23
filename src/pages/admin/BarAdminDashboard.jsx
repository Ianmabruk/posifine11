// Bar Admin Dashboard - Industry-Specific
// For managing drinks, staff shifts, pricing, and brand profitability

import { useState, useEffect } from 'react';
import { Plus, BarChart3, Users, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BarAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user) navigate('/auth/login');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Bar Management System</h1>
          <div className="text-gray-600">{user?.email}</div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'inventory'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Drinks Inventory
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'staff'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Staff & Shifts
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'pricing'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Happy Hour Pricing
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Brand Reports
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Drinks Inventory</h2>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus size={20} />
                Add Drink
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p>No drinks added yet. Click "Add Drink" to get started.</p>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Staff & Shifts</h2>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus size={20} />
                Add Staff Member
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p>No staff members added yet.</p>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Happy Hour Pricing Rules</h2>
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p>Configure happy hour pricing rules here.</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Brand Profitability Reports</h2>
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p>Brand profit reports will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
