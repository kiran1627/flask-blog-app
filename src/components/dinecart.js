import React from "react";

const DineInCart = ({ cartItems, setCartItems }) => {
    const userEmail = localStorage.getItem("email");
    const cartKey = `cart_dine_${userEmail}`;

    const updateCart = (updatedCart) => {
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        setCartItems(updatedCart);
    };

    const increaseQuantity = (index) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity += 1;
        updateCart(updatedCart);
    };

    const decreaseQuantity = (index) => {
        const updatedCart = [...cartItems];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
        } else {
            updatedCart.splice(index, 1);
        }
        updateCart(updatedCart);
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    return (
        <div className="cart-container" style={{ padding: "20px" }}>
            <h2>🍽️ Dine-In Cart</h2>

            {cartItems.length === 0 ? (
                <p>No items in Dine-In cart. Please add some items to your cart!</p>
            ) : (
                <div>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {cartItems.map((item, index) => (
                            <li key={index} style={{ marginBottom: "15px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <strong>{item.name}</strong> — ₹{item.price} x {item.quantity} = ₹{item.quantity * item.price}

                                    <div>
                                        <button
                                            onClick={() => decreaseQuantity(index)}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            ➖
                                        </button>
                                        <button
                                            onClick={() => increaseQuantity(index)}
                                            style={{ marginLeft: "5px" }}
                                        >
                                            ➕
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p>
                        <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
                    </p>
                </div>
            )}
        </div>
    );
};

export default DineInCart;

