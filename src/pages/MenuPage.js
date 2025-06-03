import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../styles/main.css";

const Menu = ({ mode, handleAddToCart }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [recommendedItems, setRecommendedItems] = useState([]);
    const [imageRecommendations, setImageRecommendations] = useState([]);
    const [loadingTaste, setLoadingTaste] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);

    const recommendationRef = useRef(null);

    const API_BASE = "http://localhost:5000/ml";
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

    const handleItemClick = async (itemName) => {
        setLoadingTaste(true);
        setLoadingImage(true);
        setRecommendedItems([]);
        setImageRecommendations([]);

        try {
            const tasteRes = await axios.post(`${API_BASE}/recommend/taste`, { name: itemName });
            const names = tasteRes.data.recommended_items || [];
            const matched = menuItems.filter(item =>
                names.some(n => n.toLowerCase() === item.name.toLowerCase())
            );
            setRecommendedItems(matched);
        } catch (err) {
            console.error("❌ Taste recommendation failed", err);
        } finally {
            setLoadingTaste(false);
        }

        try {
            const imageRes = await axios.post(`${API_BASE}/recommend/image`, { name: itemName });
            const imageRecs = imageRes.data.recommended_items || [];
            const enriched = imageRecs.map(item => ({
                ...item,
                image: item.image ? `${FASTAPI_BASE}${item.image}` : ''
            }));
            setImageRecommendations(enriched);
        } catch (err) {
            console.error("❌ Image recommendation failed", err);
        } finally {
            setLoadingImage(false);
        }

        setTimeout(() => {
            recommendationRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100); // allow rendering before scroll
    };

    const handleClearRecommendations = () => {
        setRecommendedItems([]);
        setImageRecommendations([]);
        recommendationRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const renderLoader = () => (
        <div className="loader-container">
            <div className="shimmer-card shimmer" />
            <div className="shimmer-card shimmer" />
            <div className="shimmer-card shimmer" />
        </div>
    );

    return (
        <div className="menu-container">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="section-title">
                🍽 Our Menu
            </motion.h2>

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
                            className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <h3>📋 {selectedCategory === "All" ? "All Dishes" : `${selectedCategory} Dishes`}</h3>

            <div className="menu-grid">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <motion.div
                            className="menu-card"
                            key={item.id}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleItemClick(item.name)}
                        >
                            {item.image && <img src={item.image} alt={item.name} className="menu-img" />}
                            <h4 className="menu-title">{item.name}</h4>
                            <p className="menu-description">{item.description || "No description available."}</p>
                            <p className="menu-price">₹{item.price}</p>

                            <motion.button
                                className="add-to-cart-btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(item, mode);
                                }}
                            >
                                ➕ Add to Cart
                            </motion.button>
                        </motion.div>
                    ))
                ) : (
                    <p>No dishes found.</p>
                )}
            </div>

            {/* ----- Recommendations ----- */}
            <div ref={recommendationRef}>
                {(recommendedItems.length > 0 || imageRecommendations.length > 0) && (
                    <button className="clear-btn" onClick={handleClearRecommendations}>
                        ❌ Clear Recommendations
                    </button>
                )}

                {/* Taste Recommendations */}
                {loadingTaste ? renderLoader() : recommendedItems.length > 0 && (
                    <>
                        <h3 className="recommended-heading" style={{ color: "gold" }}>
                            ⭐ Recommended by Taste
                        </h3>
                        <div className="menu-grid">
                            {recommendedItems.map(item => (
                                <motion.div className="menu-card" key={`taste-${item.name}`} whileHover={{ scale: 1.05 }} style={{ border: "2px solid gold" }}>
                                    {item.image && <img src={item.image} alt={item.name} className="menu-img" />}
                                    <h4 className="menu-title">{item.name}</h4>
                                    <p className="menu-description">{item.description || "No description available."}</p>
                                    <p className="menu-price">₹{item.price}</p>
                                    <motion.button className="add-to-cart-btn" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleAddToCart(item, mode)}>
                                        ➕ Add to Cart
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                {/* Image Recommendations */}
                {loadingImage ? renderLoader() : imageRecommendations.length > 0 && (
                    <>
                        <h3 className="recommended-heading" style={{ color: "#00aaff" }}>
                            📷 Recommended by Image
                        </h3>
                        <div className="menu-grid">
                            {imageRecommendations.map(item => (
                                <motion.div className="menu-card" key={`img-${item.name}`} whileHover={{ scale: 1.05 }} style={{ border: "2px dashed #00aaff" }}>
                                    {item.image && <img src={item.image} alt={item.name} className="menu-img" />}
                                    <h4 className="menu-title">{item.name}</h4>
                                    <p className="menu-description">{item.description || "No description available."}</p>
                                    <p className="menu-price">₹{item.price}</p>
                                    <motion.button className="add-to-cart-btn" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleAddToCart(item, mode)}>
                                        ➕ Add to Cart
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Menu;
