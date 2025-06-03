import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/main.css";

const Orders = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [orderType, setOrderType] = useState("dine-in");
    const [selectedItem, setSelectedItem] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [dineInCart, setDineInCart] = useState([]);
    const [onlineCart, setOnlineCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [paymentOrderId, setPaymentOrderId] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("credit-card");

    useEffect(() => {
        axios.get("http://localhost:8000/menu")
            .then(res => setMenuItems(res.data))
            .catch(err => console.error("Failed to load menu", err));
    }, []);

    const handleAddToCart = () => {
        if (!selectedItem || quantity <= 0) {
            alert("Select a valid item and quantity.");
            return;
        }
        const item = menuItems.find(m => m.id === parseInt(selectedItem));
        if (!item) return;

        const cartItem = {
            id: item.id,
            name: item.name,
            qty: parseInt(quantity),
            price: item.price,
        };

        if (orderType === "dine-in") {
            setDineInCart([...dineInCart, cartItem]);
        } else {
            setOnlineCart([...onlineCart, cartItem]);
        }

        setSelectedItem("");
        setQuantity(1);
    };

    const handlePlaceOrder = async (type) => {
        const cart = type === "dine-in" ? dineInCart : onlineCart;
        if (!customerName || cart.length === 0) {
            alert("Please provide customer name and add items.");
            return;
        }

        try {
            const firstItem = cart[0];
            const orderRes = await axios.post("http://localhost:8000/order", {
                customer_name: customerName,
                item_id: firstItem.id,
                quantity: firstItem.qty
            });

            if (orderRes.data.order_id) {
                alert(`✅ ${type.toUpperCase()} Order Placed!`);

                const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
                setOrders([{
                    id: orderRes.data.order_id,
                    items: cart.map(i => i.name),
                    total,
                    status: "Preparing"
                }, ...orders]);

                // Set the order ID and amount for payment automatically
                setPaymentOrderId(orderRes.data.order_id);
                setPaymentAmount(total);

                // Store Order ID in localStorage
                localStorage.setItem('orderId', orderRes.data.order_id);
                localStorage.setItem('paymentAmount', total);

                setCustomerName("");
                if (type === "dine-in") setDineInCart([]);
                else setOnlineCart([]);
            } else {
                alert("❌ Order ID not received from the server.");
            }

        } catch (err) {
            console.error("❌ Order failed:", err);
            alert("Failed to place order.");
        }
    };

    const handleMakePayment = async (e) => {
        e.preventDefault();

        // Check if Order ID and Amount are available
        if (!paymentOrderId || !paymentAmount) {
            alert("❌ Order ID or amount is missing. Please place an order first.");
            return;
        }

        // Check if paymentMethod is selected
        if (!paymentMethod) {
            alert("❌ Please select a payment method.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("order_id", paymentOrderId);
            formData.append("amount", paymentAmount);
            formData.append("method", paymentMethod);

            await axios.post("http://localhost:8000/payment", formData);

            alert("✅ Payment Successful!");

            // Clear payment form
            setPaymentOrderId("");
            setPaymentAmount("");
            setPaymentMethod("credit-card");

        } catch (error) {
            console.error("❌ Payment failed", error);
            alert("Payment failed. Please try again.");
        }
    };

    return (
        <div className="orders">
            <h2>🧾 Restaurant Orders</h2>

            <div className="order-form">
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />

                <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                    <option value="dine-in">Dine-In</option>
                    <option value="online">Online</option>
                </select>

                <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                    <option value="">Select Item</option>
                    {menuItems.map(item => (
                        <option key={item.id} value={item.id}>
                            {item.name} - ₹{item.price}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />

                <button className="order-btn" onClick={handleAddToCart}>🛒 Add to Cart</button>
            </div>

            {/* 🪑 Dine-In Cart */}
            <div className="cart">
                <h3>🪑 Dine-In Cart</h3>
                <ul>
                    {dineInCart.map((item, idx) => (
                        <li key={idx}>{item.name} × {item.qty} = ₹{item.qty * item.price}</li>
                    ))}
                </ul>
                {dineInCart.length > 0 && (
                    <button onClick={() => handlePlaceOrder("dine-in")}>✅ Place Dine-In Order</button>
                )}
            </div>

            {/* 🚚 Online Cart */}
            <div className="cart">
                <h3>🚚 Online Cart</h3>
                <ul>
                    {onlineCart.map((item, idx) => (
                        <li key={idx}>{item.name} × {item.qty} = ₹{item.qty * item.price}</li>
                    ))}
                </ul>
                {onlineCart.length > 0 && (
                    <button onClick={() => handlePlaceOrder("online")}>✅ Place Online Order</button>
                )}
            </div>

            {/* 📦 Active Orders */}
            <h3>📦 Active Orders</h3>
            <ul className="order-list">
                {orders.map(order => (
                    <li key={order.id} className="order-card">
                        <p><strong>Order ID: {order.id}</strong></p>
                        <p>Items: {order.items.join(", ")}</p>
                        <p>Total: ₹{order.total}</p>
                        <p>Status: <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
                    </li>
                ))}
            </ul>

            {/* 💳 Payment Form */}
            <div className="payment-form">
                <h3>💳 Make Payment</h3>
                <form onSubmit={handleMakePayment}>
                    <input
                        type="text"
                        placeholder="Order ID"
                        value={paymentOrderId}
                        onChange={(e) => setPaymentOrderId(e.target.value)}
                        required
                        readOnly
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        required
                        readOnly
                    />
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="credit-card">Credit Card</option>
                        <option value="debit-card">Debit Card</option>
                        <option value="upi">UPI</option>
                        <option value="cash">Cash</option>
                    </select>
                    <button type="submit">💵 Pay Now</button>
                </form>
            </div>
        </div>
    );
};

export default Orders;
