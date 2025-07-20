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

// OpenAI Configuration (for original /generate route)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Razorpay Configuration
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Initialize the LangChain model with OpenAI
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4.1-nano", 
  temperature: 0.5,
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: userText
        }
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

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

    // Create user-specific memory with existing chat history
    const userMemory = new BufferMemory();
    
    // Restore previous conversation context
    for (const entry of chatHistory) {
      await userMemory.saveContext(
        { input: entry.input },
        { output: entry.output }
      );
    }

    // Create user-specific conversation chain
    const userChain = new ConversationChain({
      llm: model,
      memory: userMemory,
    });

    const fullInput = `You are TechPath Scout, a friendly and expert career advisor for the tech industry. Provide clear, helpful, and encouraging advice. Keep your responses concise and easy to read.
    Use minimum words and very short and crisp replies under a line or 2 at max(about 10-20 words) at max
    I want to minimize tokens used.
    when reuqired a detailed answer,
    answer in short bullet points when asked questions related to career advice/to do's
    Dont tell int he prompt that youre concise\n\nUser: ${message}`;
    
    console.log("2. Calling the conversation chain with the AI...");
    const response = await userChain.call({ input: fullInput });
    console.log("3. Received response from AI:", response);

    // Get updated memory and save to database
    const memoryVariables = await userMemory.loadMemoryVariables({});
    const newChatHistory = memoryVariables.history || [];

    // Parse the history string to extract conversation pairs
    const conversationPairs = [];
    const historyLines = newChatHistory.split('\n');
    let currentInput = '';
    let currentOutput = '';

    for (const line of historyLines) {
      if (line.startsWith('Human: ')) {
        if (currentInput && currentOutput) {
          conversationPairs.push({ input: currentInput, output: currentOutput });
        }
        currentInput = line.substring(7);
        currentOutput = '';
      } else if (line.startsWith('AI: ')) {
        currentOutput = line.substring(4);
      }
    }
    
    // Add the current conversation
    if (currentInput && currentOutput) {
      conversationPairs.push({ input: currentInput, output: currentOutput });
    }

    // Save updated chat history to database
    const chatHistoryJson = JSON.stringify(conversationPairs);
    
    if (assistant) {
      // Update existing chat
      await prisma.assistant.update({
        where: { assistant_chat_id: assistant.assistant_chat_id },
        data: { chat_history: chatHistoryJson }
      });
    } else {
      // Create new chat
      await prisma.assistant.create({
        data: {
          user_id: parseInt(user_id),
          chat_history: chatHistoryJson
        }
      });
    }

    res.json({ reply: response.response });
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