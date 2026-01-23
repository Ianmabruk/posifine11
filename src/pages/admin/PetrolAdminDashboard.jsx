import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Fuel, Gauge, BarChart3, Clock } from 'lucide-react';

export default function PetrolAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('fuels');

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const tabs = [
    { id: 'fuels', label: 'Fuel Types', icon: Fuel },
    { id: 'pumps', label: 'Pump Tracking', icon: Gauge },
    { id: 'tank', label: 'Tank Stock', icon: BarChart3 },
    { id: 'reconciliation', label: 'Shift Reconciliation', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Petrol Station Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage fuel types, pumps, and inventory</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Fuel Types Tab */}
          {activeTab === 'fuels' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Fuel Type Configuration</h2>
                <button className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  <Plus size={18} />
                  Add Fuel Type
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No fuel types configured yet.</p>
                <p className="text-sm">Click "Add Fuel Type" to configure available fuel products.</p>
              </div>
            </div>
          )}

          {/* Pump Tracking Tab */}
          {activeTab === 'pumps' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Pump Management</h2>
                <button className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  <Plus size={18} />
                  Add Pump
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No pumps added yet.</p>
                <p className="text-sm">Click "Add Pump" to register pumps at your station.</p>
              </div>
            </div>
          )}

          {/* Tank Stock Tab */}
          {activeTab === 'tank' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Tank Stock Levels</h2>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Tank stock information will appear here.</p>
                <p className="text-sm">View current fuel levels in all storage tanks.</p>
              </div>
            </div>
          )}

          {/* Shift Reconciliation Tab */}
          {activeTab === 'reconciliation' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Shift Reconciliation</h2>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Shift reconciliation records will appear here.</p>
                <p className="text-sm">View daily sales totals and pump readings by shift.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
