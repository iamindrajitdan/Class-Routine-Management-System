import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const SupplementaryClasses = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'ADDITIONAL',
        subjectId: '',
        teacherId: '',
        classroomId: '',
        timeSlotId: '',
        description: ''
    });

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/supplementary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSessions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/v1/supplementary', {
                ...formData,
                subject: { id: formData.subjectId },
                teacher: { id: formData.teacherId },
                classroom: { id: formData.classroomId },
                timeSlot: { id: formData.timeSlotId }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            fetchSessions();
        } catch (error) {
            alert('Scheduling failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📚 Supplementary Instruction</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Schedule Session</button>
            </div>

            <div className="stats-grid">
                <div className="stat-card" style={{ '--accent-color': '#4285f4' }}>
                    <div className="stat-value">{sessions.filter(s => s.type === 'ADDITIONAL').length}</div>
                    <div className="stat-label">Additional Classes</div>
                </div>
                <div className="stat-card" style={{ '--accent-color': '#ea4335' }}>
                    <div className="stat-value">{sessions.filter(s => s.type === 'REMEDIAL').length}</div>
                    <div className="stat-label">Remedial Classes</div>
                </div>
            </div>

            <div className="section">
                <h2 className="section-title">Class Schedule</h2>
                <div className="activity-card">
                    {loading ? <p>Loading...</p> : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Subject</th>
                                    <th>Teacher</th>
                                    <th>Time Slot</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map(session => (
                                    <tr key={session.id}>
                                        <td><span className={`badge ${session.type.toLowerCase()}`}>{session.type}</span></td>
                                        <td>{session.subject.name}</td>
                                        <td>{session.teacher.user.firstName}</td>
                                        <td>{session.timeSlot.dayOfWeek} {session.timeSlot.startTime}</td>
                                        <td>Active</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Schedule New Session</h3>
                        <form onSubmit={handleSubmit}>
                            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option value="ADDITIONAL">Additional Class</option>
                                <option value="REMEDIAL">Remedial Class</option>
                            </select>
                            <input type="text" placeholder="Subject ID" value={formData.subjectId} onChange={e => setFormData({ ...formData, subjectId: e.target.value })} required />
                            <input type="text" placeholder="Teacher ID" value={formData.teacherId} onChange={e => setFormData({ ...formData, teacherId: e.target.value })} required />
                            <input type="text" placeholder="Classroom ID" value={formData.classroomId} onChange={e => setFormData({ ...formData, classroomId: e.target.value })} required />
                            <input type="text" placeholder="TimeSlot ID" value={formData.timeSlotId} onChange={e => setFormData({ ...formData, timeSlotId: e.target.value })} required />
                            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplementaryClasses;
