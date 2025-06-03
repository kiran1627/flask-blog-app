import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, auth, roleRequired }) => {
    if (!auth?.token) return <Navigate to="/login" />;
    if (roleRequired && auth.role !== roleRequired) return <Navigate to="/" />;
    return children;
};

export default ProtectedRoute;
