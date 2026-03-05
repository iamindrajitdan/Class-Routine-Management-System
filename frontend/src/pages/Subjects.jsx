import axios from 'axios';
import { useTranslation } from '../context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';
import '../styles/Dashboard.css';

const Subjects = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ code: '', name: '', creditHours: 3, programId: '' });
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const [subjRes, progRes] = await Promise.all([
                axios.get('/api/v1/subjects', { headers }),
                axios.get('/api/v1/programs', { headers })
            ]);
            setSubjects(subjRes.data);
            setPrograms(progRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/v1/subjects', {
                ...formData,
                program: { id: formData.programId }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            showToast('Subject saved successfully!', 'success');
            fetchData();
        } catch (error) {
            showToast('Failed to save subject', 'error');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📚 {t('subjects')}</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ {t('addSubject')}</button>
            </div>

            <div className="section">
                <div className="activity-card">
                    {loading ? <p>Loading...</p> : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('code')}</th>
                                    <th>{t('name')}</th>
                                    <th>{t('creditHours')}</th>
                                    <th>{t('program')}</th>
                                    <th>{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map(subj => (
                                    <tr key={subj.id}>
                                        <td><strong>{subj.code}</strong></td>
                                        <td>{subj.name}</td>
                                        <td>{subj.creditHours}</td>
                                        <td>{subj.program?.name}</td>
                                        <td>
                                            <button className="btn-icon">✏️</button>
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
                        <h3>Add New Subject</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Subject Code (e.g. CS101)" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} required />
                            <input type="text" placeholder="Subject Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input type="number" placeholder="Credit Hours" value={formData.creditHours} onChange={e => setFormData({ ...formData, creditHours: e.target.value })} required />
                            <select value={formData.programId} onChange={e => setFormData({ ...formData, programId: e.target.value })} required>
                                <option value="">Select Program</option>
                                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subjects;
