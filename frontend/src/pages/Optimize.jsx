import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Routines.css'; // Reuse routine styles

const Optimize = () => {
    const [loading, setLoading] = useState(true);
    const [optimizing, setOptimizing] = useState(false);
    const [referenceData, setReferenceData] = useState(null);
    const [selectedLessons, setSelectedLessons] = useState([]);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReferenceData();
    }, []);

    const fetchReferenceData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/reference-data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReferenceData(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch reference data');
            setLoading(false);
        }
    };

    const handleToggleLesson = (id) => {
        if (selectedLessons.includes(id)) {
            setSelectedLessons(selectedLessons.filter(l => l !== id));
        } else {
            setSelectedLessons([...selectedLessons, id]);
        }
    };

    const handleOptimize = async () => {
        setOptimizing(true);
        setResults(null);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const request = {
                lessonIds: selectedLessons,
                teacherIds: referenceData.teachers.map(t => t.id),
                classroomIds: referenceData.classrooms.map(c => c.id),
                timeSlotIds: referenceData.timeSlots.map(ts => ts.id),
                softConstraintsEnabled: true
            };

            const response = await axios.post('/api/v1/optimize', request, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setResults(response.data);
            setOptimizing(false);
        } catch (err) {
            setError(err.response?.data?.status === 'INFEASIBLE' ? 'No feasible schedule found with current constraints.' : 'Optimization failed.');
            setOptimizing(false);
        }
    };

    const handleSaveResults = async () => {
        // In a real app, this would iterate and POST each routine
        // For now, let's just simulate or alert
        alert('Saving ' + results.suggestions.length + ' suggested routines...');
        try {
            const token = localStorage.getItem('token');
            for (const suggestion of results.suggestions) {
                await axios.post('/api/v1/routines', suggestion, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            alert('All routines saved successfully!');
            setResults(null);
            setSelectedLessons([]);
        } catch (err) {
            alert('Failed to save routines: ' + err.message);
        }
    };

    if (loading) return <div className="loading">Loading reference data...</div>;

    return (
        <div className="routines-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>AI Optimization</h1>
                    <p>Let the AI suggest the most efficient schedule for your lessons.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleOptimize}
                    disabled={optimizing || selectedLessons.length === 0}
                >
                    {optimizing ? '💡 Optimizing...' : '🤖 Start Optimization'}
                </button>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="optimize-container">
                <div className="selection-panel card">
                    <h3>1. Select Lessons to Schedule</h3>
                    <div className="lesson-grid">
                        {referenceData.lessons.map(lesson => (
                            <div
                                key={lesson.id}
                                className={`lesson-card ${selectedLessons.includes(lesson.id) ? 'selected' : ''}`}
                                onClick={() => handleToggleLesson(lesson.id)}
                            >
                                <div className="lesson-info">
                                    <span className="lesson-title">{lesson.title}</span>
                                    <span className="subject-name">{lesson.subjectName}</span>
                                </div>
                                <div className="checkbox">
                                    {selectedLessons.includes(lesson.id) ? '✅' : '⬜'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {results && (
                    <div className="results-panel card">
                        <div className="results-header">
                            <h3>2. Generated Suggestions</h3>
                            <button className="btn-success" onClick={handleSaveResults}>✅ Apply All</button>
                        </div>
                        <div className="suggestions-list">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Lesson</th>
                                        <th>Teacher</th>
                                        <th>Room</th>
                                        <th>Time Slot</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.suggestions.map((s, idx) => (
                                        <tr key={idx}>
                                            <td>{referenceData.lessons.find(l => l.id === s.lessonId)?.title}</td>
                                            <td>{referenceData.teachers.find(t => t.id === s.teacherId)?.userName}</td>
                                            <td>{referenceData.classrooms.find(r => r.id === s.classroomId)?.code}</td>
                                            <td>{referenceData.timeSlots.find(ts => ts.id === s.timeSlotId)?.dayOfWeek} {referenceData.timeSlots.find(ts => ts.id === s.timeSlotId)?.startTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Optimize;
