import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CashierPOS from '../CashierPOS';
import { Fuel, LogOut, Droplet, TrendingUp } from 'lucide-react';

export default function PetrolCashierPOS() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedPump, setSelectedPump] = useState('1');
  const [dayStats, setDayStats] = useState({ revenue: 0, liters: 0, pumpTotal: 0 });

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('dayStats') || '{"revenue": 0, "liters": 0, "pumpTotal": 0}');
    setDayStats(stats);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Fuel size={32} className="text-yellow-200" />
              <div>
                <h1 className="text-2xl font-bold">Petrol POS</h1>
                <p className="text-yellow-200 text-sm">Fuel & Tank Management</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-yellow-200 text-sm">Daily Revenue</p>
                <p className="text-2xl font-bold text-green-300">{dayStats.revenue.toLocaleString()} KES</p>
                <p className="text-yellow-200 text-xs">{dayStats.liters.toLocaleString()} liters sold</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth/login');
                }}
                className="flex items-center gap-2 bg-yellow-900 hover:bg-yellow-950 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pump Selector */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">Select Pump:</span>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5, 6].map((pump) => (
                <button
                  key={pump}
                  onClick={() => setSelectedPump(pump.toString())}
                  className={`px-6 py-2 rounded-lg font-bold transition ${
                    selectedPump === pump.toString()
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Droplet size={18} className="inline mr-2" />
                  Pump {pump}
                </button>
              ))}
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-gray-600">Pump {selectedPump} Total</p>
              <p className="text-2xl font-bold text-yellow-600">{dayStats.pumpTotal.toLocaleString()} KES</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Types */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto">
          <div className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold">⛽ Super</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">⛽ Regular</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">⛽ Diesel</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">🛢️ LPG</div>
        </div>
      </div>

      {/* Generic POS Component */}
      <div className="bg-white">
        <CashierPOS businessType="petrol" pumpNumber={selectedPump} />
      </div>

      {/* Petrol Footer */}
      <div className="bg-yellow-700 text-white py-4 text-center flex items-center justify-center gap-2">
        <TrendingUp size={18} />
        <p className="text-sm">Pump tracking • Tank management • Shift reconciliation • Real-time readings</p>
      </div>
    </div>
  );
}
