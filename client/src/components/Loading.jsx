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
    },100); // 3000ms = 3 seconds

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen" style={{ display: loading ? 'flex' : 'none' }}>

      <div className="image">
      <img src="https://i.pinimg.com/originals/b8/3e/c9/b83ec9d8ac7a6f2dfaa93fa4f150e3b6.gif"></img>
      </div>
    </div>
  );
};

export default Loading;
