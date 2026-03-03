import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Routines.css'

function Routines() {
  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRoutines()
  }, [])

  const fetchRoutines = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8080/api/v1/routines', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRoutines(response.data || [])
    } catch (err) {
      setError('Failed to load routines')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="routines-container fade-in">
      <div className="page-header">
        <h1>Class Routines</h1>
        <button className="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Routine
        </button>
      </div>

      {loading ? (
        <div className="routines-grid">
          {Array(4).fill(0).map((_, idx) => (
            <div key={idx} className="routine-card skeleton"></div>
          ))}
        </div>
      ) : routines.length === 0 ? (
        <div className="empty-state-card">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h3>No routines found</h3>
          <p>Create your first routine to get started</p>
          <button className="btn-primary">Create Routine</button>
        </div>
      ) : (
        <div className="routines-grid">
          {routines.map((routine) => (
            <div key={routine.id} className="routine-card">
              <div className="routine-header">
                <h3>{routine.name || 'Untitled Routine'}</h3>
                <span className={`status-badge status-${routine.status?.toLowerCase()}`}>
                  {routine.status}
                </span>
              </div>
              <div className="routine-details">
                <div className="detail-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <span>{routine.classEntity?.name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>{routine.teacher?.firstName} {routine.teacher?.lastName}</span>
                </div>
                <div className="detail-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <span>{routine.subject?.name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{routine.timeSlot?.dayOfWeek} {routine.timeSlot?.startTime}</span>
                </div>
                <div className="detail-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                  </svg>
                  <span>{routine.classroom?.name || 'N/A'}</span>
                </div>
              </div>
              <div className="routine-actions">
                <button className="btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
                <button className="btn-danger">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Routines
