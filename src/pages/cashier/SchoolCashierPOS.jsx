import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GenericCashierPOS from './GenericCashierPOS';
import { BookOpen, LogOut, Users, Banknote } from 'lucide-react';

export default function SchoolCashierPOS() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [studentSearch, setStudentSearch] = useState('');
  const [dayStats, setDayStats] = useState({ feesCollected: 0, transactions: 0 });

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('dayStats') || '{"feesCollected": 0, "transactions": 0}');
    setDayStats(stats);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen size={32} className="text-blue-200" />
              <div>
                <h1 className="text-2xl font-bold">School POS</h1>
                <p className="text-blue-200 text-sm">Student & Fee Management</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-blue-200 text-sm">Fees Collected Today</p>
                <p className="text-2xl font-bold text-green-300">{dayStats.feesCollected.toLocaleString()} KES</p>
                <p className="text-blue-200 text-xs">{dayStats.transactions} transactions</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth/login');
                }}
                className="flex items-center gap-2 bg-blue-900 hover:bg-blue-950 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Search */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Users size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search student by name, admission number, or class..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition flex items-center gap-2">
              <Banknote size={18} />
              Fee Slip
            </button>
          </div>
        </div>
      </div>

      {/* Item Categories */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto">
          <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">💰 Term Fees</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">🍽️ Canteen</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">👕 Uniforms</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">📚 Books</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">✏️ Supplies</div>
        </div>
      </div>

      {/* Generic POS Component */}
      <div className="bg-white">
        <GenericCashierPOS businessType="school" />
      </div>

      {/* School Footer */}
      <div className="bg-blue-700 text-white py-4 text-center">
        <p className="text-sm">Student records linked • Receipt generation • Year-end reports</p>
      </div>
    </div>
  );
}
