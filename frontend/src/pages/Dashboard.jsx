import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Dashboard.css'

import StatCard from '../components/StatCard'

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
      <div onClick={() => navigate('/routines')}>
        <StatCard title="Total Routines" value={stats.totalRoutines} icon="📅" color="#4285f4" />
      </div>
      <div onClick={() => navigate('/conflicts')}>
        <StatCard title="Active Conflicts" value={stats.totalConflicts} icon="⚠️" color="#ea4335" />
      </div>
      <div onClick={() => navigate('/teachers')}>
        <StatCard title="Teachers" value={stats.totalTeachers} icon="👨‍🏫" color="#34a853" />
      </div>
      <div onClick={() => navigate('/classes')}>
        <StatCard title="Classes" value={stats.totalClasses} icon="🏫" color="#fbbc04" />
      </div>
    </>
  )

  const renderFacultyStats = () => (
    <>
      <StatCard title="My Classes Today" value={stats.myClasses} icon="📚" color="#4285f4" />
      <div onClick={() => navigate('/notifications')}>
        <StatCard title="Notifications" value={stats.unreadNotifications} icon="🔔" color="#fbbc04" />
      </div>
    </>
  )

  const renderStudentStats = () => (
    <>
      <StatCard title="Upcoming Classes" value={stats.myRoutineClasses} icon="🎓" color="#4285f4" />
      <div onClick={() => navigate('/notifications')}>
        <StatCard title="Notices" value={stats.unreadNotifications} icon="📍" color="#fbbc04" />
      </div>
    </>
  )

  if (loading) return <div className="dashboard-container"><div className="loading">Loading dashboard...</div></div>
  if (error || !stats) return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Dashboard Error</h1>
        <p className="subtitle">{error || 'Could not load dashboard statistics.'}</p>
        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => {
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
