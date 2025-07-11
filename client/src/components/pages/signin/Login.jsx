import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './signin.css';
import { API_ENDPOINTS } from '../../../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(API_ENDPOINTS.USER_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const user = await res.json();
      
      // Store user in localStorage
      localStorage.setItem('tp_user', JSON.stringify(user));
      
      // Check if there's a redirect destination
      const redirectTo = location.state?.redirectTo || '/';
      
      // Navigate to the appropriate page
      navigate(redirectTo, { state: { user_details: user } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signin', { 
      state: { 
        redirectTo: location.state?.redirectTo || '/',
        showSignUp: true 
      } 
    });
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-container">
        <div className="typewrite">
          <h2>Welcome Back!</h2>
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

          <button 
            type="submit" 
            className="submit-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #ddd'
        }}>
          <p style={{ marginBottom: '10px', color: '#666' }}>
            Don't have an account?
          </p>
          <button 
            onClick={handleSignUp}
            style={{
              background: 'none',
              border: '2px solid #007bff',
              color: '#007bff',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#007bff';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = '#007bff';
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 