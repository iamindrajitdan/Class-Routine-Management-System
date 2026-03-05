import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from '../context/LanguageContext'
import './Navbar.css'

function Navbar({ user, onLogout, darkMode, toggleDarkMode }) {
  const location = useLocation()
  const { t, language, changeLanguage } = useTranslation()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/v1/notifications/unread/count', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUnreadCount(response.data)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const isActive = (path) => location.pathname === path
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <defs>
                <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#1a73e8', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#34a853', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="16" height="16" rx="2" fill="url(#brandGradient)" />
              <circle cx="9" cy="9" r="2" fill="white" />
              <rect x="13" y="7" width="4" height="8" fill="white" />
              <circle cx="9" cy="15" r="1.5" fill="white" />
            </svg>
          </div>
          <span>CRMS</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
            <span className="nav-icon">📊</span>
            <span>{t('dashboard')}</span>
          </Link>
          <Link to="/routines" className={`nav-link ${isActive('/routines') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
            <span className="nav-icon">📅</span>
            <span>{t('routines')}</span>
          </Link>

          {/* Academic Dropdown */}
          <div className="nav-dropdown">
            <button className="nav-link dropdown-toggle">
              <span className="nav-icon">🎓</span>
              <span>Academic</span>
              <span className="dropdown-arrow">▾</span>
            </button>
            <div className="dropdown-content">
              <Link to="/teachers" className={`dropdown-item ${isActive('/teachers') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="nav-icon">🧑‍🏫</span>
                <span>{t('teachers')}</span>
              </Link>
              <Link to="/classes" className={`dropdown-item ${isActive('/classes') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="nav-icon">📚</span>
                <span>{t('classes')}</span>
              </Link>
              <Link to="/rooms" className={`dropdown-item ${isActive('/rooms') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="nav-icon">🏢</span>
                <span>{t('rooms')}</span>
              </Link>
              <Link to="/subjects" className={`dropdown-item ${isActive('/subjects') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="nav-icon">📚</span>
                <span>Subjects</span>
              </Link>
              <Link to="/lessons" className={`dropdown-item ${isActive('/lessons') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <span className="nav-icon">📖</span>
                <span>Lessons</span>
              </Link>
            </div>
          </div>

          {/* Management/System Dropdown */}
          {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_ACADEMIC_PLANNER' || user?.role === 'ADMIN' || user?.role === 'ACADEMIC_PLANNER') && (
            <div className="nav-dropdown">
              <button className="nav-link dropdown-toggle">
                <span className="nav-icon">⚙️</span>
                <span>Management</span>
                <span className="dropdown-arrow">▾</span>
              </button>
              <div className="dropdown-content">
                <Link to="/conflicts" className={`dropdown-item ${isActive('/conflicts') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="nav-icon">⚠️</span>
                  <span>Conflicts</span>
                </Link>
                <Link to="/substitutes" className={`dropdown-item ${isActive('/substitutes') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="nav-icon">👥</span>
                  <span>Substitutes</span>
                </Link>
                <Link to="/optimize" className={`dropdown-item ${isActive('/optimize') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="nav-icon">🤖</span>
                  <span>Optimize</span>
                </Link>
                <Link to="/reports" className={`dropdown-item ${isActive('/reports') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="nav-icon">📋</span>
                  <span>Reports</span>
                </Link>
                <Link to="/calendar" className={`dropdown-item ${isActive('/calendar') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="nav-icon">🗓️</span>
                  <span>Calendar</span>
                </Link>
                <Link to="/holidays" className={`dropdown-item ${isActive('/holidays') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="nav-icon">🗓️</span>
                  <span>Continuity</span>
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/audit-logs" className={`dropdown-item ${isActive('/audit-logs') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    <span className="nav-icon">📜</span>
                    <span>Audit Logs</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="nav-dropdown">
            <button className="nav-link dropdown-toggle">
              <span className="nav-icon">➕</span>
              <span>Self Service</span>
              <span className="dropdown-arrow">▾</span>
            </button>
            <div className="dropdown-content">
              {user && (
                <Link to="/supplementary" className={`dropdown-item ${isActive('/supplementary') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="nav-icon">📚</span>
                  <span>Supplementary</span>
                </Link>
              )}
              {user && (user?.role === 'FACULTY' || user?.role === 'ROLE_FACULTY') && (
                <Link to="/availability" className={`dropdown-item ${isActive('/availability') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="nav-icon">⏰</span>
                  <span>Availability</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="navbar-actions">
          <Link to="/notifications" className={`notification-bell ${unreadCount > 0 ? 'has-unread' : ''}`} title={t('notifications')}>
            <span className="bell-icon">🔔</span>
            {unreadCount > 0 && <span className="unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </Link>
          <button
            className={`theme-toggle-btn ${darkMode ? 'active' : ''}`}
            onClick={toggleDarkMode}
            title={darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            aria-label="Toggle dark mode"
          >
            <span className="toggle-icon light-icon">☀️</span>
            <span className="toggle-icon dark-icon">🌙</span>
            <span className="toggle-slider"></span>
          </button>

          <div className="user-menu">
            <div className="user-avatar">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>

          <button className="btn-logout" onClick={onLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {t('logout')}
          </button>

          <div className="language-selector">
            <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>

          <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
