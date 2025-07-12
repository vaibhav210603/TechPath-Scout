import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './signin.css';
import { API_ENDPOINTS } from '../../../config/api';

const SignIn = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
      
      const user = await res.json();
      
      // Store user in localStorage for later use
      localStorage.setItem('tp_user', JSON.stringify(user));
      
      // Check if there's a redirect destination
      const redirectTo = location.state?.redirectTo || '/';
      
      // Navigate to the appropriate page and pass user details as state
      navigate(redirectTo, { state: { user_details: user } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login', { 
      state: { 
        redirectTo: location.state?.redirectTo || '/' 
      } 
    });
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-container">
        <div className="typewrite">
          <h2>And you are?</h2>
        </div>
        
        {error && (
          <div style={{ 
            color: 'red', 
            backgroundColor: '#ffe6e6', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #ddd'
        }}>
          <p style={{ marginBottom: '10px', color: '#666' }}>
            Already have an account?
          </p>
          <button 
            onClick={handleLogin}
            className="secondary-button"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
