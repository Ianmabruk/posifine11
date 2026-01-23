import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { RefreshCw, Download, Calendar } from 'lucide-react';

export default function AnalyticsDashboard({ metrics = {}, detailed = false, onRefresh }) {
  const [analyticsData, setAnalyticsData] = useState({
    revenueByPlan: [],
    usageOverTime: [],
    topBusinesses: [],
    planDistribution: [],
    revenueTrend: []
  });
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(!detailed);

  useEffect(() => {
    if (detailed) {
      fetchDetailedAnalytics();
    }
  }, [timeRange, detailed]);

  const fetchDetailedAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v2/admin/analytics?range=${timeRange}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      metrics,
      analyticsData
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2)));
    element.setAttribute('download', `analytics-report-${new Date().toISOString()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  // Mock data for chart
  const mockRevenueData = [
    { name: 'Week 1', revenue: 45000, subscriptions: 12 },
    { name: 'Week 2', revenue: 52000, subscriptions: 15 },
    { name: 'Week 3', revenue: 48000, subscriptions: 14 },
    { name: 'Week 4', revenue: 61000, subscriptions: 18 }
  ];

  const mockPlanData = [
    { name: 'Basic', value: 40, color: '#3b82f6' },
    { name: 'Ultra', value: 35, color: '#8b5cf6' },
    { name: 'Custom', value: 25, color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      {detailed && (
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onRefresh && onRefresh()}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Download size={20} />
              Export Report
            </button>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Plan Distribution Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockPlanData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {mockPlanData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Subscriptions Growth Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Subscriptions Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Bar dataKey="subscriptions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Plan */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            {mockPlanData.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: plan.color }}
                  ></div>
                  <span className="font-medium">{plan.name} Plan</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">KES {(plan.value * 850).toLocaleString()}</p>
                  <p className="text-sm text-gray-400">{plan.value}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed View */}
      {detailed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KPI Cards */}
          <KPICard 
            title="Avg Revenue Per User"
            value="KES 1,250"
            change="+12%"
            trend="up"
          />
          <KPICard 
            title="Churn Rate"
            value="2.3%"
            change="-0.5%"
            trend="down"
          />
          <KPICard 
            title="LTV (12 months)"
            value="KES 15,000"
            change="+8%"
            trend="up"
          />
        </div>
      )}
    </div>
  );
}

function KPICard({ title, value, change, trend }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h4 className="text-gray-400 text-sm font-medium mb-2">{title}</h4>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className={`text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </p>
    </div>
  );
}
