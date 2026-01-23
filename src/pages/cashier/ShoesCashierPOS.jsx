import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GenericCashierPOS from './GenericCashierPOS';
import { Zap, LogOut, Grid3x3, Package } from 'lucide-react';

export default function ShoesCashierPOS() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ size: '', color: '' });
  const [dayStats, setDayStats] = useState({ sales: 0, pairs: 0, topSize: '' });

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('dayStats') || '{"sales": 0, "pairs": 0, "topSize": ""}');
    setDayStats(stats);
  }, []);

  const sizes = ['5', '6', '7', '8', '9', '10', '11', '12', '13'];
  const colors = ['Black', 'White', 'Brown', 'Blue', 'Red', 'Green', 'Pink', 'Gray'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <div className="bg-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 text-purple-200">👟</div>
              <div>
                <h1 className="text-2xl font-bold">Shoes POS</h1>
                <p className="text-purple-200 text-sm">Footwear & Variants</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-purple-200 text-sm">Daily Sales</p>
                <p className="text-2xl font-bold text-green-300">{dayStats.sales.toLocaleString()} KES</p>
                <p className="text-purple-200 text-xs">{dayStats.pairs} pairs sold • Top: Size {dayStats.topSize}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth/login');
                }}
                className="flex items-center gap-2 bg-purple-900 hover:bg-purple-950 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Variant Filters */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-6">
            {/* Size Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Grid3x3 size={18} className="inline mr-2" />
                Filter by Size
              </label>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setFilters({ ...filters, size: size === filters.size ? '' : size })}
                    className={`w-10 h-10 rounded-lg font-bold transition ${
                      filters.size === size
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Package size={18} className="inline mr-2" />
                Filter by Color
              </label>
              <select
                value={filters.color}
                onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                className="px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Colors</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Shoe Categories */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto">
          <div className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">👟 All Shoes</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">🏃 Sports</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">👞 Formal</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">👠 Casual</div>
          <div className="px-4 py-2 bg-white rounded-lg cursor-pointer hover:bg-gray-200 transition">👢 Boots</div>
        </div>
      </div>

      {/* Generic POS Component */}
      <div className="bg-white">
        <GenericCashierPOS businessType="shoes" filters={filters} />
      </div>

      {/* Shoes Footer */}
      <div className="bg-purple-700 text-white py-4 text-center">
        <p className="text-sm">Variant management • Size & color tracking • Stock by variant • Real-time availability</p>
      </div>
    </div>
  );
}
