import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Routines from './pages/Routines'
import Conflicts from './pages/Conflicts'
import Substitutes from './pages/Substitutes'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    const savedTheme = localStorage.getItem('theme')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }

    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
    
    setLoading(false)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light')
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
  }

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      <MainContent
        isAuthenticated={isAuthenticated}
        handleLogin={handleLogin}
        user={user}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </Router>
  )
}

function MainContent({ isAuthenticated, handleLogin, user, darkMode, toggleDarkMode }) {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-content fade-in">
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/routines" 
          element={isAuthenticated ? <Routines /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/conflicts" 
          element={isAuthenticated ? <Conflicts /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/substitutes" 
          element={isAuthenticated ? <Substitutes /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  )
}

export default App
