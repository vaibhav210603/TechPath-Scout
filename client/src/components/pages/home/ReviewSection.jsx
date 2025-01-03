import React, { useState } from 'react';
import './ReviewSection.css'
const Star = ({ filled }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 20 20"
    style={{ fill: filled ? '#FFB800' : '#D1D5DB' }}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ReviewCard = ({ name, rating, description }) => (
  <div className="review-card">
    <p className='reviewer_name'>{name}</p>
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <Star key={i} filled={i < rating} />
      ))}
    </div>
    <p>{description}</p>
  </div>
);

const ReviewSection = () => {
  const [showMore, setShowMore] = useState(false);
  
  const reviews = [
    { name: "Vaibhav Upadhyay", rating: 5, description: "Found my perfect tech path in AI/ML. The guidance was invaluable!" },
    { name: "Dristant Senger", rating: 4, description: "Great insights into web development. Helped me choose my specialty." },
    { name: "Aradhya Mittal", rating: 5, description: "Finally understood where I fit in the tech world. Cybersecurity was my calling!" },
    { name: "Siddharth Pandey", rating: 5, description: "The career guidance helped me pivot into data science successfully." },
    { name: "Yash Singh", rating: 4, description: "Excellent resource for understanding different tech domains." },
    { name: "Udit Singh", rating: 5, description: "Game development was my passion, and this helped confirm it." },
    { name: "Bhavya Chimpa", rating: 5, description: "The personalized approach made all the difference." },
    { name: "Utkarsh Yadav", rating: 4, description: "Helped me understand the ML landscape and where I could excel." },
    { name: "Vinayak Sisodiya", rating: 5, description: "Found my niche in cloud architecture thanks to the guidance." },
    { name: "Jitender Kumar", rating: 5, description: "The insights into different tech roles were eye-opening." },
    { name: "Vaibhav Madaan", rating: 4, description: "Great platform for tech career guidance and direction." },
    { name: "Vivek Pal", rating: 5, description: "Finally found clarity in my technical career path!" }
  ];

  return (
    <div className="review-section">
      
      <div className="review-grid">
        {reviews.slice(0, showMore ? 12 : 6).map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
      <button 
        className="show-more-btn"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? 'less ': 'more'}
      </button>
    </div>
  );
};

export default ReviewSection;