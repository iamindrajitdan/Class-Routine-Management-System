import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Conflicts.css'

function Conflicts() {
  const [conflicts, setConflicts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchConflicts()
  }, [])

  const fetchConflicts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/v1/conflicts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setConflicts(response.data || [])
    } catch (err) {
      setError('Failed to load conflicts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/v1/conflicts/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchConflicts();
    } catch (err) {
      setError('Failed to resolve conflict');
      console.error(err);
    }
  };

  return (
    <div className="conflicts-container fade-in">
      <div className="page-header">
        <h1>Conflicts</h1>
        <button className="btn-primary" onClick={fetchConflicts}>Refresh</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        {loading ? (
          <table className="conflicts-table">
            <tbody>
              {Array(5).fill(0).map((_, i) => (
                <tr key={i} className="skeleton-row">
                  <td colSpan="6" className="skeleton-cell"></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : conflicts.length === 0 ? (
          <p className="text-muted">No conflicts found</p>
        ) : (
          <table className="conflicts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conflicts.map((conflict) => (
                <tr key={conflict.id}>
                  <td>{conflict.id?.substring(0, 8)}...</td>
                  <td>{conflict.conflictType}</td>
                  <td>{conflict.description}</td>
                  <td><span className={`severity ${conflict.severity?.toLowerCase()}`}>{conflict.severity}</span></td>
                  <td><span className="badge">{conflict.status}</span></td>
                  <td>
                    <button className="btn-small" onClick={() => handleResolve(conflict.id)}>Resolve</button>
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

export default Conflicts
