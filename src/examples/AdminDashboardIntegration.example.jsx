/**
 * EXAMPLE: How to integrate AI features into Admin Dashboard
 * 
 * Copy this code into your existing AdminDashboard or BasicDashboard component
 */

import React from 'react';
import AICharts from '../components/AICharts';
import StaffScores from '../components/StaffScores';
import '../components/AIFeatures.css';

// Your existing imports...

export default function AdminDashboardWithAI() {
  // Your existing state and logic...

  return (
    <div className="admin-dashboard">
      {/* ========================================= */}
      {/* YOUR EXISTING DASHBOARD CONTENT */}
      {/* ========================================= */}
      
      {/* Example existing sections */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="dashboard-stats">
        {/* Your existing stats cards */}
      </div>

      {/* ========================================= */}
      {/* NEW: AI FEATURES SECTION */}
      {/* ========================================= */}
      
      <div className="ai-features-section">
        <div className="section-header">
          <h2>🤖 AI Insights</h2>
          <p>Powered by advanced analytics</p>
        </div>

        {/* AI Sales Forecast Chart */}
        <AICharts periods={4} />

        {/* Employee Performance Scores */}
        <StaffScores />
      </div>

      {/* ========================================= */}
      {/* REST OF YOUR EXISTING CONTENT */}
      {/* ========================================= */}
    </div>
  );
}

/**
 * ALTERNATIVE: Tabbed Layout
 * If you prefer tabs instead of scrolling
 */

import { useState } from 'react';

export function AdminDashboardTabbed() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="admin-dashboard">
      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'ai' ? 'active' : ''}
          onClick={() => setActiveTab('ai')}
        >
          🤖 AI Insights
        </button>
        <button 
          className={activeTab === 'staff' ? 'active' : ''}
          onClick={() => setActiveTab('staff')}
        >
          Staff Performance
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Your existing dashboard content */}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="ai-tab">
            <AICharts periods={6} />
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="staff-tab">
            <StaffScores />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * MINIMAL: Just add AI Charts
 * If you only want forecasting
 */

export function MinimalAIIntegration() {
  return (
    <div className="dashboard">
      {/* Your existing content */}
      
      {/* Add just the forecast chart */}
      <div style={{ marginTop: '2rem' }}>
        <AICharts periods={4} />
      </div>
    </div>
  );
}
