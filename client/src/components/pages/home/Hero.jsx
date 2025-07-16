import React, { useState, useEffect } from 'react';
import TextBlock from '../../../constants/TextBlock';
import { Link, useNavigate } from "react-router-dom";
import Feature from './Feature';
import './Hero.css';
import ReviewSection from './ReviewSection';
import { motion } from 'framer-motion';

export default function Hero() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('tp_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    const handleGetStarted = (e) => {
        e.preventDefault();
        if (user) {
            navigate('/quiz');
        } else {
            navigate('/signin');
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('tp_user');
        setUser(null);
        navigate('/');
    };

    return (
        <div className="hero-container">
            {/* Modern Hero Section */}
            <section className="hero-modern-bg">
                <div className="hero-navbar">
                    <div className="hero-logo">TechPath Scout</div>
                    <nav className="hero-nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/assistant">Assistant</Link>
                        <Link to="/contact">Contact</Link>
                        {user && (
                        <Link to="/Payments">Payment</Link>
                        )}

                        <a href="/Techpath_scout blueprint.pdf" target="_blank" rel="noopener noreferrer">Blueprint</a>
                    </nav>
                    <button className="hero-app-btn" onClick={handleGetStarted}>
                        <span>Get Started</span>
                    </button>
                </div>
                <div className="hero-main-content">
                    <motion.div
                        className="hero-left"
                        initial={{ opacity: 0, x: -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* <div className="hero-badge">
                            <img src="/github.png" alt="badge" className="hero-badge-icon" />
                            <span>Free forever. No credit card</span>
                        </div> */}
                        <h1 className="hero-title-main">
                            
                       Hey  {user && (
                                <span style={{ color: 'green' }}>
                                {JSON.parse(localStorage.getItem('tp_user')).full_name.split(' ')[0]}
                                </span>
                            )}
                        <br/>   <br/>
                            Choose  what<br /><br />You  are<br /><br />Made  for!
                            <span className="hero-avatars">
                                <img src="/mephotocropped.jpeg" alt="avatar1" />
                                <img src="/nig_coder.jpg" alt="avatar2" />
                                
                            </span>
                        </h1>
                        <div className="hero-btn-row">
                            <button className="hero-getstarted-btn" onClick={handleGetStarted}>Get Started</button>
                            {user ? (
                                <button className="hero-login-btn" onClick={handleLogout}>Logout</button>
                            ) : (
                                <Link to="/login" className="hero-login-btn">Login</Link>
                            )}
                            <Link to="/signin" className="hero-signup-btn">Sign Up</Link>
                            <a href="#features" className="hero-features-link">Our Features</a>
                        </div>
                    </motion.div>
                    <motion.div
                        className="hero-right"
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="hero-image-card">
                            <img src="/nig_coder.jpg" alt="hero-person" className="hero-person-img" />
                            <div className="hero-stat-card">
                                <span className="hero-stat-label">1,451</span>
                                <span className="hero-stat-desc">Students helped</span>
                                <img src="/trophy-red.png" alt="stat-graph" className="hero-stat-graph" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* New Features Section */}
            <section id="features" className="features-section">
                <h2 className="section-title">Take Control Of Your Career</h2>
                <p className="section-subtitle">We provide the best tools for you to excel in your career.</p>
                <div className="features-grid">
                    <Feature 
                        icon="lnr lnr-chart-bars"
                        title="Personalized Analysis"
                        description="Career analysis based on 5,000+ coder experiences and market trends."
                    />
                    <Feature 
                        icon="lnr lnr-diamond"
                        title="Unique Recommendations"
                        description="Recommendations based on your personality, IQ, and other metrics."
                    />
                    <Feature 
                        icon="lnr lnr-bubble"
                        title="AI Career Assistant"
                        description="A free assistant/chatbot to help with any career-related doubts."
                    />
                    <Feature 
                        icon="lnr lnr-download"
                        title="Free Resources"
                        description="Access to free resources and downloadable results for recommended domains."
                    />
                </div>
            </section>
            
            <ReviewSection />

            {/* Footer Section */}
            <footer className="footer-modern">
                <div className="footer-main">
                    <div className="footer-about">
                        <h3 className="footer-logo">TechPath Scout</h3>
                        <p className="footer-description">
                            Helping you find your ideal domain of excellence to get ahead of 99% of coders.
                        </p>
                    </div>
                    <div className="footer-links-group">
                        <div className="footer-links-col">
                            <h4 className="footer-col-title">Solutions</h4>
                            <Link to="/#">Career Analysis</Link>
                            <Link to="/#">Recommendations</Link>
                            <Link to="/#">AI Assistant</Link>
                        </div>
                        <div className="footer-links-col">
                            <h4 className="footer-col-title">Support</h4>
                            <Link to="/contact">Contact Us</Link>
                            <Link to="/faq">FAQ</Link>
                            <Link to="/#">Help Center</Link>
                        </div>
                        <div className="footer-links-col">
                            <h4 className="footer-col-title">Company</h4>
                            <Link to="/aboutus">About Us</Link>
                            <Link to="/#">Blog</Link>
                            <Link to="/#">Careers</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom-modern">
                    <p>&copy; 2024 TechPath Scout. All rights reserved.</p>
                    <div className="footer-socials">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                            <img src="/github.png" alt="GitHub" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <img src="/linkedin.png" alt="LinkedIn" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
} 