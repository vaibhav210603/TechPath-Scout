const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Razorpay = require('razorpay');

const app = express();

// Comprehensive CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Local development frontend
    'https://techpath-scout.vercel.app',  // Replace with your actual frontend URL
    /\.vercel\.app$/  // Matches Vercel app domains if needed
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Access-Control-Allow-Origin'
  ],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());

// Google Generative AI Configuration
const key =  "AIzaSyCRBV5UWsxiORXpLiWEfToWBrpB0tlP6Uk";
const genAI = new GoogleGenerativeAI(key);

// Razorpay Configuration
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_sgeda5ZnM4PhGA',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'ZmwYboqnnfcHzJB8H9vIxLad'
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the TechPath Scout Server!");
});

app.post("/generate", async (req, res) => {
  try {
    const userText = req.body.text;
    console.log("User Text:", userText);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userText);
    const response = await result.response;
    const text = response.text();

    console.log("Generated Response:", text);

    res.json({
      message: "Response from server",
      story: text,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({
      message: "Failed to generate content",
      error: error.message
    });
  }
});

app.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}` // Dynamic receipt number
    };

    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({
      message: 'Failed to create Razorpay order',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message
  });
});

// Server setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



