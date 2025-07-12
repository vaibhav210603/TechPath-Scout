import React, { useState } from "react";
import { API_ENDPOINTS } from '../../../config/api';

const FAQ = () => {
  // Check if device is mobile
  const isMobile = window.innerWidth <= 768;
  const currentStyles = isMobile ? mobileStyles : styles;
  
  const faqs = [
    {
      question: "What is TechPath Scout?",
      answer: "TechPath Scout is a platform offering advanced assessment tools for students in the CSE domain.",
    },
    {
      question: "How much does result generation cost?",
      answer: "Result generation costs ₹199 per report, providing detailed analytics and insights.",
    },
    
    {
      question: "What payment methods are accepted?",
      answer: "We accept payments via UPI, credit/debit cards, and net banking.",
    },
    {
      question: "Is my data secure on TechPath Scout?",
      answer: "Absolutely! We use advanced encryption and follow strict privacy policies to keep your data secure.",
    },
    {
      question: "Can I share my results with others?",
      answer: "Yes, you can download or share your results directly through the platform.",
    },
    {
      question: "How accurate are the assessments?",
      answer: "Our assessments are developed by experts and tested for accuracy to ensure the best evaluation.",
    },
    {
      question: "Does TechPath Scout offer group discounts?",
      answer: "Yes, we offer group discounts for institutions or teams. Please contact support for more details.",
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach out to us via the support section on our website or email us at support@techpathscout.com.",
    },
    {
      question: "Are there any hidden charges?",
      answer: "No, we maintain transparency in pricing, and there are no hidden charges.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('tp_user') || '{}');
    try {
      const res = await fetch(API_ENDPOINTS.COMMENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          rating,
          comment_text: comment
        })
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      setFeedbackMsg('Thank you for your feedback!');
      setComment('');
      setRating(5);
    } catch (err) {
      setFeedbackMsg('Failed to submit feedback.');
    }
  };

  return (
    <div style={currentStyles.container}>
      <h2 style={currentStyles.heading}>Frequently Asked Questions</h2>
      <div style={currentStyles.faqList}>
        {faqs.map((faq, index) => (
          <div key={index} style={currentStyles.faqItem}>
            <div
              style={currentStyles.question}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span style={currentStyles.icon}>{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <div style={currentStyles.answer}>{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleFeedbackSubmit} style={{ 
        marginTop: isMobile ? 20 : 40, 
        textAlign: 'center',
        padding: isMobile ? '0 10px' : '0'
      }}>
        <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>Leave Feedback</h3>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Rating:
          <select 
            value={rating} 
            onChange={e => setRating(Number(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Your feedback..."
          rows={3}
          style={{ 
            width: isMobile ? '90%' : '60%', 
            marginTop: 10,
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        />
        <br />
        <button 
          type="submit"
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Submit Feedback
        </button>
        <div style={{ marginTop: '10px', color: feedbackMsg.includes('Thank') ? 'green' : 'red' }}>
          {feedbackMsg}
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1600px",
    margin: "auto 0%",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    minHeight: "100vh",
    minHeight: "100dvh", /* Use dynamic viewport height */
    overflowY: "auto", /* Allow scrolling */
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  faqList: {
    borderTop: "1px solid #ddd",
  },
  faqItem: {
    borderBottom: "1px solid #ddd",
    padding: "10px 0",
  },
  question: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#555",
  },
  answer: {
    marginTop: "10px",
    color: "#666",
    lineHeight: "1.6",
  },
  icon: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#555",
  },
};

// Mobile styles
const mobileStyles = {
  container: {
    maxWidth: "100%",
    margin: "0",
    padding: "15px",
    fontFamily: "'Arial', sans-serif",
    minHeight: "100vh",
    minHeight: "100dvh",
    overflowY: "auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "15px",
    color: "#333",
    fontSize: "1.5rem",
  },
  faqList: {
    borderTop: "1px solid #ddd",
  },
  faqItem: {
    borderBottom: "1px solid #ddd",
    padding: "8px 0",
  },
  question: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#555",
    fontSize: "0.9rem",
    padding: "5px 0",
  },
  answer: {
    marginTop: "8px",
    color: "#666",
    lineHeight: "1.5",
    fontSize: "0.85rem",
  },
  icon: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#555",
  },
};

export default FAQ;
