import React, { useEffect } from "react";

const OnlineOrderCart = ({ cartItems, setCartItems }) => {
    const userEmail = localStorage.getItem("email");
    const cartKey = `cart_online_${userEmail}`;

    const handleQtyChange = (id, delta) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const handleRemove = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    useEffect(() => {
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }, [cartItems, cartKey]);

    return (
        <div className="online-cart">
            <h3>🛒 Your Cart</h3>
            {cartItems.length === 0 ? (
                <p>Your cart is empty. Start shopping!</p>
            ) : (
                cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <span>{item.name}</span>
                        <button onClick={() => handleQtyChange(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQtyChange(item.id, 1)}>+</button>
                        <button onClick={() => handleRemove(item.id)}>❌</button>
                    </div>
                ))
            )}
            <h4>Total: ₹{total.toFixed(2)}</h4>
        </div>
    );
};

export default OnlineOrderCart;
