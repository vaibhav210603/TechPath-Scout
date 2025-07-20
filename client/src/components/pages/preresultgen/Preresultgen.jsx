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
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const text = "We do not intend any profit, but sometimes we take things more seriously when we pay for them. We'll be charging about 1/10th of your pizza, i.e., 2.59 USD (218 INR). Cheers to your new future! We believe this could be one of the best investments you make in yourself.";

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

  const generateAnalysis = async () => {
    try {
      setIsGeneratingAnalysis(true);
      console.log('Generating analysis after payment...');
      
      const questionsAnswersString = results
        .map(
          (item, index) =>
            `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.selectedOption}`
        )
        .join('\n\n');

      const prompt = `Consider yourself a CS domain counselor. You just evaluated a student named ${user_details.name} based on their answers about interests, skills, and mindset. Give a concise, honest analysis and suggest suitable CS domains.

**Start with a bold greeting: "Hey [name], I hope you're doing great" in a larger font.**

## Analysis

- For each core competency:  
  - Write a 1-liner  
  - Give a clear score /10  
  - Add "you're in the top X% of students"

- Mention 2 weak spots with short lines and honest scores.

## Domain Recommendation

- Suggest 2+ CS domains that fit their strengths and mindset.  
- Justify each choice.  
- Add **"Here are some best FREE resources on the internet"** and share resource links (plain, small font, unbolded).

## Improvement Suggestions

- Point out areas to grow.  
- Give simple, practical advice: projects, courses, or activities.

## Domain Inclination Score

- Format:
  - **Software Engineering**: 8/10  
  - **Data Science/Machine Learning**: 7/10  
  - **Cybersecurity**: 7/10

Keep the tone supportive and unique to the student’s answers. Space headings clearly.
`;

      const fullText = `${questionsAnswersString}\n\n${prompt}`;

      const res = await fetch(API_ENDPOINTS.GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: fullText }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.story) {
        console.log('Analysis generated successfully, storing in database...');
        return data.story;
      } else {
        throw new Error('No analysis generated');
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
      throw error;
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  const handlePayment = async () => {
    try {
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
        handler: async function (response) {
          // Handle successful payment
          console.log('Payment successful!');
          
         
          
          // Handle analysis generation and storage in background
          try {
            console.log('Generating analysis in background...');
            
            // Generate analysis after successful payment
            const analysis = await generateAnalysis();
            
            console.log('Analysis generated, storing in database...');

            // Ensure user_id is present, recover from localStorage if missing
            if (!user_details.user_id) {
              const storedUser = localStorage.getItem('tp_user');
              if (storedUser) {
                try {
                  const parsedUser = JSON.parse(storedUser);
                  user_details.user_id = parsedUser.user_id;
                  user_details.name = parsedUser.name || parsedUser.full_name;
                } catch (error) {
                  console.error('Error parsing stored user:', error);
                }
              }
            }
            if (!user_details.user_id) {
              alert('User not logged in. Please sign in again.');
              return;
            }
            console.log('Payment request payload:', {
              user_id: user_details.user_id,
              amount: orderData.amount / 100,
              payment_status: 'success',
              result: analysis
            });
            // Store payment and analysis in backend
            const paymentResponse = await fetch(API_ENDPOINTS.PAYMENTS, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: user_details.user_id,
                amount: orderData.amount / 100, // convert paise to INR
                payment_status: 'success',
                result: analysis // Store only the analysis result
              })
            });
            if (paymentResponse.ok) {
              // Confirm result is stored before navigating
              const userId = user_details.user_id;
              let userResult = null;
              for (let i = 0; i < 5; i++) { // Try up to 5 times
                const userRes = await fetch(`${API_ENDPOINTS.USERS}/${userId}`);
                const user = await userRes.json();
                if (user.result) {
                  userResult = user.result;
                  break;
                }
                await new Promise(res => setTimeout(res, 300)); // Wait 300ms before retry
              }
              if (userResult) {
                navigate('/resultgen', { state: { user_details } });
              } else {
                alert('Result not available yet, please refresh the page.');
              }
            }

            console.log('Payment and analysis stored successfully in background');
          } catch (err) {
            console.error('Failed to process payment in background:', err);
            // Don't show error to user since they're already on result page
          }
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
        <button 
          className='pay' 
          onClick={handlePayment}
          disabled={isGeneratingAnalysis}
        >
          {isGeneratingAnalysis ? 'Processing payment and generating analysis...' : 'Whatever it takes, let\'s do it!'}
        </button>
      </div>
    </div>
  );
}
