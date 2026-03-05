import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Modal.css'

function TeacherModal({ isOpen, onClose, onSave, users }) {
    const [formData, setFormData] = useState({
        code: '',
        userId: '',
        specialization: '',
        isAvailable: true
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const token = localStorage.getItem('token')
            const headers = { Authorization: `Bearer ${token}` }

            const payload = {
                code: formData.code,
                user: { id: formData.userId },
                specialization: formData.specialization,
                isAvailable: formData.isAvailable
            }

            await axios.post('/api/v1/teachers', payload, { headers })
            onSave()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save teacher')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Teacher</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Teacher Code</label>
                        <input
                            type="text"
                            placeholder="e.g. T001"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Link to User Account</label>
                        <select
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            required
                        >
                            <option value="">Select User</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Specialization</label>
                        <input
                            type="text"
                            placeholder="e.g. Computer Science"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Add Teacher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TeacherModal
