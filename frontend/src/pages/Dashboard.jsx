import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Dashboard.css'

function Dashboard({ user }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalRoutines: 0,
    totalConflicts: 0,
    totalTeachers: 0,
    totalClasses: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const response = await axios.get('http://localhost:8080/api/v1/dashboard/stats', { headers })
      
      setStats({
        totalRoutines: response.data.totalRoutines || 0,
        totalConflicts: response.data.totalConflicts || 0,
        totalTeachers: response.data.totalTeachers || 0,
        totalClasses: response.data.totalClasses || 0
      })
      setLoading(false)
    } catch (err) {
      console.error('Stats error:', err)
      setStats({
        totalRoutines: 0,
        totalConflicts: 0,
        totalTeachers: 0,
        totalClasses: 0
      })
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <div>
          <h1>🎓 Welcome back, {user?.firstName || 'User'}!</h1>
          <p className="subtitle">✨ Here's what's happening with your classes today</p>
        </div>
      </div>

      <div className="stats-grid">
        {loading ? (
          [0,1,2,3].map((i) => (
            <div key={i} className="stat-card skeleton" style={{ '--accent-color': '#4285f4' }} />
          ))
        ) : (
          <>
            <div className="stat-card" style={{ '--accent-color': '#4285f4' }}>
              <div className="stat-icon gradient-blue">
                <span className="stat-emoji">📅</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalRoutines}</div>
                <div className="stat-label">Total Routines</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent-color': '#ea4335' }}>
              <div className="stat-icon gradient-red">
                <span className="stat-emoji">⚠️</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalConflicts}</div>
                <div className="stat-label">Active Conflicts</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent-color': '#34a853' }}>
              <div className="stat-icon gradient-green">
                <span className="stat-emoji">👨‍🏫</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalTeachers}</div>
                <div className="stat-label">Teachers</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent-color': '#fbbc04' }}>
              <div className="stat-icon gradient-yellow">
                <span className="stat-emoji">🏫</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalClasses}</div>
                <div className="stat-label">Classes</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-content">
        <div className="section">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="action-grid">
            <button className="action-card" style={{ '--action-color': '#4285f4' }} onClick={() => navigate('/routines')}>
              <div className="action-icon gradient-blue">
                <span>➕</span>
              </div>
              <div className="action-title">Create Routine</div>
            </button>

            <button className="action-card" style={{ '--action-color': '#ea4335' }} onClick={() => navigate('/conflicts')}>
              <div className="action-icon gradient-red">
                <span>🔍</span>
              </div>
              <div className="action-title">View Conflicts</div>
            </button>

            <button className="action-card" style={{ '--action-color': '#34a853' }} onClick={() => navigate('/substitutes')}>
              <div className="action-icon gradient-green">
                <span>👤</span>
              </div>
              <div className="action-title">Allocate Substitute</div>
            </button>

            <button className="action-card" style={{ '--action-color': '#fbbc04' }} onClick={() => navigate('/routines')}>
              <div className="action-icon gradient-yellow">
                <span>📊</span>
              </div>
              <div className="action-title">View Routines</div>
            </button>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">📈 Recent Activity</h2>
          <div className="activity-card">
            <div className="empty-state">
              <div className="empty-state-hero">🚀</div>
              <h3>No recent activity</h3>
              <p>Your activity log will appear here once you start managing routines</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
