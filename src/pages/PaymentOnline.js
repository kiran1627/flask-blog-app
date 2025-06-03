import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentOnline = () => {
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState("");
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const userEmail = localStorage.getItem("email");
        if (!userEmail) {
            alert("⚠️ Email not found. Redirecting to login...");
            navigate("/login");
            return;
        }

        const id = localStorage.getItem(`current_order_id_${userEmail}`);
        const amt = localStorage.getItem(`current_order_price_${userEmail}`);

        if (id && amt && !isNaN(parseFloat(amt))) {
            setOrderId(id);
            setAmount(parseFloat(amt));
        } else {
            alert("⚠️ No valid order found. Redirecting...");
            navigate("/dashboard");
        }
    }, [navigate]);

    const handlePayment = () => {
        if (!orderId || amount <= 0) {
            alert("❌ Invalid order or amount.");
            return;
        }

        // Pass order ID, amount, and online method to PaymentPage
        navigate(`/payment?orderId=${orderId}&amount=${amount}&method=online`);
    };

    return (
        <div className="payment-container">
            <h2>🛍️ Online Payment</h2>
            {orderId && amount ? (
                <>
                    <p>💵 Total Amount: ₹{amount.toFixed(2)}</p>
                    <button onClick={handlePayment}>Pay Now</button>
                </>
            ) : (
                <p>⚠️ No order found. Please place an order first.</p>
            )}
        </div>
    );
};

export default PaymentOnline;
