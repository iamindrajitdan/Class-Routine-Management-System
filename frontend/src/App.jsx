import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Routines from './pages/Routines'
import Conflicts from './pages/Conflicts'
import Substitutes from './pages/Substitutes'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Classrooms from './pages/Classrooms'
import Optimize from './pages/Optimize'
import Reports from './pages/Reports'
import Calendar from './pages/Calendar'
import AuditLogs from './pages/AuditLogs'
import SupplementaryClasses from './pages/SupplementaryClasses'
import AvailabilitySettings from './pages/AvailabilitySettings'
import Subjects from './pages/Subjects'
import Lessons from './pages/Lessons'
import Notifications from './pages/Notifications'
import Holidays from './pages/Holidays'
import Navbar from './components/Navbar'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider } from './components/Toast'
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
      try {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
        localStorage.clear()
        setIsAuthenticated(false)
        setUser(null)
      }
    }

    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }

    setLoading(false)

    // Global Axios Interceptor for Auth Errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          handleLogout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
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
    <LanguageProvider>
      <ToastProvider>
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
      </ToastProvider>
    </LanguageProvider>
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
        <Route
          path="/teachers"
          element={isAuthenticated ? <Teachers /> : <Navigate to="/login" />}
        />
        <Route
          path="/classes"
          element={isAuthenticated ? <Classes /> : <Navigate to="/login" />}
        />
        <Route
          path="/rooms"
          element={isAuthenticated ? <Classrooms /> : <Navigate to="/login" />}
        />
        <Route
          path="/optimize"
          element={isAuthenticated ? <Optimize /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
        />
        <Route
          path="/calendar"
          element={isAuthenticated ? <Calendar /> : <Navigate to="/login" />}
        />
        <Route
          path="/audit-logs"
          element={isAuthenticated && user?.role === 'ADMIN' ? <AuditLogs /> : <Navigate to="/" />}
        />
        <Route
          path="/supplementary"
          element={isAuthenticated ? <SupplementaryClasses /> : <Navigate to="/login" />}
        />
        <Route
          path="/availability"
          element={isAuthenticated && user?.role === 'FACULTY' ? <AvailabilitySettings /> : <Navigate to="/" />}
        />
        <Route
          path="/subjects"
          element={isAuthenticated ? <Subjects /> : <Navigate to="/login" />}
        />
        <Route
          path="/lessons"
          element={isAuthenticated ? <Lessons /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />}
        />
        <Route
          path="/holidays"
          element={isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'ACADEMIC_PLANNER') ? <Holidays /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </div>
  )
}

export default App
