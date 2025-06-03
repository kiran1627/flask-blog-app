import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/main.css";

function Navbar() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const isAuthenticated = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/login"); // redirect after logout
    };

    return (
        <motion.nav
            className="navbar"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <ul>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/menu">Menu</Link></li>
                        <li><Link to="/orders">Orders</Link></li>
                        <li><Link to="/quality">Food Check</Link></li>
                        <li><Link to="/sentiment">Sentiment</Link></li>
                        <li><Link to="/pricing">Pricing</Link></li>
                        {role === "admin" && <li><Link to="/admin">Admin</Link></li>}
                        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </motion.nav>
    );
}

export default Navbar;
