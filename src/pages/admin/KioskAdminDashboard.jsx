import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Truck, Tag, TrendingUp } from 'lucide-react';

export default function KioskAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const tabs = [
    { id: 'inventory', label: 'Simple Inventory', icon: Package },
    { id: 'suppliers', label: 'Supplier Tracking', icon: Truck },
    { id: 'pricing', label: 'Price Rules', icon: Tag },
    { id: 'reports', label: 'Profit Reports', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Kiosk Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage products, suppliers, and pricing</p>
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
                    ? 'text-purple-600 border-b-2 border-purple-600'
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
          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Product Inventory</h2>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus size={18} />
                  Add Product
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No products in inventory yet.</p>
                <p className="text-sm">Click "Add Product" to start building your inventory.</p>
              </div>
            </div>
          )}

          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Supplier Contacts</h2>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus size={18} />
                  Add Supplier
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No suppliers added yet.</p>
                <p className="text-sm">Click "Add Supplier" to track supplier information.</p>
              </div>
            </div>
          )}

          {/* Price Rules Tab */}
          {activeTab === 'pricing' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Price Rules & Discounts</h2>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus size={18} />
                  New Rule
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No pricing rules configured yet.</p>
                <p className="text-sm">Set up bulk discounts, promotions, and pricing rules.</p>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profit & Sales Reports</h2>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Sales reports will appear here.</p>
                <p className="text-sm">View profit margins and sales analytics.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
