import React from 'react'
import './StatCard.css'

function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card" style={{ '--accent-color': color }}>
      <div className="stat-icon" style={{ backgroundColor: color + '20', color: color }}>
        <span className="stat-emoji">{icon}</span>
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>
  )
}

export default StatCard
