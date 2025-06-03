// src/pages/PaymentPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/main.css";

const PaymentPage = () => {
    const [orderId, setOrderId] = useState("");
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    /* ------------------------------------------------------------------ */
    /*   Grab order‑id & amount that were appended as query‑string params  */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("orderId");
        const amt = params.get("amount");

        if (id && amt) {
            setOrderId(id);
            setAmount(amt);
        } else {
            navigate("/");              // 🏠 go back if URL is malformed
        }
    }, [location, navigate]);

    /* --------------------------------- */
    /*   Payment submit handler          */
    /* --------------------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!orderId || !amount || !method) {
            alert("❌ Please fill in all payment details.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:8000/payment", {
                order_id: orderId,
                amount: parseFloat(amount),
                method,
            });

            console.log("💬 payment response ⇒", data);        // <‑‑ debug
            setResponse(data);
            alert("✅ Payment Successful!");
        } catch (err) {
            const msg = err.response?.data?.detail || err.message || "❌ Payment failed.";
            setResponse({ message: "❌ Payment failed", error: msg });
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------------------------------------- */
    /*   Helper to decide whether we should show   TRACK     */
    /* ---------------------------------------------------- */
    const isPaid = ["success", "paid", "completed"].includes(
        (response?.status || "").toString().toLowerCase()
    );

    return (
        <div className="payment-container">
            <h2>💳 Make a Payment</h2>

            <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-group">
                    <label>Order ID:</label>
                    <input type="text" value={orderId} disabled />
                </div>

                <div className="form-group">
                    <label>Amount (₹):</label>
                    <input type="number" value={amount} disabled />
                </div>

                <div className="form-group">
                    <label>Select Payment Method:</label>
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        required
                    >
                        <option value="">‑‑ Select ‑‑</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                        <option value="Cash">Cash</option>
                    </select>
                </div>

                <button type="submit" className="pay-btn" disabled={loading}>
                    {loading ? "Processing…" : "💵 Pay Now"}
                </button>
            </form>

            {/* ------------------------  RESULT  ------------------------ */}
            {response && (
                <div className="payment-response">
                    <h3>{response.message}</h3>

                    {response.payment_id && (
                        <p><strong>Payment ID:</strong> {response.payment_id}</p>
                    )}
                    {response.status && (
                        <p><strong>Status:</strong> {response.status}</p>
                    )}
                    {response.error && (
                        <p><strong>Error:</strong> {String(response.error)}</p>
                    )}

                    {/* --------------  TRACK ORDER BUTTON -------------- */}
                    {isPaid && (
                        <button
                            className="track-btn"
                            onClick={() => navigate(`/track/${orderId}`)}
                        >
                            🚚 Track Order
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
