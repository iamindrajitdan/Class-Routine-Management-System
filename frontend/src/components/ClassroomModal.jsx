import React, { useState } from 'react'
import axios from 'axios'
import '../styles/Modal.css'

function ClassroomModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        code: '',
        building: '',
        floor: '',
        capacity: 30,
        type: 'Lecture Hall'
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

            await axios.post('/api/v1/classrooms', formData, { headers })
            onSave()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save classroom')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Classroom</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Room Code</label>
                        <input
                            type="text"
                            placeholder="e.g. R101"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Building</label>
                            <input
                                type="text"
                                placeholder="e.g. Science Block"
                                value={formData.building}
                                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Floor</label>
                            <input
                                type="text"
                                placeholder="e.g. 1st Floor"
                                value={formData.floor}
                                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
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
                            <label>Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Lecture Hall">Lecture Hall</option>
                                <option value="Lab">Lab</option>
                                <option value="Seminar Room">Seminar Room</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Add Classroom'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClassroomModal
