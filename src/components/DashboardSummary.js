import React, { useEffect, useState } from 'react';
import DashboardStatsCard from "../components/DashboardStatsCard"; // Ensure this component exists
import "../styles/main.css";

const DashboardSummary = () => {
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        // Check if localStorage already has data
        let storedOrders = JSON.parse(localStorage.getItem('orders'));
        let storedBookings = JSON.parse(localStorage.getItem('bookings'));
        let storedFeedbacks = JSON.parse(localStorage.getItem('feedbacks'));

        // If not, generate dummy data
        if (!storedOrders || storedOrders.length === 0) {
            storedOrders = Array.from({ length: 1000 }, (_, i) => ({
                id: i + 1,
                item: `Item ${i + 1}`,
                quantity: Math.ceil(Math.random() * 5),
                price: (Math.random() * 50 + 10).toFixed(2),
            }));
            localStorage.setItem('orders', JSON.stringify(storedOrders));
        }

        if (!storedBookings || storedBookings.length === 0) {
            storedBookings = Array.from({ length: 1000 }, (_, i) => ({
                id: i + 1,
                tableNumber: (i % 50) + 1,
                date: new Date(Date.now() - Math.random() * 1e10).toISOString(),
            }));
            localStorage.setItem('bookings', JSON.stringify(storedBookings));
        }

        if (!storedFeedbacks || storedFeedbacks.length === 0) {
            storedFeedbacks = Array.from({ length: 10000 }, (_, i) => ({
                id: i + 1,
                rating: (Math.random() * 5).toFixed(1),
                comment: `Feedback comment ${i + 1}`
            }));
            localStorage.setItem('feedbacks', JSON.stringify(storedFeedbacks));
        }

        setOrders(storedOrders);
        setBookings(storedBookings);
        setFeedbacks(storedFeedbacks);
    }, []);

    const totalOrders = orders.length;
    const totalBookings = bookings.length;
    const averageRating = feedbacks.length
        ? (feedbacks.reduce((sum, f) => sum + parseFloat(f.rating || 0), 0) / feedbacks.length).toFixed(1)
        : 'N/A';

    return (
        <div className="dashboard-summary">
            <DashboardStatsCard title="Total Orders" value={totalOrders} icon="🛒" />
            <DashboardStatsCard title="Tables Booked" value={totalBookings} icon="🍽️" />
            <DashboardStatsCard title="Avg. Rating" value={averageRating} icon="⭐" />
        </div>
    );
};

export default DashboardSummary;
