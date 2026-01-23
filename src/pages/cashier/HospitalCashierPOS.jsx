import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GenericCashierPOS from './GenericCashierPOS';
import { Heart, LogOut, Search, Clock } from 'lucide-react';

export default function HospitalCashierPOS() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [dayStats, setDayStats] = useState({ revenue: 0, patients: 0 });

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('dayStats') || '{"revenue": 0, "patients": 0}');
    setDayStats(stats);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="bg-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart size={32} className="text-red-200" />
              <div>
                <h1 className="text-2xl font-bold">Hospital POS</h1>
                <p className="text-red-200 text-sm">Patient Billing System</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-red-200 text-sm">Daily Revenue</p>
                <p className="text-2xl font-bold text-green-300">{dayStats.revenue.toLocaleString()} KES</p>
                <p className="text-red-200 text-xs">{dayStats.patients} patients served</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth/login');
                }}
                className="flex items-center gap-2 bg-red-900 hover:bg-red-950 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Search */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient by ID or name..."
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition flex items-center gap-2">
              <Clock size={18} />
              Recent Patients
            </button>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto">
          <div className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">🏥 Services</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">💊 Medicines</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">🧪 Lab Tests</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">📋 Procedures</div>
        </div>
      </div>

      {/* Generic POS Component */}
      <div className="bg-white">
        <GenericCashierPOS businessType="hospital" />
      </div>

      {/* Hospital Footer */}
      <div className="bg-red-700 text-white py-4 text-center">
        <p className="text-sm">Patient records integrated • Invoice generation • Real-time inventory tracking</p>
      </div>
    </div>
  );
}
