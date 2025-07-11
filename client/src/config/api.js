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
  QUESTIONS_2: '/assets/ques2.json',
  // User CRUD
  USERS: `${API_BASE_URL}/api/users`,
  USER_LOGIN: `${API_BASE_URL}/api/users/login`,
  // Comment CRUD
  COMMENTS: `${API_BASE_URL}/api/comments`,
  // Assistant chat CRUD
  ASSISTANTS: `${API_BASE_URL}/api/assistants`,
  // Payment CRUD
  PAYMENTS: `${API_BASE_URL}/api/payments`,
};

// Razorpay configuration (this should come from backend)
export const RAZORPAY_CONFIG = {
  key: import.meta.env.VITE_RAZORPAY_KEY, // Use Vite environment variable
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