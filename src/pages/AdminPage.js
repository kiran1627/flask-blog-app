import React from 'react';
import AdminPanel from '../components/AdminPanel';
import OrdersAdminPanel from "../components/OrdersAdminPanel";
import Dashboard from '../components/Dashboard';

const AdminPage = () => {
    return (
        <div className="admin-page">
            {/* First Admin Panel, then Dashboard */}
            <AdminPanel />
            <hr style={{ margin: "2rem 0" }} />
            <hr style={{ margin: "2rem 0" }} />
            <OrdersAdminPanel />
            <Dashboard />
        </div>
    );
};

export default AdminPage;
