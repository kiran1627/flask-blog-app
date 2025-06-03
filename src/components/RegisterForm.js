import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/AuthForm.css";
import bgImage from "../assets/login-bg.png";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "user",
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint =
                formData.role === "admin"
                    ? "http://localhost:8000/auth/admin/register"
                    : "http://localhost:8000/auth/user/register";

            await axios.post(endpoint, {
                email: formData.email.trim(),
                password: formData.password.trim(),
                role: formData.role,
            });

            alert("Registration successful!");
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            alert(error.response?.data?.detail || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <motion.div
                className="login-left"
                style={{ backgroundImage: `url(${bgImage})` }}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            ></motion.div>

            <motion.div
                className="login-right"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <h2>Register</h2>
                <p>
                    Already have an account?{" "}
                    <span className="signup" onClick={() => navigate("/login")}>
                        Login
                    </span>
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        Register
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterForm;
