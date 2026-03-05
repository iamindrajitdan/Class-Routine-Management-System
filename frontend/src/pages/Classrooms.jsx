import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ClassroomModal from '../components/ClassroomModal'
import '../styles/Dashboard.css' // Reusing dashboard/card styles

function Classrooms() {
    const [classrooms, setClassrooms] = useState([])
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
            setClassrooms(response.data.classrooms || [])
            setLoading(false)
        } catch (err) {
            console.error('Error fetching data:', err)
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this classroom?')) return

        try {
            const token = localStorage.getItem('token')
            const headers = { Authorization: `Bearer ${token}` }
            await axios.delete(`/api/v1/classrooms/${id}`, { headers })
            fetchData()
        } catch (err) {
            alert('Failed to delete classroom')
        }
    }

    return (
        <div className="dashboard-container fade-in">
            <div className="page-header">
                <div>
                    <h1>🏢 Classrooms</h1>
                    <p className="subtitle">Manage physical room allocations</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <span>➕</span> Add Classroom
                </button>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="routine-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Building</th>
                                <th>Capacity</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5">Loading classrooms...</td></tr>
                            ) : classrooms.length === 0 ? (
                                <tr><td colSpan="5">No classrooms found.</td></tr>
                            ) : (
                                classrooms.map((room) => (
                                    <tr key={room.id}>
                                        <td><strong>{room.code}</strong></td>
                                        <td>{room.name}</td> {/* In record, name is "Building Floor" */}
                                        <td>{room.capacity}</td>
                                        <td><span className="badge">{room.type || 'Lecture'}</span></td>
                                        <td>
                                            <button className="btn-icon delete" onClick={() => handleDelete(room.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ClassroomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchData}
            />
        </div>
    )
}

export default Classrooms
