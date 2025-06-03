import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

const Menu = ({ mode, handleAddToCart }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const navigate = useNavigate();

    const FASTAPI_BASE = "http://localhost:8000";

    useEffect(() => {
        axios.get(`${FASTAPI_BASE}/menu`)
            .then(res => {
                const items = res.data.map(item => ({
                    ...item,
                    image: item.image ? `${FASTAPI_BASE}${item.image}` : ''
                }));
                setMenuItems(items);
            })
            .catch(err => console.error("❌ Failed to load menu:", err));
    }, []);

    const categories = ["All", ...new Set(menuItems.map(item => item.category))];

    const filteredItems = menuItems.filter(item =>
        (selectedCategory === "All" || item.category === selectedCategory) &&
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="menu-container">
            <motion.h2 className="section-title">🍽 Our Menu</motion.h2>

            {/* Search and Filter Controls */}
            <div className="menu-controls">
                <input
                    type="text"
                    placeholder="Search dishes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="menu-search"
                />
                <div className="category-buttons">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <h3>📋 {selectedCategory === "All" ? "All Dishes" : `${selectedCategory} Dishes`}</h3>

            <div className="menu-grid">
                {filteredItems.map(item => (
                    <motion.div
                        key={item.id}
                        className="menu-card"
                        whileHover={{ scale: 1.05 }}
                    >
                        {item.image && <img src={item.image} alt={item.name} className="menu-img" />}
                        <h4>{item.name}</h4>
                        <p>{item.description || "No description."}</p>
                        <p>₹{item.price}</p>

                        <button
                            className="add-btn"
                            onClick={() => handleAddToCart(item, mode)}
                        >
                            ➕ Add to Cart
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Floating Recommend Button */}
            <motion.button
                className="floating-recommend-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/recommend")}
            >
                ⭐ Recommend
            </motion.button>
        </div>
    );
};

export default Menu;
