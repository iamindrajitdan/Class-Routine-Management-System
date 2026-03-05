import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TeacherModal from '../components/TeacherModal'
import '../styles/Teachers.css'

function Teachers() {
    const [teachers, setTeachers] = useState([])
    const [users, setUsers] = useState([])
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
            setTeachers(Array.isArray(response.data.teachers) ? response.data.teachers : [])
            setUsers(Array.isArray(response.data.users) ? response.data.users : [])
            setLoading(false)
        } catch (err) {
            console.error('Error fetching data:', err)
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) return

        try {
            const token = localStorage.getItem('token')
            const headers = { Authorization: `Bearer ${token}` }
            await axios.delete(`/api/v1/teachers/${id}`, { headers })
            fetchData()
        } catch (err) {
            alert('Failed to delete teacher')
        }
    }

    return (
        <div className="teachers-container fade-in">
            <div className="page-header">
                <div>
                    <h1>👨‍🏫 Teachers</h1>
                    <p className="subtitle">Manage faculty members and their specialties</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <span>➕</span> Add Teacher
                </button>
            </div>

            <div className="teachers-grid">
                {loading ? (
                    <div className="loading-state">Loading teachers...</div>
                ) : teachers.length === 0 ? (
                    <div className="empty-state">No teachers found. Add your first teacher!</div>
                ) : (
                    (Array.isArray(teachers) ? teachers : []).map((teacher) => (
                        <div key={teacher.id} className="teacher-card">
                            <div className="teacher-avatar">
                                {teacher.firstName?.charAt(0) || 'T'}{teacher.lastName?.charAt(0) || ''}
                            </div>
                            <div className="teacher-info">
                                <h3>{teacher.firstName} {teacher.lastName}</h3>
                                <p className="teacher-code">Code: {teacher.code}</p>
                                <div className="teacher-actions">
                                    <button className="btn-icon delete" onClick={() => handleDelete(teacher.id)} title="Delete Teacher">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <TeacherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchData}
                users={users}
            />
        </div>
    )
}

export default Teachers
