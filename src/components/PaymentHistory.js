import React from "react";

const PaymentHistory = ({ payments }) => {
    if (!payments.length) {
        return <p>No payments found.</p>;
    }

    return (
        <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
                <tr>
                    <th>Payment ID</th>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((p) => (
                    <tr key={p.payment_id}>
                        <td>{p.payment_id}</td>
                        <td>{p.order_id}</td>
                        <td>₹{p.amount.toFixed(2)}</td>
                        <td>{p.method}</td>
                        <td>{p.status}</td>
                        <td>{p.timestamp}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PaymentHistory;
