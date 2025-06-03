import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/main.css";

const Recommend = () => {
    const [tasteItems, setTasteItems] = useState([]);
    const [imageItems, setImageItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("taste");
    const [error, setError] = useState(null);

    const FASTAPI_BASE = "http://localhost:8000";

    const fetchRecommendations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [tasteRes, imageRes] = await Promise.all([
                axios.post(`${FASTAPI_BASE}/recommend/taste`, { item_name: "Biryani" }),
                axios.post(`${FASTAPI_BASE}/recommend/image`, { item_name: "Biryani" }),
            ]);
            setTasteItems(tasteRes.data.recommended_items || []);
            setImageItems(imageRes.data.recommended_items || []);
        } catch (error) {
            setError("Failed to load recommendations.");
            console.error("Error fetching recommendations:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations();
        const interval = setInterval(() => {
            fetchRecommendations();
        }, 1 * 60 * 1000); // Refresh every 1 minute
        return () => clearInterval(interval);
    }, [fetchRecommendations]);

    const renderItems = (items, type) => (
        <div className="menu-grid">
            {items.length === 0 ? (
                <p>No items found.</p>
            ) : (
                items.map((item) => (
                    <div
                        key={item.name}
                        className="menu-card"
                        style={{
                            border: type === "taste" ? "2px solid gold" : "2px dashed #00aaff",
                        }}
                    >
                        {type === "image" && item.image_url && (
                            <img
                                src={`${FASTAPI_BASE}${item.image_url}`}
                                alt={item.name}
                                className="menu-img"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        )}
                        <h4>{item.name}</h4>
                        {type === "taste" && (
                            <>
                                <p>{item.description}</p>
                                <p>₹{item.price}</p>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="recommend-container">
            <h2>🍽 Food Recommendations</h2>

            <div className="tab-buttons">
                <button
                    onClick={() => setActiveTab("taste")}
                    className={activeTab === "taste" ? "tab-active taste-tab" : "tab-inactive taste-tab"}
                >
                    ⭐ Taste-Based
                </button>
                <button
                    onClick={() => setActiveTab("image")}
                    className={activeTab === "image" ? "tab-active image-tab" : "tab-inactive image-tab"}
                >
                    📷 Image-Based
                </button>
            </div>

            {loading ? (
                <p>Loading recommendations...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : activeTab === "taste" ? (
                renderItems(tasteItems, "taste")
            ) : (
                renderItems(imageItems, "image")
            )}
        </div>
    );
};

export default Recommend;
