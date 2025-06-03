import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/main.css";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import useWindowSize from "react-use/lib/useWindowSize";

const API = "http://localhost:8000/track";

export default function OrderTrackingPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const { width, height } = useWindowSize();

    useEffect(() => {
        let isMounted = true;
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`${API}/order/${id}`);
                if (isMounted) {
                    setOrder(data);
                    setErr("");
                }
            } catch (e) {
                console.error(e);
                if (isMounted) setErr("Could not fetch order.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchOrder();
        const iv = setInterval(fetchOrder, 7000);
        return () => { isMounted = false; clearInterval(iv); };
    }, [id]);

    if (loading) return <div className="track-page"><p>Loading…</p></div>;
    if (err) return <div className="track-page"><p>{err}</p></div>;
    if (!order) return <div className="track-page"><p>No order found.</p></div>;

    const { customer_name, mode, status, total_price } = order;

    const FLOW = {
        "dine-in": ["pending", "confirmed", "preparing", "ready", "served"],
        online: ["pending", "confirmed", "preparing", "ready", "delivered"],
    };

    const flow = FLOW[mode.toLowerCase()];
    const currentIdx = flow.indexOf(status);
    const isComplete = currentIdx === flow.length - 1;
    const isCancelled = status === "cancelled";

    return (
        <div className="track-page">
            {isComplete && <Confetti width={width} height={height} />}
            <h2>📦 Order Tracking</h2>
            <p><strong>Order ID:</strong> {id}</p>
            <p><strong>Name:</strong> {customer_name}</p>
            <p><strong>Mode:</strong> {mode}</p>
            <p><strong>Total:</strong> ₹{total_price}</p>

            {isCancelled && (
                <div className="cancel-msg">
                    ❌ Your order was cancelled.
                </div>
            )}

            {!isCancelled && (
                <>
                    <div className="progress-container">
                        {flow.map((step, idx) => {
                            const isDone = idx < currentIdx;
                            const isCurrent = idx === currentIdx;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    key={step}
                                    className={`progress-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                                >
                                    <div className="icon">
                                        {isDone ? "✅" : isCurrent ? "🔄" : "⚪"}
                                    </div>
                                    <div className="label">{step}</div>
                                </motion.div>
                            );
                        })}
                        <div className="progress-line">
                            <div
                                className="progress-line-fill"
                                style={{ width: `${(currentIdx / (flow.length - 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {isComplete && (
                        <div className="success-msg">
                            🎉 Order successfully {status === "served" ? "served" : "delivered"}!
                        </div>
                    )}
                </>
            )}

            <Link to="/" className="home-link">← Back Home</Link>
        </div>
    );
}
