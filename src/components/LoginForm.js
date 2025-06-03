import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/AuthForm.css";
import bgImage from "../assets/login-bg.png";

const LoginForm = ({ setAuth }) => {
    const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const endpoint =
            formData.role === "admin"
                ? "http://localhost:8000/auth/admin/login"
                : "http://localhost:8000/auth/user/login";

        try {
            const trimmedData = {
                email: formData.email.trim(),
                password: formData.password.trim(),
                role: formData.role,
            };

            const res = await axios.post(endpoint, trimmedData);

            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("email", trimmedData.email);
            setAuth({ token: res.data.access_token, role: res.data.role });

            navigate(res.data.role === "admin" ? "/admin" : "/dashboard");
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert(err.response?.data?.detail || "Login failed.");
        } finally {
            setLoading(false);
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
                <h2>Welcome Back!</h2>
                <p>
                    Don’t have an account?{" "}
                    <span className="signup" onClick={() => navigate("/register")}>
                        Sign Up
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
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginForm;
