import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/main.css";

const FoodQualityCheck = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState("");

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setResult("🔍 Analyzing image...");
            setTimeout(() => {
                // Simulated AI Prediction
                setResult("✅ Food Quality: Fresh & Hygienic");
            }, 2000);
        }
    };

    return (
        <motion.div
            className="quality-check"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2>🍱 Food Quality AI Check</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && (
                <motion.img
                    src={image}
                    alt="Food Preview"
                    className="preview-img"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                />
            )}
            <p className="result-text">{result}</p>
        </motion.div>
    );
};

export default FoodQualityCheck;
