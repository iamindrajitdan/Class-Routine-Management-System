import React, { useState } from 'react'
import axios from 'axios'
import '../styles/Login.css'

function Login({ onLogin, darkMode, toggleDarkMode }) {
  const [email, setEmail] = useState('admin@crms.edu')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email,
        password
      })

      const { accessToken, user } = response.data
      onLogin(accessToken, user)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>

      <div className="login-card">
        <div className="login-header">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h1>CRMS</h1>
          <p>Class Routine Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials</p>
          <div className="demo-list">
            <div className="demo-item">
              <span className="demo-role">Admin</span>
              <span className="demo-email">admin@crms.edu</span>
            </div>
            <div className="demo-item">
              <span className="demo-role">Planner</span>
              <span className="demo-email">planner@crms.edu</span>
            </div>
            <div className="demo-item">
              <span className="demo-role">Faculty</span>
              <span className="demo-email">faculty@crms.edu</span>
            </div>
            <div className="demo-item">
              <span className="demo-role">Student</span>
              <span className="demo-email">student@crms.edu</span>
            </div>
          </div>
          <p className="demo-password">Password: password123</p>
        </div>
      </div>
    </div>
  )
}

export default Login
