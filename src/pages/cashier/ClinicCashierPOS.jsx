import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CashierPOS from '../CashierPOS';
import { Stethoscope, LogOut, HeartPulse } from 'lucide-react';

export default function ClinicCashierPOS() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dayStats, setDayStats] = useState({ sales: 0, count: 0 });

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('dayStats') || '{"sales": 0, "count": 0}');
    setDayStats(stats);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d4cff] to-[#22c55e] flex items-center justify-center text-white shadow">
              <Stethoscope size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Clinic POS</h1>
              <p className="text-slate-500 text-sm">Patients • Invoices • Pharmacy</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-slate-500 text-sm">Today&apos;s Sales</p>
              <p className="text-2xl font-bold text-emerald-600">{dayStats.sales.toLocaleString()} KES</p>
              <p className="text-slate-400 text-xs">{dayStats.count} transactions</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/auth/login');
              }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <CashierPOS businessType="clinic" />
      </div>

      <div className="bg-slate-900 text-white py-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <HeartPulse size={16} className="text-emerald-400" />
          Fast billing • Patient-friendly receipts • Real-time inventory
        </div>
      </div>
    </div>
  );
}
