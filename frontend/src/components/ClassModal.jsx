import React, { useState } from 'react'
import axios from 'axios'
import '../styles/Modal.css'

function ClassModal({ isOpen, onClose, onSave, programs }) {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        semester: 1,
        academicYear: '2023-2024',
        capacity: 40,
        programId: ''
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
                name: formData.name,
                semester: parseInt(formData.semester),
                academicYear: formData.academicYear,
                capacity: parseInt(formData.capacity),
                program: { id: formData.programId }
            }

            await axios.post('/api/v1/classes', payload, { headers })
            onSave()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save class')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Class</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Class Code</label>
                            <input
                                type="text"
                                placeholder="e.g. CS-2024-A"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Class Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Computer Science Section A"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Semester</label>
                            <input
                                type="number"
                                min="1"
                                max="8"
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Academic Year</label>
                            <input
                                type="text"
                                placeholder="2023-2024"
                                value={formData.academicYear}
                                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Capacity</label>
                            <input
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Program</label>
                            <select
                                value={formData.programId}
                                onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                                required
                            >
                                <option value="">Select Program</option>
                                {programs.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Add Class'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClassModal
