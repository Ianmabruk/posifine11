import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, DollarSign, Package } from 'lucide-react';

export default function SchoolAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [products, setProducts] = useState([]);

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'fees', label: 'Term Fees', icon: DollarSign },
    { id: 'canteen', label: 'Canteen Products', icon: Package },
    { id: 'uniform', label: 'Uniform & Books', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">School Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage students, fees, and inventory</p>
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
                    ? 'text-green-600 border-b-2 border-green-600'
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
          {/* Students Tab */}
          {activeTab === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Student Registry</h2>
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Plus size={18} />
                  Add Student
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No students added yet.</p>
                <p className="text-sm">Click "Add Student" to enroll a new student.</p>
              </div>
            </div>
          )}

          {/* Term Fees Tab */}
          {activeTab === 'fees' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Term Fees Configuration</h2>
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Plus size={18} />
                  Set Fee
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No term fees configured yet.</p>
                <p className="text-sm">Set up fee amounts for each term or class.</p>
              </div>
            </div>
          )}

          {/* Canteen Products Tab */}
          {activeTab === 'canteen' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Canteen Products</h2>
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Plus size={18} />
                  Add Product
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No canteen products added yet.</p>
                <p className="text-sm">Click "Add Product" to add food/beverage items.</p>
              </div>
            </div>
          )}

          {/* Uniform & Books Tab */}
          {activeTab === 'uniform' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Uniform & Books Stock</h2>
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Plus size={18} />
                  Add Item
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No uniforms or books added yet.</p>
                <p className="text-sm">Click "Add Item" to add school supplies to inventory.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
