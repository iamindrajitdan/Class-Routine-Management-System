import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ClassModal from '../components/ClassModal'
import '../styles/Classes.css'

function Classes() {
    const [classes, setClasses] = useState([])
    const [programs, setPrograms] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token')
            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.get('/api/v1/reference-data', { headers })
            setClasses(Array.isArray(response.data.classes) ? response.data.classes : [])
            setPrograms(Array.isArray(response.data.programs) ? response.data.programs : [])
            setLoading(false)
        } catch (err) {
            console.error('Error fetching data:', err)
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this class?')) return

        try {
            const token = localStorage.getItem('token')
            const headers = { Authorization: `Bearer ${token}` }
            await axios.delete(`/api/v1/classes/${id}`, { headers })
            fetchData()
        } catch (err) {
            alert('Failed to delete class')
        }
    }

    return (
        <div className="classes-container fade-in">
            <div className="page-header">
                <div>
                    <h1>🏫 Classes</h1>
                    <p className="subtitle">Manage sections and student cohorts</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <span>➕</span> Add Class
                </button>
            </div>

            <div className="classes-grid">
                {loading ? (
                    <div className="loading-state">Loading classes...</div>
                ) : classes.length === 0 ? (
                    <div className="empty-state">No classes found. Add your first class!</div>
                ) : (
                    (Array.isArray(classes) ? classes : []).map((cls) => (
                        <div key={cls.id} className="class-card">
                            <div className="class-icon">📅</div>
                            <div className="class-info">
                                <h3>{cls.name}</h3>
                                <p className="class-code">{cls.code}</p>
                                <div className="class-actions">
                                    <button className="btn-icon delete" onClick={() => handleDelete(cls.id)} title="Delete Class">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ClassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchData}
                programs={programs}
            />
        </div>
    )
}

export default Classes
