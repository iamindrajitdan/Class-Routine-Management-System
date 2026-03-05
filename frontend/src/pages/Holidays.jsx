import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '../context/LanguageContext';
import { useToast } from '../components/Toast';
import '../styles/Dashboard.css';

const HolidaysManagement = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [holidays, setHolidays] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHolidayModal, setShowHolidayModal] = useState(false);
    const [showExamModal, setShowExamModal] = useState(false);

    const [holidayForm, setHolidayForm] = useState({ name: '', holidayDate: '', description: '' });
    const [examForm, setExamForm] = useState({ name: '', startDate: '', endDate: '', description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const [holRes, exRes] = await Promise.all([
                axios.get('/api/v1/calendar/holidays', { headers }),
                axios.get('/api/v1/calendar/exam-periods', { headers })
            ]);
            setHolidays(holRes.data);
            setExams(exRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching continuity data:', error);
            setLoading(false);
        }
    };

    const handleHolidaySubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/v1/calendar/holidays', holidayForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('Holiday scheduled successfully', 'success');
            setShowHolidayModal(false);
            fetchData();
        } catch (error) {
            showToast('Failed to schedule holiday', 'error');
        }
    };

    const handleExamSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/v1/calendar/exam-periods', examForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('Exam period scheduled successfully', 'success');
            setShowExamModal(false);
            fetchData();
        } catch (error) {
            showToast('Failed to schedule exam period', 'error');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>🗓️ Institutional Continuity</h1>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => setShowHolidayModal(true)}>+ Schedule Holiday</button>
                    <button className="btn-secondary" onClick={() => setShowExamModal(true)}>+ Schedule Exams</button>
                </div>
            </div>

            <div className="grid grid-2">
                <div className="section">
                    <h3>🌴 Holidays</h3>
                    <div className="activity-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holidays.map(h => (
                                    <tr key={h.id}>
                                        <td><strong>{h.name}</strong></td>
                                        <td>{h.holidayDate}</td>
                                        <td><span className="badge theory">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="section">
                    <h3>📝 Exam Periods</h3>
                    <div className="activity-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Start</th>
                                    <th>End</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map(e => (
                                    <tr key={e.id}>
                                        <td><strong>{e.name}</strong></td>
                                        <td>{e.startDate}</td>
                                        <td>{e.endDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showHolidayModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Schedule Institutional Holiday</h3>
                        <form onSubmit={handleHolidaySubmit}>
                            <input type="text" placeholder="Holiday name" value={holidayForm.name} onChange={e => setHolidayForm({ ...holidayForm, name: e.target.value })} required />
                            <input type="date" value={holidayForm.holidayDate} onChange={e => setHolidayForm({ ...holidayForm, holidayDate: e.target.value })} required />
                            <textarea placeholder="Description" value={holidayForm.description} onChange={e => setHolidayForm({ ...holidayForm, description: e.target.value })} />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowHolidayModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showExamModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Schedule Exam Period</h3>
                        <form onSubmit={handleExamSubmit}>
                            <input type="text" placeholder="Exam period name" value={examForm.name} onChange={e => setExamForm({ ...examForm, name: e.target.value })} required />
                            <div className="grid grid-2">
                                <input type="date" value={examForm.startDate} onChange={e => setExamForm({ ...examForm, startDate: e.target.value })} required />
                                <input type="date" value={examForm.endDate} onChange={e => setExamForm({ ...examForm, endDate: e.target.value })} required />
                            </div>
                            <textarea placeholder="Description" value={examForm.description} onChange={e => setExamForm({ ...examForm, description: e.target.value })} />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowExamModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HolidaysManagement;
