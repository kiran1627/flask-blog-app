import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/main.css";

const SentimentAnalysis = () => {
    const [review, setReview] = useState("");
    const [result, setResult] = useState("");

    const analyzeReview = () => {
        if (review.length < 10) {
            setResult("⚠️ Review too short");
            return;
        }

        setResult("🔍 Analyzing sentiment...");
        setTimeout(() => {
            const mockSentiment = review.toLowerCase().includes("bad") ? "😞 Negative" : "😊 Positive";
            setResult(mockSentiment);
        }, 1500);
    };

    return (
        <motion.div
            className="sentiment-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
        >
            <h2>💬 Sentiment Review Analyzer</h2>
            <textarea
                placeholder="Write or paste a review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={6}
            />
            <button onClick={analyzeReview}>Analyze</button>
            {result && (
                <motion.div
                    className="sentiment-result"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {result}
                </motion.div>
            )}
        </motion.div>
    );
};

export default SentimentAnalysis;
