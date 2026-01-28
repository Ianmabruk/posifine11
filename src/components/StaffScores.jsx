import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Staff Performance Scores Component
 * Displays AI-generated employee performance ratings
 */
export default function StaffScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('score'); // score, name

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE}/api/ai/staff-score`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = response.data.data;
      setScores(data.scores || []);
    } catch (err) {
      console.error('Staff scores fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load staff scores');
    } finally {
      setLoading(false);
    }
  };

  const getSortedScores = () => {
    const sorted = [...scores];
    
    if (sortBy === 'score') {
      sorted.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return sorted;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4CAF50'; // Excellent - Green
    if (score >= 75) return '#2196F3'; // Good - Blue
    if (score >= 60) return '#FF9800'; // Average - Orange
    return '#f44336'; // Needs Improvement - Red
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="staff-scores-loading">
        <div className="spinner"></div>
        <p>Analyzing staff performance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-scores-error">
        <p className="error-message">⚠️ {error}</p>
        <button onClick={fetchScores} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!scores.length) {
    return (
      <div className="staff-scores-empty">
        <p>No employee data available for scoring</p>
        <small>Scores are based on sales performance and time tracking</small>
      </div>
    );
  }

  const sortedScores = getSortedScores();
  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

  return (
    <div className="staff-scores-container">
      <div className="staff-scores-header">
        <div className="header-left">
          <h3>🧠 Employee Performance Scores</h3>
          <span className="scores-count">{scores.length} employees</span>
        </div>
        <div className="header-right">
          <button onClick={fetchScores} className="refresh-btn" title="Refresh scores">
            🔄 Refresh
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="score">Sort by Score</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      <div className="staff-scores-summary">
        <div className="summary-card">
          <span className="summary-label">Team Average</span>
          <span className="summary-value">{avgScore.toFixed(1)}/100</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Top Performer</span>
          <span className="summary-value">
            {sortedScores[0]?.name} ({sortedScores[0]?.score})
          </span>
        </div>
      </div>

      <div className="staff-scores-list">
        {sortedScores.map((staff, idx) => (
          <div key={idx} className="staff-score-card">
            <div className="staff-header">
              <div className="staff-info">
                <span className="staff-rank">#{idx + 1}</span>
                <span className="staff-name">{staff.name}</span>
              </div>
              <div className="staff-score">
                <span
                  className="score-value"
                  style={{ color: getScoreColor(staff.score) }}
                >
                  {staff.score}/100
                </span>
                <span
                  className="score-label"
                  style={{ color: getScoreColor(staff.score) }}
                >
                  {getScoreLabel(staff.score)}
                </span>
              </div>
            </div>

            <div className="staff-progress">
              <div
                className="progress-bar"
                style={{
                  width: `${staff.score}%`,
                  backgroundColor: getScoreColor(staff.score)
                }}
              ></div>
            </div>

            <div className="staff-reason">
              <span className="reason-icon">💡</span>
              <span className="reason-text">{staff.reason}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="staff-scores-footer">
        <small>
          ℹ️ Scores are calculated by AI based on sales volume, hours worked,
          and consistency. Updated in real-time.
        </small>
      </div>
    </div>
  );
}
