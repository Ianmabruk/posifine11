import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle, Users, Pill } from 'lucide-react';

export default function HospitalAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [medicines, setMedicines] = useState([]);

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const tabs = [
    { id: 'services', label: 'Services', icon: Users },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'patients', label: 'Patient Billing', icon: AlertCircle },
    { id: 'commission', label: 'Doctor Commission', icon: Users },
    { id: 'expiry', label: 'Batch & Expiry', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Hospital Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage services, medicines, and billing</p>
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
                    ? 'text-blue-600 border-b-2 border-blue-600'
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
          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Medical Services</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={18} />
                  Add Service
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No services added yet.</p>
                <p className="text-sm">Click "Add Service" to create a new medical service.</p>
              </div>
            </div>
          )}

          {/* Medicines Tab */}
          {activeTab === 'medicines' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Medicines Inventory</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={18} />
                  Add Medicine
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No medicines added yet.</p>
                <p className="text-sm">Click "Add Medicine" to add inventory items.</p>
              </div>
            </div>
          )}

          {/* Patient Billing Tab */}
          {activeTab === 'patients' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Patient Billing Records</h2>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Patient billing records will appear here.</p>
                <p className="text-sm">Billing records are created when staff process sales.</p>
              </div>
            </div>
          )}

          {/* Doctor Commission Tab */}
          {activeTab === 'commission' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Doctor Commission Tracking</h2>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Doctor commission records will appear here.</p>
                <p className="text-sm">Commission is calculated based on services provided.</p>
              </div>
            </div>
          )}

          {/* Batch & Expiry Tab */}
          {activeTab === 'expiry' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Batch & Expiry Tracking</h2>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Batch and expiry information will appear here.</p>
                <p className="text-sm">Track medicine batches and expiration dates.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
