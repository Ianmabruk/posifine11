import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * AI-powered sales forecast chart component
 * Displays predicted revenue and profit trends
 */
export default function AICharts({ periods = 4 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForecast();
  }, [periods]);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE}/api/ai/forecast?periods=${periods}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const forecastData = response.data.data;
      
      // Transform data for Recharts
      const chartData = forecastData.labels.map((label, i) => ({
        name: label,
        revenue: forecastData.revenue[i],
        profit: forecastData.profit[i]
      }));

      setData(chartData);
    } catch (err) {
      console.error('Forecast fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load forecast');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ai-charts-loading">
        <div className="spinner"></div>
        <p>Generating AI forecast...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-charts-error">
        <p className="error-message">⚠️ {error}</p>
        <button onClick={fetchForecast} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="ai-charts-empty">
        <p>No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="ai-charts-container">
      <div className="ai-charts-header">
        <h3>📈 AI Sales Forecast</h3>
        <button onClick={fetchForecast} className="refresh-btn" title="Refresh forecast">
          🔄
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${value.toFixed(2)}`}
            labelStyle={{ color: '#333' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2196F3"
            strokeWidth={2}
            name="Revenue"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#4CAF50"
            strokeWidth={2}
            name="Profit"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="ai-charts-summary">
        <div className="summary-card">
          <span className="summary-label">Projected Revenue</span>
          <span className="summary-value revenue">
            ${data[data.length - 1]?.revenue.toFixed(2)}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Projected Profit</span>
          <span className="summary-value profit">
            ${data[data.length - 1]?.profit.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
