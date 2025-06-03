import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import "../styles/main.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

const PricingDashboard = () => {
    const [recommendation, setRecommendation] = useState(null);

    const generateMockPricing = () => {
        setRecommendation("🧠 AI suggests increasing Pizza price by ₹20 and reducing Burger price by ₹10.");
    };

    const pricingData = {
        labels: ["Pizza", "Burger", "Pasta", "Sandwich", "Noodles"],
        datasets: [
            {
                label: "Current Price (₹)",
                data: [200, 120, 150, 100, 130],
                backgroundColor: "#3b82f6",
            },
            {
                label: "Predicted Price (₹)",
                data: [220, 110, 160, 105, 140],
                backgroundColor: "#10b981",
            },
        ],
    };

    return (
        <motion.div
            className="pricing-dashboard"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2>💸 Smart Pricing Dashboard</h2>
            <Bar data={pricingData} />
            <Line data={pricingData} style={{ marginTop: "2rem" }} />

            <button onClick={generateMockPricing}>Generate AI Pricing Insight</button>

            {recommendation && (
                <motion.div
                    className="ai-recommendation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {recommendation}
                </motion.div>
            )}
        </motion.div>
    );
};

export default PricingDashboard;
