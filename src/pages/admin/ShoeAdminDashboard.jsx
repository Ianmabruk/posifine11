import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Percent, RotateCcw } from 'lucide-react';

export default function ShoeAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('variants');
  const [products, setProducts] = useState([]);

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const tabs = [
    { id: 'variants', label: 'Variants', icon: Package },
    { id: 'margin', label: 'Margin Per Product', icon: Percent },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shoe/Clothing Store Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage variants, pricing, and inventory</p>
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
                    ? 'text-pink-600 border-b-2 border-pink-600'
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
          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Size & Color Variants</h2>
                <button className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                  <Plus size={18} />
                  Add Product
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No products added yet.</p>
                <p className="text-sm">Click "Add Product" to create items with size and color variants.</p>
              </div>
            </div>
          )}

          {/* Margin Tab */}
          {activeTab === 'margin' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profit Margin Configuration</h2>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Margin information will appear here.</p>
                <p className="text-sm">View and manage profit margins for each product.</p>
              </div>
            </div>
          )}

          {/* Returns Tab */}
          {activeTab === 'returns' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Returns & Refunds</h2>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Return records will appear here.</p>
                <p className="text-sm">Track customer returns and process refunds.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
