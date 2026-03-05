import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '../context/LanguageContext';
import '../styles/Dashboard.css';

const Notifications = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/v1/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/v1/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>🔔 {t('notifications')}</h1>
            </div>

            <div className="section">
                <div className="activity-card">
                    {loading ? <p>Loading...</p> : (
                        <div className="notification-list">
                            {notifications.length === 0 ? (
                                <p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>No notifications found.</p>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}>
                                        <div className="notification-content">
                                            <div className="notification-title">
                                                <strong>{notif.title}</strong>
                                                {!notif.isRead && <span className="unread-dot"></span>}
                                            </div>
                                            <p>{notif.message}</p>
                                            <small>{new Date(notif.createdAt).toLocaleString()}</small>
                                        </div>
                                        <div className="notification-actions">
                                            {!notif.isRead && (
                                                <button className="btn-icon" onClick={() => markAsRead(notif.id)} title="Mark as Read">✔️</button>
                                            )}
                                            <button className="btn-icon delete" onClick={() => deleteNotification(notif.id)} title="Delete">🗑️</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
