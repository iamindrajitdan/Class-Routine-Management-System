import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Teachers.css';

const Calendar = () => {
    const [holidays, setHolidays] = useState([]);
    const [examPeriods, setExamPeriods] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('timelines');

    useEffect(() => {
        fetchCalendarData();
    }, []);

    const fetchCalendarData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [holidaysRes, examsRes, ayRes, semRes] = await Promise.all([
                axios.get('/api/v1/calendar/holidays', { headers }),
                axios.get('/api/v1/calendar/exam-periods', { headers }),
                axios.get('/api/v1/calendar/academic-years', { headers }),
                axios.get('/api/v1/calendar/semesters', { headers })
            ]);

            setHolidays(holidaysRes.data);
            setExamPeriods(examsRes.data);
            setAcademicYears(ayRes.data);
            setSemesters(semRes.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch calendar data');
            setLoading(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            const token = localStorage.getItem('token');
            const endpoint = `/api/v1/calendar/${type === 'academic-year' ? 'academic-years' : type === 'semester' ? 'semesters' : type + 's'}/${id}`;
            await axios.delete(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCalendarData();
        } catch (err) {
            alert(`Failed to delete ${type}`);
        }
    };

    if (loading) return <div className="loading">Loading calendar...</div>;

    const renderTimelines = () => (
        <div className="card">
            <div className="card-header">
                <h3>Academic Years & Semesters</h3>
            </div>
            <div style={{ padding: '1rem' }}>
                <h4>Academic Years</h4>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Range</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {academicYears.map(ay => (
                            <tr key={ay.id}>
                                <td><strong>{ay.name}</strong></td>
                                <td>{ay.startDate} to {ay.endDate}</td>
                                <td><span className={`badge ${ay.isActive ? 'badge-active' : ''}`}>{ay.isActive ? 'Active' : 'Inactive'}</span></td>
                                <td>
                                    <button className="btn-icon delete" onClick={() => handleDelete('academic-year', ay.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h4 style={{ marginTop: '2rem' }}>Semesters</h4>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Term</th>
                            <th>Range</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {semesters.map(sem => (
                            <tr key={sem.id}>
                                <td>{sem.academicYear?.name}</td>
                                <td><strong>{sem.type}</strong></td>
                                <td>{sem.startDate} to {sem.endDate}</td>
                                <td><span className={`badge ${sem.isActive ? 'badge-active' : ''}`}>{sem.isActive ? 'Active' : 'Inactive'}</span></td>
                                <td>
                                    <button className="btn-icon delete" onClick={() => handleDelete('semester', sem.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderHolidays = () => (
        <div className="card">
            <div className="card-header">
                <h3>Upcoming Holidays</h3>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {holidays.map(holiday => (
                        <tr key={holiday.id}>
                            <td>{holiday.holidayDate}</td>
                            <td><strong>{holiday.name}</strong></td>
                            <td><span className={`badge badge-${holiday.type.toLowerCase()}`}>{holiday.type}</span></td>
                            <td>{holiday.description}</td>
                            <td>
                                <button className="btn-icon delete" onClick={() => handleDelete('holiday', holiday.id)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderExams = () => (
        <div className="card">
            <div className="card-header">
                <h3>Exam Periods</h3>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Range</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {examPeriods.map(exam => (
                        <tr key={exam.id}>
                            <td>{exam.startDate} to {exam.endDate}</td>
                            <td><strong>{exam.name}</strong></td>
                            <td><span className="badge">{exam.type}</span></td>
                            <td>{exam.description}</td>
                            <td>
                                <button className="btn-icon delete" onClick={() => handleDelete('exam-period', exam.id)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="teachers-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>Institutional Calendar</h1>
                    <p>Academic years, semesters, holidays, and exam periods.</p>
                </div>
                <div className="tab-switcher card" style={{ padding: '0.5rem', display: 'flex', gap: '1rem', border: 'none' }}>
                    <button className={`btn-tab ${activeTab === 'timelines' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('timelines')}> Timelines </button>
                    <button className={`btn-tab ${activeTab === 'holidays' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('holidays')}> Holidays </button>
                    <button className={`btn-tab ${activeTab === 'exams' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('exams')}> Exams </button>
                </div>
            </div>

            {activeTab === 'timelines' ? renderTimelines() :
                activeTab === 'holidays' ? renderHolidays() : renderExams()}
        </div>
    );
};

export default Calendar;
