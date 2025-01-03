import React, { useState } from "react";

const FAQ = () => {
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

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Frequently Asked Questions</h2>
      <div style={styles.faqList}>
        {faqs.map((faq, index) => (
          <div key={index} style={styles.faqItem}>
            <div
              style={styles.question}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span style={styles.icon}>{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <div style={styles.answer}>{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    
    maxWidth: "1600px",
    margin: "auto 0%",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    
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

export default FAQ;
