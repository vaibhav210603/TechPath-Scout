// API Configuration
// Change this to switch between local and deployed environments
const ENVIRONMENT = 'deployed'; // Options: 'local' or 'deployed'

// API Base URLs
const API_URLS = {
  local: 'http://localhost:8000',
  deployed: 'https://techpath-scout-server.vercel.app'
};

// Get the current API base URL
export const API_BASE_URL = API_URLS[ENVIRONMENT];

// API Endpoints
export const API_ENDPOINTS = {
  // Content generation
  GENERATE: `${API_BASE_URL}/generate`,
  
  // Chat functionality
  CHAT: `${API_BASE_URL}/api/chat`,
  
  // Payment processing
  CREATE_ORDER: `${API_BASE_URL}/create-order`,
  
  // Static assets (these remain the same)
  QUESTIONS_1: '/assets/ques1.json',
  QUESTIONS_2: '/assets/ques2.json'
};

// Razorpay configuration (this should come from backend)
export const RAZORPAY_CONFIG = {
  key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_live_sgeda5ZnM4PhGA', // Fallback for development
  currency: 'INR',
  name: 'Techpath Scout',
  description: 'Career Analysis Report'
};

// Helper function to get full URL for any endpoint
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    environment: ENVIRONMENT,
    baseUrl: API_BASE_URL,
    endpoints: API_ENDPOINTS
  };
};

// Log current configuration (for debugging)
console.log('API Configuration:', getEnvironmentInfo()); 