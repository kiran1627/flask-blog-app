import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaChartLine,
    FaShoppingCart,
    FaMoneyBillWave,
    FaDownload,
    FaBell,
} from 'react-icons/fa';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import '../styles/main.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const initialData = [
    { name: 'Mon', orders: 30, revenue: 240, category: 'Food' },
    { name: 'Tue', orders: 45, revenue: 350, category: 'Beverage' },
    { name: 'Wed', orders: 50, revenue: 420, category: 'Snacks' },
    { name: 'Thu', orders: 60, revenue: 500, category: 'Food' },
    { name: 'Fri', orders: 75, revenue: 620, category: 'Beverage' },
    { name: 'Sat', orders: 90, revenue: 710, category: 'Snacks' },
    { name: 'Sun', orders: 100, revenue: 820, category: 'Food' },
];

// Helper for PieChart
const getCategoryData = (data) => {
    const counts = {};
    data.forEach(({ category }) => {
        counts[category] = (counts[category] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));
};

const Dashboard = () => {
    const [data] = useState(initialData);
    const [category, setCategory] = useState('All');
    const [date, setDate] = useState('');
    const [notifications] = useState([
        'New order from user123',
        'Low stock alert for "Paneer Burger"',
        'Revenue crossed ₹10K today!',
    ]);

    const filteredData =
        category === 'All'
            ? data
            : data.filter((d) => d.category === category);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Weekly Report', 14, 16);
        doc.autoTable({
            head: [['Day', 'Orders', 'Revenue']],
            body: filteredData.map((d) => [d.name, d.orders, `₹${d.revenue}`]),
        });
        doc.save('report.pdf');
    };

    const handleDownloadCSV = () => {
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            ['Day,Orders,Revenue', ...filteredData.map((d) => `${d.name},${d.orders},${d.revenue}`)].join('\n');
        const encodedUri = encodeURI(csvContent);
        saveAs(encodedUri, 'report.csv');
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    Dashboard Overview
                </motion.h2>
                <div className="notification-icon">
                    <FaBell />
                    <div className="notification-dropdown">
                        <h4>Notifications</h4>
                        <ul>
                            {notifications.map((note, idx) => (
                                <li key={idx}>{note}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="filters">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>All</option>
                    <option>Food</option>
                    <option>Beverage</option>
                    <option>Snacks</option>
                </select>
                <button onClick={handleDownloadPDF}>
                    <FaDownload /> PDF
                </button>
                <button onClick={handleDownloadCSV}>
                    <FaDownload /> CSV
                </button>
            </div>

            <div className="summary-cards">
                <motion.div className="card" whileHover={{ scale: 1.05 }}>
                    <FaShoppingCart className="icon" />
                    <h3>Orders Today</h3>
                    <p>152</p>
                </motion.div>

                <motion.div className="card" whileHover={{ scale: 1.05 }}>
                    <FaMoneyBillWave className="icon" />
                    <h3>Revenue</h3>
                    <p>₹12,300</p>
                </motion.div>

                <motion.div className="card" whileHover={{ scale: 1.05 }}>
                    <FaChartLine className="icon" />
                    <h3>Growth</h3>
                    <p>+18%</p>
                </motion.div>
            </div>

            <div className="chart-section">
                <h3>📈 Weekly Analytics</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="pie-chart-section">
                <h3>📊 Orders by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={getCategoryData(data)}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {getCategoryData(data).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="orders-table">
                <h3>📦 Orders Summary</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Orders</th>
                            <th>Revenue</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.name}</td>
                                <td>{row.orders}</td>
                                <td>₹{row.revenue}</td>
                                <td>{row.category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
