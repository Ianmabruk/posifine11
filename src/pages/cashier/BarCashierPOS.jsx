import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GenericCashierPOS from './GenericCashierPOS';
import { Wine, LogOut, DollarSign, Zap } from 'lucide-react';

export default function BarCashierPOS() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dayStats, setDayStats] = useState({ sales: 0, count: 0 });

  useEffect(() => {
    // Load day stats from localStorage
    const stats = JSON.parse(localStorage.getItem('dayStats') || '{"sales": 0, "count": 0}');
    setDayStats(stats);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 to-amber-700">
      {/* Header */}
      <div className="bg-amber-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wine size={32} className="text-amber-300" />
              <div>
                <h1 className="text-2xl font-bold">Bar POS</h1>
                <p className="text-amber-200 text-sm">Drinks & Beverages</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-amber-200 text-sm">Today's Sales</p>
                <p className="text-2xl font-bold text-green-400">{dayStats.sales.toLocaleString()} KES</p>
                <p className="text-amber-300 text-xs">{dayStats.count} transactions</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth/login');
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-amber-800 text-white border-b border-amber-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto">
          <div className="px-4 py-2 bg-amber-600 rounded-lg font-semibold">🍺 Beer</div>
          <div className="px-4 py-2 hover:bg-amber-700 rounded-lg cursor-pointer transition">🍷 Wine</div>
          <div className="px-4 py-2 hover:bg-amber-700 rounded-lg cursor-pointer transition">🥃 Spirits</div>
          <div className="px-4 py-2 hover:bg-amber-700 rounded-lg cursor-pointer transition">🧊 Mixers</div>
          <div className="px-4 py-2 hover:bg-amber-700 rounded-lg cursor-pointer transition">🍸 Cocktails</div>
        </div>
      </div>

      {/* Generic POS Component */}
      <div className="bg-amber-50">
        <GenericCashierPOS businessType="bar" />
      </div>

      {/* Bar-Specific Footer */}
      <div className="bg-amber-900 text-white py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          <p className="text-sm">Fast checkout • Age verification on premium items • Real-time inventory</p>
        </div>
      </div>
    </div>
  );
}
