import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Dashboard.css'

function Dashboard({ user }) {
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

      // For now, set mock data since endpoints might not exist yet
      setStats({
        totalRoutines: 0,
        totalConflicts: 0,
        totalTeachers: 0,
        totalClasses: 0
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

  const quickActions = [
    { 
      title: 'Create Routine', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      ),
      color: '#4285f4'
    },
    { 
      title: 'View Conflicts', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
      color: '#ea4335'
    },
    { 
      title: 'Allocate Substitute', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      color: '#34a853'
    },
    { 
      title: 'Generate Report', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      color: '#fbbc04'
    }
  ]

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.firstName || 'User'}!</h1>
          <p className="subtitle">Here's what's happening with your classes today</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ '--accent-color': '#4285f4' }}>
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{loading ? '...' : stats.totalRoutines}</div>
            <div className="stat-label">Total Routines</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--accent-color': '#ea4335' }}>
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{loading ? '...' : stats.totalConflicts}</div>
            <div className="stat-label">Active Conflicts</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--accent-color': '#34a853' }}>
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{loading ? '...' : stats.totalTeachers}</div>
            <div className="stat-label">Teachers</div>
          </div>
        </div>

        <div className="stat-card" style={{ '--accent-color': '#fbbc04' }}>
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{loading ? '...' : stats.totalClasses}</div>
            <div className="stat-label">Classes</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-grid">
            {quickActions.map((action, index) => (
              <button key={index} className="action-card" style={{ '--action-color': action.color }}>
                <div className="action-icon">{action.icon}</div>
                <div className="action-title">{action.title}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-card">
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p>No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
