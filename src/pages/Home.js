import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/hero-image.png";
import {
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaInstagram,
} from "react-icons/fa";
import "../styles/main.css";

// Motion variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: (custom) => ({
        opacity: 1,
        transition: { delay: custom * 0.3 },
    }),
};

const Home = () => {
    const handleSubscribe = (e) => {
        e.preventDefault();
        alert("Thanks for subscribing!");
    };

    return (
        <motion.div
            className="home-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="">
                {/* Hero Section */}
                <section className="hero">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col">
                                <motion.div
                                    className="hero-left glass-card"
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                    <h1>
                                        Welcome to{" "}
                                        <span className="highlight">DineFlow</span>
                                    </h1>
                                    <p>
                                        Smooth and seamless food experience
                                    </p>
                                    <div className="hero-buttons">
                                        <Link to="/login" className="btn primary">
                                            Login
                                        </Link>
                                        <Link to="/register" className="btn secondary">
                                            Register
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="col-lg-6 col-md-6 col">
                                <motion.div
                                    className="hero-right"
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                    <motion.img
                                        src={heroImage}
                                        alt="AI-powered restaurant"
                                        className="hero-img"
                                        animate={{ rotate: [0, 2, -2, 0] }}
                                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>


                </section>

                {/* Features Section */}
                <motion.section
                    className="features"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h2>Why Choose Us?</h2>
                    <div className="features-grid">
                        {[
                            "🍽️ Smart Menu Recommendations",
                            "📊 Predictive Order Forecasting",
                            "🔍 Food Quality Detection",
                            "💬 Review Sentiment Analysis",
                            "💸 Dynamic Pricing & Offers",
                            "🛠️ Admin Dashboard & Insights",
                        ].map((text, i) => (
                            <motion.div
                                key={i}
                                className="feature-card"
                                custom={i}
                                variants={fadeIn}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                {text}
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* How It Works */}
                <motion.section
                    className="how-it-works"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h2>How It Works</h2>
                    <div className="steps">
                        {[
                            "1️⃣ Browse Smart Menu",
                            "2️⃣ Place Order Easily",
                            "3️⃣ Enjoy Fast Delivery",
                        ].map((text, i) => (
                            <motion.div
                                key={i}
                                className="step-card"
                                custom={i}
                                variants={fadeIn}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                {text}
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Stats Section */}
                <motion.section
                    className="growth-section"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className="growth-title"
                        variants={fadeIn}
                        custom={0}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        We're Growing Fast 🚀
                    </motion.h2>
                    <div className="growth-stats">
                        {[
                            { value: "50K+", label: "Happy Customers" },
                            { value: "10K+", label: "Orders Delivered" },
                            { value: "1.2K", label: "Restaurants Onboard" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="stat-card"
                                custom={i + 1}
                                variants={fadeIn}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Testimonials */}
                <motion.section
                    className="testimonials"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h2>Customer Love ❤️</h2>
                    <div className="testimonial-cards">
                        {[
                            {
                                quote: `"Quick, reliable, and intelligent. The perfect combo!"`,
                                author: "— Ayesha, Food Blogger",
                            },
                            {
                                quote: `"Love the AI suggestions – feels like the app knows me!"`,
                                author: "— Zain, College Student",
                            },
                            {
                                quote: `"My restaurant's revenue improved after integrating this system!"`,
                                author: "— Chef Arjun, Restaurant Owner",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="testimonial-card"
                                custom={i}
                                variants={fadeIn}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <p className="testimonial-quote">{item.quote}</p>
                                <h4 className="testimonial-author">{item.author}</h4>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Footer */}
                <footer>
                    <div className="footer-content">
                        <div className="footer-section about">
                            <h2>About Us</h2>
                            <p>
                                We are dedicated to providing top-notch services to our customers.
                                Stay connected with us for updates and offers.
                            </p>
                        </div>

                        <div className="footer-section subscribe">
                            <h2>Subscribe to Our Newsletter</h2>
                            <p>
                                Stay updated with the latest news and offers. Sign up for our
                                newsletter!
                            </p>
                            <form onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    required
                                />
                                <button type="submit">Subscribe</button>
                            </form>
                        </div>

                        <div className="footer-section social-media">
                            <h2>Follow Us</h2>
                            <ul className="social-media-links">
                                <li>
                                    <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
                                        <FaFacebook size={30} />
                                    </a>
                                </li>
                                <li>
                                    <a href="https://twitter.com" className="social-icon" aria-label="Twitter">
                                        <FaTwitter size={30} />
                                    </a>
                                </li>
                                <li>
                                    <a href="https://linkedin.com" className="social-icon" aria-label="LinkedIn">
                                        <FaLinkedin size={30} />
                                    </a>
                                </li>
                                <li>
                                    <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
                                        <FaInstagram size={30} />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2025 Restaurant Ordering System. All Rights Reserved.</p>
                    </div>
                </footer>
            </div>
        </motion.div>
    );
};

export default Home;
