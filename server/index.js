const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");
const Razorpay = require('razorpay');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Allow only the specific origin for CORS
app.use(cors({
  origin: "https://techpath-scout.vercel.app", // Frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// Google Generative AI setup
const key = "AIzaSyBTd5GCKzvM4z7mnR-EqvMbcks8uePQgsY";
const genAI = new GoogleGenerativeAI(key);

app.get("/", (req, res) => {
  res.send("Welcome to the TechPath Scout Server!");
});

app.post("/generate", async (req, res) => {
  const userText = req.body.text;

  async function run() {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(userText);
      const response = await result.response;
      const text = response.text();
      console.log("Generated Response:", text);
      return text;
    } catch (error) {
      console.error("Error generating content:", error);
      return "Failed to generate content.";
    }
  }

  const story = await run();

  res.json({
    message: "Response from server",
    story,
  });
});

// Razorpay setup
const razorpayInstance = new Razorpay({
  key_id: 'rzp_live_sgeda5ZnM4PhGA',
  key_secret: 'ZmwYboqnnfcHzJB8H9vIxLad'
});

app.post('/create-order', async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // Amount in paise
    currency: 'INR',
    receipt: 'receipt_order_74394'
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    // Set CORS headers manually for this endpoint
    res.setHeader("Access-Control-Allow-Origin", "https://techpath-scout.vercel.app");
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
