import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const AvailabilitySettings = ({ user }) => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [availRes, slotRes] = await Promise.all([
                axios.get('/api/v1/faculty/availability', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/v1/timeslots', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setAvailability(availRes.data);
            setTimeSlots(slotRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const toggleAvailability = async (day, slotId) => {
        try {
            const token = localStorage.getItem('token');
            const existing = availability.find(a => a.dayOfWeek === day && a.timeSlot.id === slotId);

            if (existing) {
                await axios.delete(`/api/v1/faculty/availability/${existing.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/v1/faculty/availability', {
                    dayOfWeek: day,
                    timeSlot: { id: slotId },
                    isPreferred: true
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchData();
        } catch (error) {
            alert('Update failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>⏰ My Availability</h1>
                <p>Select the slots where you are available to teach.</p>
            </div>

            <div className="section">
                <div className="activity-card" style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Time Slot</th>
                                {days.map(day => <th key={day}>{day}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map(slot => (
                                <tr key={slot.id}>
                                    <td><strong>{slot.startTime} - {slot.endTime}</strong></td>
                                    {days.map(day => {
                                        const isAvailable = availability.some(a => a.dayOfWeek === day && a.timeSlot.id === slot.id);
                                        return (
                                            <td key={day}
                                                onClick={() => toggleAvailability(day, slot.id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: isAvailable ? 'rgba(52, 168, 83, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                                                    textAlign: 'center'
                                                }}>
                                                {isAvailable ? '✅' : '❌'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AvailabilitySettings;
