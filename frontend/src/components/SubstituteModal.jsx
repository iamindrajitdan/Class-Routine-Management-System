import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Modal.css';

const SubstituteModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        routineId: '',
        substituteTeacherId: '',
        substituteDate: '',
        reason: ''
    });

    const [routines, setRoutines] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            // We can use the reference data for teachers
            const refResponse = await axios.get('/api/v1/reference-data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeachers(refResponse.data.teachers || []);

            // Fetch routines
            const routineResponse = await axios.get('/api/v1/routines', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoutines(routineResponse.data || []);
        } catch (err) {
            setError('Failed to load form data');
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            await axios.post('/api/v1/substitutes', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onSuccess();
            onClose();
        } catch (err) {
            if (err.response && err.response.data && typeof err.response.data === 'string') {
                setError(err.response.data);
            } else {
                setError('Failed to allocate substitute. The teacher might have a conflict.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Allocate Substitute</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group row">
                        <div className="col">
                            <label>Routine to Substitute</label>
                            <select name="routineId" value={formData.routineId} onChange={handleChange} required>
                                <option value="">Select a routine...</option>
                                {routines.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.subject?.name} - {r.classEntity?.name} ({r.timeSlot?.dayOfWeek} {r.timeSlot?.startTime})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="col">
                            <label>Substitute Teacher</label>
                            <select name="substituteTeacherId" value={formData.substituteTeacherId} onChange={handleChange} required>
                                <option value="">Select a teacher...</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.code})</option>
                                ))}
                            </select>
                        </div>
                        <div className="col">
                            <label>Substitute Date</label>
                            <input type="date" name="substituteDate" value={formData.substituteDate} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Reason</label>
                        <input type="text" name="reason" value={formData.reason} onChange={handleChange} placeholder="e.g. Medical Leave" />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Allocate Substitute'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubstituteModal;
