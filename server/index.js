import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import OpenAI from "openai";
import Razorpay from 'razorpay';
import { prisma } from './database/index.js';
import userRouter from './api/user.js';
import commentRouter from './api/comment.js';
import assistantRouter from './api/assistant.js';
import paymentRouter from './api/payment.js';

dotenv.config();

// --- TEMPORARY DEBUGGING ---
console.log("Attempting to load OpenAI API Key:", process.env.OPENAI_API_KEY);
// --- END DEBUGGING ---

const app = express();
const port = process.env.PORT || 8000;

// Comprehensive CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Local development frontend
    'https://techpath-scout.vercel.app',  // Replace with your actual frontend URL
    'https://techpath.vibhaupadhyay.com',  // Replace with your actual frontend URL
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

// OpenAI Configuration (for /generate and /api/chat)
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiModel = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: "gpt-3.5-turbo", // or gpt-4 if you have access
  temperature: 0.7,
});

// Razorpay Configuration
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the TechPath Scout Server!");
});

// Original /generate route (using raw OpenAI API)
app.post("/generate", async (req, res) => {
  try {
    const userText = req.body.text;
    console.log("User Text:", userText);
    const result = await openaiModel.invoke(userText);
    const text = result.content || result.text || JSON.stringify(result);
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

// Get chat history for a specific user
app.get("/api/chat/:user_id", async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const assistant = await prisma.assistant.findUnique({
      where: { user_id: parseInt(user_id) }
    });
    
    if (!assistant || !assistant.chat_history) {
      return res.json({ chat_history: [] });
    }
    
    try {
      const chatHistory = JSON.parse(assistant.chat_history);
      res.json({ chat_history: chatHistory });
    } catch (e) {
      console.error("Error parsing chat history:", e);
      res.json({ chat_history: [] });
    }
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// LangChain chat route with user-specific memory
app.post("/api/chat", async (req, res) => {
  const { message, user_id } = req.body;
  console.log("1. Received request for /api/chat with message:", message, "for user_id:", user_id);
  if (!message) {
    console.error("Validation Error: Message is required");
    return res.status(400).json({ error: "Message is required" });
  }
  if (!user_id) {
    console.error("Validation Error: user_id is required");
    return res.status(400).json({ error: "user_id is required" });
  }
  try {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(user_id) }
    });
    if (!user) {
      console.error("User not found:", user_id);
      return res.status(404).json({ error: "User not found" });
    }
    // Get or create user-specific assistant chat
    let assistant = await prisma.assistant.findUnique({
      where: { user_id: parseInt(user_id) }
    });
    let chatHistory = [];
    if (assistant && assistant.chat_history) {
      try {
        chatHistory = JSON.parse(assistant.chat_history);
      } catch (e) {
        console.error("Error parsing chat history:", e);
        chatHistory = [];
      }
    }
    // Build messages array for OpenAI (system, then conversation)
    const messages = [];
    // Only add system prompt at the start
    messages.push({
      role: "system",
      content: `You are TechPath Scout, a friendly and expert career advisor for the tech industry. Your user is ${user.full_name}. Provide clear, helpful, and encouraging advice. Keep your responses concise and easy to read. Use minimum words and very short and crisp replies under a line or 2 at max (about 10-20 words). I want to minimize tokens used. When required a detailed answer, answer in short bullet points when asked questions related to career advice/to do's. Do not say you are being concise.`
    });
    // Add previous conversation
    for (const entry of chatHistory) {
      messages.push({ role: "user", content: entry.input });
      messages.push({ role: "assistant", content: entry.output });
    }
    // Add the new user message
    messages.push({ role: "user", content: message });
    // Call OpenAI
    const result = await openaiModel.invoke(messages);
    const aiReply = result.content || result.text || JSON.stringify(result);
    // Update chat history
    chatHistory.push({ input: message, output: aiReply });
    const chatHistoryJson = JSON.stringify(chatHistory);
    if (assistant) {
      await prisma.assistant.update({
        where: { assistant_chat_id: assistant.assistant_chat_id },
        data: { chat_history: chatHistoryJson }
      });
    } else {
      await prisma.assistant.create({
        data: {
          user_id: parseInt(user_id),
          chat_history: chatHistoryJson
        }
      });
    }
    res.json({ reply: aiReply });
    console.log("4. Sent AI response back to the client and saved to database.");
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
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});