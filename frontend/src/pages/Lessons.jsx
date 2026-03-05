import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const Lessons = () => {
    const [lessons, setLessons] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ subjectId: '', type: 'THEORY', durationMinutes: 60 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const [lessRes, subjRes] = await Promise.all([
                axios.get('/api/v1/lessons', { headers }),
                axios.get('/api/v1/subjects', { headers })
            ]);
            setLessons(lessRes.data);
            setSubjects(subjRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/v1/lessons', {
                ...formData,
                subject: { id: formData.subjectId }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            showToast('Lesson mapping saved!', 'success');
            fetchData();
        } catch (error) {
            showToast('Failed to save lesson', 'error');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📖 Lesson Mapping</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Map Lesson</button>
            </div>

            <div className="section">
                <div className="activity-card">
                    {loading ? <p>Loading...</p> : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Type</th>
                                    <th>Duration</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lessons.map(lesson => (
                                    <tr key={lesson.id}>
                                        <td><strong>{lesson.subject?.code}</strong> - {lesson.subject?.name}</td>
                                        <td><span className={`badge ${lesson.type.toLowerCase()}`}>{lesson.type}</span></td>
                                        <td>{lesson.durationMinutes} mins</td>
                                        <td>
                                            <button className="btn-icon delete">🗑️</button>
                                        </td>
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
                        <h3>Map Lesson to Subject</h3>
                        <form onSubmit={handleSubmit}>
                            <select value={formData.subjectId} onChange={e => setFormData({ ...formData, subjectId: e.target.value })} required>
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                            </select>
                            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option value="THEORY">Theory</option>
                                <option value="LAB">Laboratory</option>
                                <option value="SEMINAR">Seminar</option>
                            </select>
                            <input type="number" placeholder="Duration (minutes)" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: e.target.value })} required />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Mapping</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lessons;
