import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar({ user, onLogout, darkMode, toggleDarkMode }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <defs>
                <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#1a73e8', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#34a853', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="16" height="16" rx="2" fill="url(#brandGradient)"/>
              <circle cx="9" cy="9" r="2" fill="white"/>
              <rect x="13" y="7" width="4" height="8" fill="white"/>
              <circle cx="9" cy="15" r="1.5" fill="white"/>
            </svg>
          </div>
          <span>CRMS</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/routines" className={`nav-link ${isActive('/routines') ? 'active' : ''}`}>
            <span className="nav-icon">📅</span>
            <span>Routines</span>
          </Link>
          <Link to="/conflicts" className={`nav-link ${isActive('/conflicts') ? 'active' : ''}`}>
            <span className="nav-icon">⚠️</span>
            <span>Conflicts</span>
          </Link>
          <Link to="/substitutes" className={`nav-link ${isActive('/substitutes') ? 'active' : ''}`}>
            <span className="nav-icon">👥</span>
            <span>Substitutes</span>
          </Link>
        </div>

        <div className="navbar-actions">
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
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
