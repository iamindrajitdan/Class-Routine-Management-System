import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Substitutes.css'
import SubstituteModal from '../components/SubstituteModal'

function Substitutes() {
  const [substitutes, setSubstitutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchSubstitutes()
  }, [])

  const fetchSubstitutes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/v1/substitutes', {
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

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this substitute allocation?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/v1/substitutes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubstitutes();
    } catch (err) {
      setError("Failed to remove substitute.");
      console.error(err);
    }
  };

  return (
    <div className="substitutes-container fade-in">
      <div className="page-header">
        <h1>Substitutes</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Allocate Substitute</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        {loading ? (
          <table className="substitutes-table">
            <tbody>
              {Array(5).fill(0).map((_, i) => (
                <tr key={i} className="skeleton-row">
                  <td colSpan="6" className="skeleton-cell"></td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <td>{substitute.substitute?.firstName || 'N/A'}</td>
                  <td>{substitute.substituteDate || 'N/A'}</td>
                  <td>{substitute.reason || 'N/A'}</td>
                  <td>
                    <button className="btn-small btn-danger" onClick={() => handleRemove(substitute.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SubstituteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSubstitutes}
      />
    </div>
  )
}

export default Substitutes
