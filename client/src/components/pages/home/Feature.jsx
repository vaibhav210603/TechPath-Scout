// Feature.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import './Feature.css';

const Feature = ({ icon, title, description }) => {
    const cardVariants = {
        offscreen: {
            y: 50,
            opacity: 0
        },
        onscreen: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 0.8
            }
        }
    };

    return (
        <motion.div 
            className="feature-card"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
            variants={cardVariants}
        >
            <div className="feature-icon-wrapper">
                <span className={icon}></span>
            </div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
            <a href="#" className="feature-learn-more">Learn more →</a>
        </motion.div>
    );
};

Feature.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default Feature;