import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';
import { API_ENDPOINTS } from '../../../config/api';

const SignIn = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Create or upsert user in backend
      const res = await fetch(API_ENDPOINTS.USERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          full_name: name, 
          email,
          phone 
        })
      });
      if (!res.ok) throw new Error('Failed to create user');
      const user = await res.json();
      // Store user in localStorage for later use
      localStorage.setItem('tp_user', JSON.stringify(user));
      // Navigate to the quiz page and pass user details as state
      navigate('/quiz', { state: { user_details: user } });
    } catch (err) {
      alert('Sign in failed: ' + err.message);
    }
  };

  return (
    <div className="signin-wrapper">
    <div className="signin-container">
      <div className="typewrite"><h2>And you are?</h2></div>
      <form onSubmit={handleSubmit}> {/* Add onSubmit handler */}
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Enter your phone number"
            pattern="[0-9]{10,}"
            title="Please enter a valid phone number (minimum 10 digits)"
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default SignIn;
