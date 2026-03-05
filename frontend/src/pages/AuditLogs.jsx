import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Teachers.css';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/v1/audit-logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch audit logs');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading audit logs...</div>;

    return (
        <div className="teachers-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>System Audit Logs</h1>
                    <p>Review system activities, resource changes, and user actions for institutional compliance.</p>
                </div>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Resource</th>
                            <th>Details</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td style={{ fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.user?.firstName} {log.user?.lastName} <br /><small>{log.user?.email}</small></td>
                                <td><span className={`badge action-${log.action.toLowerCase()}`}>{log.action}</span></td>
                                <td>{log.resourceType}</td>
                                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {log.afterState ? <span title={log.afterState}>View Change</span> : 'No Details'}
                                </td>
                                <td>{log.ipAddress}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No audit logs found.</td></tr>}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .action-create { background: rgba(52, 168, 83, 0.1); color: #34a853; }
                .action-update { background: rgba(251, 188, 5, 0.1); color: #fbbc05; }
                .action-delete { background: rgba(234, 67, 53, 0.1); color: #ea4335; }
                .action-login { background: rgba(26, 115, 232, 0.1); color: #1a73e8; }
            `}</style>
        </div>
    );
};

export default AuditLogs;
