/**
 * EXAMPLE: How to integrate AI Assistant into Pro Plan Dashboards
 * 
 * Use this for Clinic, Bar, Hotel, or any Pro plan business
 */

import React from 'react';
import ProAIAssistant from '../components/ProAIAssistant';
import AICharts from '../components/AICharts';
import '../components/AIFeatures.css';

/**
 * CLINIC DASHBOARD WITH AI
 */
export function ClinicDashboardWithAI() {
  return (
    <div className="clinic-dashboard">
      {/* Your existing clinic features */}
      <div className="clinic-header">
        <h1>🏥 Clinic Management</h1>
      </div>

      {/* Your existing sections: appointments, patients, etc. */}
      
      {/* ========================================= */}
      {/* AI FEATURES FOR CLINIC */}
      {/* ========================================= */}
      
      <div className="ai-section">
        {/* AI Assistant - Clinic specific */}
        <ProAIAssistant 
          role="admin" 
          businessType="clinic" 
        />

        {/* Revenue Forecast */}
        <AICharts periods={4} />
      </div>
    </div>
  );
}

/**
 * BAR DASHBOARD WITH AI
 */
export function BarDashboardWithAI() {
  return (
    <div className="bar-dashboard">
      <div className="bar-header">
        <h1>🍺 Bar Management</h1>
      </div>

      {/* Your existing bar features */}

      {/* AI Features */}
      <div className="ai-section">
        <ProAIAssistant 
          role="admin" 
          businessType="bar" 
        />

        <AICharts periods={4} />
      </div>
    </div>
  );
}

/**
 * HOTEL DASHBOARD WITH AI
 */
export function HotelDashboardWithAI() {
  return (
    <div className="hotel-dashboard">
      <div className="hotel-header">
        <h1>🏨 Hotel Management</h1>
      </div>

      {/* Your existing hotel features: rooms, bookings, etc. */}

      {/* AI Features */}
      <div className="ai-section">
        <ProAIAssistant 
          role="admin" 
          businessType="hotel" 
        />

        <AICharts periods={4} />
      </div>
    </div>
  );
}

/**
 * SIDEBAR LAYOUT
 * AI Assistant in sidebar for quick access
 */
export function DashboardWithAISidebar() {
  return (
    <div className="dashboard-layout">
      {/* Main Content */}
      <div className="main-content">
        {/* Your dashboard content */}
      </div>

      {/* AI Sidebar */}
      <aside className="ai-sidebar">
        <ProAIAssistant 
          role="admin" 
          businessType="clinic" 
        />
      </aside>
    </div>
  );
}

/**
 * MODAL/POPUP VERSION
 * Show AI Assistant as a floating popup
 */
import { useState } from 'react';

export function DashboardWithAIModal() {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="dashboard">
      {/* Your dashboard content */}

      {/* Floating AI Button */}
      <button 
        className="ai-fab"
        onClick={() => setShowAI(!showAI)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}
      >
        🤖
      </button>

      {/* AI Modal */}
      {showAI && (
        <div 
          className="ai-modal"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            width: '400px',
            maxWidth: '90vw',
            maxHeight: '600px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '15px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <h3 style={{ margin: 0 }}>AI Assistant</h3>
            <button 
              onClick={() => setShowAI(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ padding: '15px', maxHeight: '500px', overflow: 'auto' }}>
            <ProAIAssistant 
              role="admin" 
              businessType="clinic" 
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * CSS for layouts
 */
const styles = `
.dashboard-layout {
  display: flex;
  gap: 20px;
}

.main-content {
  flex: 1;
}

.ai-sidebar {
  width: 400px;
  max-width: 30%;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.ai-section {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 1024px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .ai-sidebar {
    width: 100%;
    max-width: 100%;
    position: static;
  }
}
`;
