import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
    return (
        <div className="sidebar">
            <h3>🍴 Restaurant</h3>
            <nav>
                <Link to="/dashboard">Dashboard</Link>
                {role === "admin" && <Link to="/admin">Admin Panel</Link>}
                <Link to="/menu">Menu</Link>
                <Link to="/orders">My Orders</Link>
            </nav>
        </div>
    );
};

export default Sidebar;
