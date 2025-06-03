import React from 'react';
import PropTypes from 'prop-types';
import "../styles/main.css"; // Make sure styles are properly linked

const DashboardStatsCard = ({ title = "Dashboard", value = "120", icon = "📊" }) => (
    <div className="stats-card">
        <div className="stats-icon">{icon}</div>
        <div className="stats-content">
            <h4>{title}</h4>
            <p>{value}</p>
        </div>
    </div>
);

// Optional: Prop validation
DashboardStatsCard.propTypes = {
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.string,
};

export default DashboardStatsCard;
