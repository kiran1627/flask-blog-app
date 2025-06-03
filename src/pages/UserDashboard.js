import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Menu from "../components/Menu";
import TableBooking from "../components/TableBooking";
import DineInCart from "../components/dinecart";
import OnlineOrderCart from "../components/OnlineOrderCart";
import DashboardStatsCard from "../components/DashboardStatsCard";
import DashboardSummary from "../components/DashboardSummary";
import FloatingCartIcon from "../components/FloatingCartIcon";
import "../styles/main.css";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState(null);
    const [dineInCartItems, setDineInCartItems] = useState([]);
    const [onlineCartItems, setOnlineCartItems] = useState([]);
    const [isTableBooked, setIsTableBooked] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const email = localStorage.getItem("email");
        if (!email) {
            alert("⚠️ Email not found. Redirecting to login...");
            navigate("/login");
            return;
        }
        setUserEmail(email);
    }, [navigate]);

    const updateCartState = useCallback(() => {
        if (userEmail) {
            const dineCart = JSON.parse(localStorage.getItem(`cart_dine_${userEmail}`)) || [];
            const onlineCart = JSON.parse(localStorage.getItem(`cart_online_${userEmail}`)) || [];
            setDineInCartItems(dineCart);
            setOnlineCartItems(onlineCart);
        }
    }, [userEmail]);

    useEffect(() => {
        updateCartState();
    }, [updateCartState]);

    const handleAddToCart = (item) => {
        if (!mode) {
            alert("Please select a mode first.");
            return;
        }

        const cartKey = mode === "dinein" ? `cart_dine_${userEmail}` : `cart_online_${userEmail}`;
        let updatedCart = mode === "dinein" ? [...dineInCartItems] : [...onlineCartItems];

        const existingItemIndex = updatedCart.findIndex(cartItem => cartItem.id === item.id);
        if (existingItemIndex !== -1) {
            updatedCart[existingItemIndex].quantity += 1;
        } else {
            updatedCart.push({ ...item, quantity: 1 });
        }

        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        if (mode === "dinein") {
            setDineInCartItems(updatedCart);
        } else {
            setOnlineCartItems(updatedCart);
        }

        alert(`${item.name} added to cart! 🛒`);
    };

    const placeOrder = async (modeType) => {
        const cartKey = modeType === "dinein" ? `cart_dine_${userEmail}` : `cart_online_${userEmail}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const orderId = `${modeType.toUpperCase()}-${Date.now()}`;

        const orderData = {
            id: orderId,
            customer_name: userEmail,
            user: userEmail,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            mode: modeType,
            total_price: totalPrice,
            order_type: modeType,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(`current_order_id_${userEmail}`, orderId);
        localStorage.setItem(`current_order_price_${userEmail}`, totalPrice);
        localStorage.removeItem(cartKey);
        modeType === "dinein" ? setDineInCartItems([]) : setOnlineCartItems([]);

        try {
            const response = await fetch("http://localhost:8000/order/save_order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save the order. Status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Order placed successfully:", data);
            alert(`${modeType === "dinein" ? "✅ Dine-in" : "✅ Online"} Order placed! Proceeding to payment...`);
            navigate(modeType === "dinein" ? "/payment-dine" : "/payment-online");
        } catch (error) {
            console.error(`${modeType} order error:`, error);
            alert(`❌ Error placing order: ${error.message}`);
        }
    };

    return (
        <div className="user-dashboard">
            <div className="dashboard-header">
                <h1>👋 Welcome, {userEmail}!</h1>
                <button
                    className="logout-btn"
                    onClick={() => {
                        localStorage.clear();
                        navigate("/home");
                    }}
                >
                    Logout
                </button>
            </div>

            <div className="dashboard-buttons">
                <motion.button
                    className={`dashboard-btn ${mode === "dinein" ? "active-mode" : ""}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMode("dinein")}
                >
                    🍽️ Dine-In
                </motion.button>

                <motion.button
                    className={`dashboard-btn ${mode === "online" ? "active-mode" : ""}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMode("online")}
                >
                    🛒 Online Order
                </motion.button>
            </div>

            <FloatingCartIcon itemCount={(mode === "dinein" ? dineInCartItems.length : onlineCartItems.length)} />

            <div className="dashboard-body">
                {mode === null ? (
                    <div className="dashboard-placeholder">
                        <p>Please select a mode to begin:</p>
                        <ul>
                            <li><strong>🍽️ Dine-In</strong> – Book tables, view the menu, and dine at our place.</li>
                            <li><strong>🛒 Online Order</strong> – Browse our menu, add items to cart, and checkout online.</li>
                        </ul>
                    </div>
                ) : (
                    <>
                        {mode === "dinein" && (
                            <>
                                <DashboardStatsCard />
                                <DashboardSummary />
                                <Menu mode="dinein" handleAddToCart={handleAddToCart} />
                                <TableBooking setIsTableBooked={setIsTableBooked} />
                                <DineInCart cartItems={dineInCartItems} setCartItems={setDineInCartItems} />

                                <div style={{ textAlign: "center", marginTop: "20px" }}>
                                    <motion.button
                                        className="place-order-btn"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => placeOrder("dinein")}
                                        disabled={!isTableBooked}
                                    >
                                        ✅ Proceed to Payment for Dine-In
                                    </motion.button>
                                </div>
                            </>
                        )}

                        {mode === "online" && (
                            <>
                                <DashboardStatsCard />
                                <DashboardSummary />
                                <Menu mode="online" handleAddToCart={handleAddToCart} />
                                <OnlineOrderCart cartItems={onlineCartItems} setCartItems={setOnlineCartItems} />

                                <div style={{ textAlign: "center", marginTop: "20px" }}>
                                    <motion.button
                                        className="place-order-btn"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => placeOrder("online")}
                                    >
                                        ✅ Proceed to Payment for Online Order
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
