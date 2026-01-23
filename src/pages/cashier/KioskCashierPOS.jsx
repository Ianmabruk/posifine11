import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GenericCashierPOS from './GenericCashierPOS';
import { Store, LogOut, Zap, AlertCircle } from 'lucide-react';

export default function KioskCashierPOS() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dayStats, setDayStats] = useState({ sales: 0, itemsSold: 0, lowStockItems: 0 });

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('dayStats') || '{"sales": 0, "itemsSold": 0, "lowStockItems": 0}');
    setDayStats(stats);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store size={32} className="text-green-200" />
              <div>
                <h1 className="text-2xl font-bold">Kiosk POS</h1>
                <p className="text-green-200 text-sm">Fast & Simple Checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-green-200 text-sm">Today's Revenue</p>
                <p className="text-2xl font-bold text-yellow-300">{dayStats.sales.toLocaleString()} KES</p>
                <p className="text-green-200 text-xs">{dayStats.itemsSold} items sold</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth/login');
                }}
                className="flex items-center gap-2 bg-green-900 hover:bg-green-950 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {dayStats.lowStockItems > 0 && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-yellow-800">
            <AlertCircle size={20} />
            <span className="font-semibold">{dayStats.lowStockItems} items running low on stock</span>
          </div>
        </div>
      )}

      {/* Quick Categories */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto">
          <div className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">🏪 All Items</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">🔌 Electronics</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">🍪 Food</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">🥤 Drinks</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">🛒 Supplies</div>
        </div>
      </div>

      {/* Generic POS Component */}
      <div className="bg-white">
        <GenericCashierPOS businessType="kiosk" />
      </div>

      {/* Kiosk Footer */}
      <div className="bg-green-700 text-white py-4 text-center flex items-center justify-center gap-2">
        <Zap size={18} className="text-yellow-300" />
        <p className="text-sm">Lightning-fast checkout • Low stock alerts • Real-time updates</p>
      </div>
    </div>
  );
}
