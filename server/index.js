import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Razorpay from 'razorpay';
import userRouter from './api/user.js';
import commentRouter from './api/comment.js';
import assistantRouter from './api/assistant.js';
import paymentRouter from './api/payment.js';

dotenv.config();

// --- TEMPORARY DEBUGGING ---
console.log("Attempting to load Gemini API Key:", process.env.GEMINI_API_KEY);
// --- END DEBUGGING ---

const app = express();
const port = process.env.PORT || 8000;

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
app.use(cors());
app.use(express.json());

// Google Generative AI Configuration (for original /generate route)
const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

// Razorpay Configuration
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Initialize the LangChain model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0.7,
});

// Initialize memory
const memory = new BufferMemory();

// Initialize the conversation chain
const chain = new ConversationChain({
  llm: model,
  memory: memory,
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the TechPath Scout Server!");
});

// Original /generate route (using raw Gemini API)
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

// LangChain chat route
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  console.log("1. Received request for /api/chat with message:", message);

  if (!message) {
    console.error("Validation Error: Message is required");
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const fullInput = `You are TechPath Scout, a friendly and expert career advisor for the tech industry. Provide clear, helpful, and encouraging advice. Keep your responses concise and easy to read.\n\nUser: ${message}`;
    
    console.log("2. Calling the conversation chain with the AI...");
    const response = await chain.call({ input: fullInput });
    console.log("3. Received response from AI:", response);

    res.json({ reply: response.response });
    console.log("4. Sent AI response back to the client.");
  } catch (error) {
    console.error("5. An error occurred in the chat processing chain:", error);
    res.status(500).json({ error: "Failed to get a response from the AI." });
  }
});

// Razorpay order creation route
app.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}` // Dynamic receipt number
    };

    const order = await razorpayInstance.orders.create(options);
    
    // Return order data along with Razorpay key
    res.json({
      ...order,
      razorpay_key: process.env.RAZORPAY_KEY_ID // Include the key from environment
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({
      message: 'Failed to create Razorpay order',
      error: error.message
    });
  }
});

app.use('/api/users', userRouter);
app.use('/api/comments', commentRouter);
app.use('/api/assistants', assistantRouter);
app.use('/api/payments', paymentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message
  });
});

// Server setup
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



