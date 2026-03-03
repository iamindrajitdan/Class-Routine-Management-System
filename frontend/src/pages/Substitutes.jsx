import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Substitutes.css'

function Substitutes() {
  const [substitutes, setSubstitutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubstitutes()
  }, [])

  const fetchSubstitutes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8080/api/v1/substitutes', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSubstitutes(response.data || [])
    } catch (err) {
      setError('Failed to load substitutes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="substitutes-container">
      <div className="page-header">
        <h1>Substitutes</h1>
        <button className="btn-primary">Allocate Substitute</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        {loading ? (
          <p>Loading substitutes...</p>
        ) : substitutes.length === 0 ? (
          <p className="text-muted">No substitutes found</p>
        ) : (
          <table className="substitutes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Original Teacher</th>
                <th>Substitute Teacher</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {substitutes.map((substitute) => (
                <tr key={substitute.id}>
                  <td>{substitute.id?.substring(0, 8)}...</td>
                  <td>{substitute.originalTeacher?.firstName || 'N/A'}</td>
                  <td>{substitute.substituteTeacher?.firstName || 'N/A'}</td>
                  <td>{substitute.substituteDate || 'N/A'}</td>
                  <td>{substitute.reason || 'N/A'}</td>
                  <td>
                    <button className="btn-small">Edit</button>
                    <button className="btn-small btn-danger">Remove</button>
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

export default Substitutes
