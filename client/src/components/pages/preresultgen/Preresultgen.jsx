import React, { useState, useEffect } from 'react';
import './preresultgen.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../../../config/api';

export default function Preresultgen() {
  const location = useLocation();
  const { results = [] } = location.state || {};
  const { user_details = {} } = location.state || {};
  const navigate = useNavigate();

  const [displayedText, setDisplayedText] = useState('');
  const text = "We do not intend any profit, but sometimes we take things more seriously when we pay for them. We’ll be charging about 1/10th of your pizza, i.e., 2.59 USD (218 INR). Cheers to your new future! We believe this could be one of the best investments you make in yourself.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length-1) {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      // Razorpay script loaded successfully
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script); // Clean up the script
    };
  }, []);

  const handlePayment = async () => {
    try {
     9

      // Create order using your backend endpoint
      const orderResponse = await fetch(API_ENDPOINTS.CREATE_ORDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2, // 218 INR
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      const options = {
        key: orderData.razorpay_key, // Use key from backend response
        amount: orderData.amount,
        currency: "INR",
        name: "Techpath Scout",
        description: "Career Analysis Report",
        order_id: orderData.id,
        handler: function (response) {
          // Handle successful payment
          navigate('/resultgen', { 
            state: { 
              results, 
              user_details,
              payment: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              }
            } 
          });
        },
        prefill: {
          name: user_details.name || '',
          email: user_details.email || '',
          contact: user_details.phone || ''
        },
        theme: {
          color: "#3399cc"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again.');
    } 
  };


  return (
    <div className='preresult_container'>
      <div className="back">
        <div className="text1">{displayedText}</div>
      </div>

      <div className='pay_button'>
        <button className='pay' onClick={handlePayment}>Whatever it takes, let's do it!</button>
      </div>
    </div>
  );
}
