import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css'; // Reuse dashboard styles

const Reports = () => {
    const [downloading, setDownloading] = useState(null);

    const handleDownload = async (format) => {
        setDownloading(format);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/v1/reports/${format}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `routine_report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setDownloading(null);
        } catch (err) {
            alert('Failed to download report: ' + err.message);
            setDownloading(null);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="page-header">
                <div className="header-content">
                    <h1>Institutional Reports</h1>
                    <p>Export class routines and schedules to document formats.</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(234, 67, 53, 0.1)', color: '#ea4335' }}>
                        📄
                    </div>
                    <div className="stat-info">
                        <h3>Full Schedule (PDF)</h3>
                        <p>Comprehensive report of all routines in PDF format.</p>
                        <button
                            className="btn-primary"
                            style={{ marginTop: '1rem', backgroundColor: '#ea4335' }}
                            onClick={() => handleDownload('pdf')}
                            disabled={downloading === 'pdf'}
                        >
                            {downloading === 'pdf' ? '⌛ Downloading...' : '⬇️ Download PDF'}
                        </button>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(52, 168, 83, 0.1)', color: '#34a853' }}>
                        📊
                    </div>
                    <div className="stat-info">
                        <h3>Routine Data (Excel)</h3>
                        <p>Export routine data for analysis and institutional processing.</p>
                        <button
                            className="btn-primary"
                            style={{ marginTop: '1rem', backgroundColor: '#34a853' }}
                            onClick={() => handleDownload('excel')}
                            disabled={downloading === 'excel'}
                        >
                            {downloading === 'excel' ? '⌛ Downloading...' : '⬇️ Download Excel'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Report Generation Settings</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Reports are generated based on current active routines. Ensure all optimizations are applied and conflicts resolved before final report generation.
                </p>
            </div>
        </div>
    );
};

export default Reports;
