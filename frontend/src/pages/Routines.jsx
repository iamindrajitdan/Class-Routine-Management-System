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
    <div className="routines-container">
      <div className="page-header">
        <h1>Routines</h1>
        <button className="btn-primary">Create Routine</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        {loading ? (
          <p>Loading routines...</p>
        ) : routines.length === 0 ? (
          <p className="text-muted">No routines found</p>
        ) : (
          <table className="routines-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Class</th>
                <th>Teacher</th>
                <th>Subject</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routines.map((routine) => (
                <tr key={routine.id}>
                  <td>{routine.id?.substring(0, 8)}...</td>
                  <td>{routine.classEntity?.name || 'N/A'}</td>
                  <td>{routine.teacher?.firstName || 'N/A'}</td>
                  <td>{routine.subject?.name || 'N/A'}</td>
                  <td>{routine.timeSlot?.startTime || 'N/A'}</td>
                  <td><span className="badge">{routine.status}</span></td>
                  <td>
                    <button className="btn-small">Edit</button>
                    <button className="btn-small btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Routines
