import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

dotenv.config();

// --- TEMPORARY DEBUGGING ---
console.log("Attempting to load Gemini API Key:", process.env.GEMINI_API_KEY);
// --- END DEBUGGING ---

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Initialize the model
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

// Define the chat route
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

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



