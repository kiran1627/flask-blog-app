// src/pages/OrdersAdminPanel.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/main.css";

const API = "http://localhost:8000/track";

const FLOW = {
    "dine-in": ["pending", "confirmed", "preparing", "ready", "served"],
    online: ["pending", "confirmed", "preparing", "ready", "delivered"],
};

const COMPLETED_STATUSES = ["served", "picked-up", "cancelled"];

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default function OrdersAdminPanel() {
    const [mode, setMode] = useState("dine-in");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API}/orders/${mode}`);
            setOrders(data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            alert("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, [mode]);

    const advanceStatus = async (id) => {
        try {
            await axios.post(`${API}/order/${id}/advance`);
            fetchOrders();
        } catch (err) {
            console.error("Error advancing status:", err);
            alert("Cannot advance status");
        }
    };

    const forceStatus = async (id, status) => {
        try {
            await axios.put(`${API}/order/${id}/status`, { status });
            fetchOrders();
        } catch (err) {
            console.error("Error forcing status:", err);
            alert("Failed to set status");
        }
    };

    const cancelOrder = async (id) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) return;

        try {
            await axios.put(`${API}/order/${id}/status`, { status: "cancelled" });
            fetchOrders();
        } catch (err) {
            console.error("Error cancelling order:", err);
            alert("Failed to cancel order");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <section className="admin-panel orders-admin">
            <h2> orders Management</h2>

            <div className="tabs">
                {["dine-in", "online"].map((m) => (
                    <button
                        key={m}
                        className={mode === m ? "active" : ""}
                        onClick={() => setMode(m)}
                    >
                        {m.toUpperCase()}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading…</p>
            ) : orders.length === 0 ? (
                <p>No orders yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Total (₹)</th>
                            <th>Status</th>
                            <th>Advance</th>
                            <th>Force Status / Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const {
                                order_id = "unknown",
                                customer_name = "Anonymous",
                                total_price = "0.00",
                                status = "pending",
                            } = order;

                            const isFinal = COMPLETED_STATUSES.includes(status);
                            const currentFlow = FLOW[mode];
                            const isLastStep = status === currentFlow.at(-1);

                            return (
                                <tr
                                    key={order_id}
                                    className={status === "cancelled" ? "cancelled-row" : ""}
                                >
                                    <td>{order_id.slice(0, 8)}…</td>
                                    <td>{customer_name}</td>
                                    <td>{parseFloat(total_price).toFixed(2)}</td>
                                    <td>{capitalize(status)}</td>

                                    {/* Advance Status */}
                                    <td>
                                        {isLastStep || status === "cancelled" ? (
                                            "—"
                                        ) : (
                                            <button onClick={() => advanceStatus(order_id)}>
                                                Next ➜
                                            </button>
                                        )}
                                    </td>

                                    {/* Force Status / Cancel */}
                                    <td style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                        <select
                                            value={status}
                                            onChange={(e) => forceStatus(order_id, e.target.value)}
                                            disabled={status === "cancelled"}
                                        >
                                            {[...FLOW[mode], "cancelled"].map((s) => (
                                                <option key={s} value={s}>
                                                    {capitalize(s)}
                                                </option>
                                            ))}
                                        </select>

                                        {!isFinal && (
                                            <button
                                                onClick={() => cancelOrder(order_id)}
                                                className="danger"
                                                title="Cancel this order"
                                            >
                                                ✖
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </section>
    );
}
