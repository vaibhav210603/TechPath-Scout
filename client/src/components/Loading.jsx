// src/components/Loading.jsx
import React, { useState, useEffect } from 'react';
import './Loading.css'; // Make sure this path is correct

const Loading = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 3000); // 3000ms = 3 seconds

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen" style={{ display: loading ? 'flex' : 'none' }}>
      <div className="loading-text">Loading</div>
      <div className="loading-animation">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
