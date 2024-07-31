import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [time, setTime] = useState(120); // Initialize the timer with 20 seconds

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      // Clean up the interval on component unmount or when time reaches 0
      return () => clearInterval(timerId);
    }
  }, [time]);

  return (
    <div>
      <div className="timer">
        {time > 0 ? (
          <span>{time} seconds remaining</span>
        ) : (
          <span>Time's up!</span>
        )}
      </div>
    </div>
  );
}
