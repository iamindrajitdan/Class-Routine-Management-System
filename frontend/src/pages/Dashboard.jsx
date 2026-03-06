import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Dashboard.css'

function Dashboard({ user }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const response = await axios.get('/api/v1/dashboard/stats', { headers })
      setStats(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Stats error:', err)
      setError('Failed to load dashboard data')
      setLoading(false)
    }
  }

  const renderAdminStats = () => (
    <>
      <div className="stat-card clickable" style={{ '--accent-color': '#4285f4' }} onClick={() => navigate('/routines')}>
        <div className="stat-icon gradient-blue"><span className="stat-emoji">📅</span></div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalRoutines}</div>
          <div className="stat-label">Total Routines</div>
        </div>
      </div>
      <div className="stat-card clickable" style={{ '--accent-color': '#ea4335' }} onClick={() => navigate('/conflicts')}>
        <div className="stat-icon gradient-red"><span className="stat-emoji">⚠️</span></div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalConflicts}</div>
          <div className="stat-label">Active Conflicts</div>
        </div>
      </div>
      <div className="stat-card clickable" style={{ '--accent-color': '#34a853' }} onClick={() => navigate('/teachers')}>
        <div className="stat-icon gradient-green"><span className="stat-emoji">👨‍🏫</span></div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalTeachers}</div>
          <div className="stat-label">Teachers</div>
        </div>
      </div>
      <div className="stat-card clickable" style={{ '--accent-color': '#fbbc04' }} onClick={() => navigate('/classes')}>
        <div className="stat-icon gradient-yellow"><span className="stat-emoji">🏫</span></div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalClasses}</div>
          <div className="stat-label">Classes</div>
        </div>
      </div>
    </>
  )

  const renderFacultyStats = () => (
    <>
      <div className="stat-card" style={{ '--accent-color': '#4285f4' }}>
        <div className="stat-icon gradient-blue"><span className="stat-emoji">📚</span></div>
        <div className="stat-content">
          <div className="stat-value">{stats.myClasses}</div>
          <div className="stat-label">My Classes Today</div>
        </div>
      </div>
      <div className="stat-card clickable" style={{ '--accent-color': '#fbbc04' }} onClick={() => navigate('/notifications')}>
        <div className="stat-icon gradient-yellow"><span className="stat-emoji">🔔</span></div>
        <div className="stat-content">
          <div className="stat-value">{stats.unreadNotifications}</div>
          <div className="stat-label">New Notifications</div>
        </div>
      </div>
    </>
  )

  const renderStudentStats = () => (
    <>
      <div className="stat-card" style={{ '--accent-color': '#4285f4' }}>
        <div className="stat-icon gradient-blue"><span className="stat-emoji">🎓</span></div>
        <div className="stat-content">
          <div className="stat-value">{stats.myRoutineClasses}</div>
          <div className="stat-label">Upcoming Classes</div>
        </div>
      </div>
      <div className="stat-card clickable" style={{ '--accent-color': '#fbbc04' }} onClick={() => navigate('/notifications')}>
        <div className="stat-icon gradient-yellow"><span className="stat-emoji">📍</span></div>
        <div className="stat-content">
          <div className="stat-value">{stats.unreadNotifications}</div>
          <div className="stat-label">Notices</div>
        </div>
      </div>
    </>
  )

  if (loading) return <div className="dashboard-container"><div className="loading">Loading dashboard...</div></div>
  if (error || !stats) return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Dashboard Error</h1>
        <p className="subtitle">{error || 'Could not load dashboard statistics.'}</p>
        <button className="primary-button" style={{ marginTop: '1rem' }} onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}>Return to Login</button>
      </div>
    </div>
  )
  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <div>
          <h1>🎓 Welcome back, {user?.firstName}!</h1>
          <p className="subtitle">Institutional Dashboard • Role: {user?.role}</p>
        </div>
      </div>

      <div className="stats-grid">
        {user?.role === 'ADMIN' || user?.role === 'ACADEMIC_PLANNER' ? renderAdminStats() :
          user?.role === 'FACULTY' ? renderFacultyStats() : renderStudentStats()}
      </div>

      <div className="dashboard-content">
        <div className="section">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="action-grid">
            {(user?.role === 'ADMIN' || user?.role === 'ACADEMIC_PLANNER') && (
              <>
                <button className="action-card" onClick={() => navigate('/optimize')}>
                  <div className="action-icon gradient-blue"><span>🤖</span></div>
                  <div className="action-title">AI Optimize</div>
                </button>
                <button className="action-card" onClick={() => navigate('/reports')}>
                  <div className="action-icon gradient-yellow"><span>📋</span></div>
                  <div className="action-title">Reports</div>
                </button>
              </>
            )}
            <button className="action-card" onClick={() => navigate('/routines')}>
              <div className="action-icon gradient-green"><span>📅</span></div>
              <div className="action-title">View Schedule</div>
            </button>
          </div>
        </div>

        {user?.role === 'ADMIN' && stats?.recentLogs && (
          <div className="section">
            <h2 className="section-title">📜 Recent Audit Logs</h2>
            <div className="activity-card">
              <ul className="activity-list">
                {Array.isArray(stats.recentLogs) && stats.recentLogs.map(log => (
                  <li key={log.id} style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                    <strong>{log.action}</strong> {log.resourceType} - {new Date(log.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
