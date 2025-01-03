// Feature.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Feature.css';

const Feature = props => {
    const containerClass = props.orient === 'left' ? 'feature_container_left' : 'feature_container_right';
    
    return (
        <div className={containerClass}>
            <div className={`text_${props.orient}`}>
                <p>{props.text}</p>
            </div>
            <div className={`img_${props.orient}`}>
                {props.img && <img src={props.img} alt={props.text} />}
            </div>
        </div>
    );
};

Feature.propTypes = {
    orient: PropTypes.oneOf(['left', 'right']).isRequired,
    text: PropTypes.string.isRequired,
    img: PropTypes.string
};

export default Feature;