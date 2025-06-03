import React, { useEffect, useState } from 'react';
import "../styles/main.css";

const FloatingCartIcon = () => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCart = () => {
            const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            const count = savedCart.reduce((sum, item) => sum + item.qty, 0);
            setCartCount(count);
        };

        updateCart();
        window.addEventListener("storage", updateCart); // real-time sync across tabs
        return () => window.removeEventListener("storage", updateCart);
    }, []);

    if (cartCount === 0) return null;

    return (
        <div className="floating-cart-icon">
            🛒 {cartCount}
        </div>
    );
};

export default FloatingCartIcon;
