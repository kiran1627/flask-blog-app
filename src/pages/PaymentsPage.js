import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentHistory from "../components/PaymentHistory";

const PaymentsPage = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/payment/")
            .then(res => setPayments(res.data))
            .catch(err => console.error("Error fetching payments", err));
    }, []);

    return (
        <div className="container">
            <h2>📑 Payment History</h2>
            <PaymentHistory payments={payments} />
        </div>
    );
};

export default PaymentsPage;
