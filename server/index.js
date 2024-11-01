const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");

const app = express();


app.use(express.json());

const cors = require("cors");
app.use(cors({
  origin: true, // Allows all origins
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));


// Add this before your other routes
app.options('*', cors()); // Enable preflight requests for all routes
const key = "AIzaSyBTd5GCKzvM4z7mnR-EqvMbcks8uePQgsY";

const genAI = new GoogleGenerativeAI(key);

app.get("/", (req, res) => {
  res.send("Welcome to the TechPath Scout Server!");
});

app.post("/generate", async (req, res) => {
  const userText = req.body.text; // Get text from request body

  console.log("User Text:", userText);

  async function run() {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Use the text sent from the client as the prompt
      const result = await model.generateContent(userText);

      const response = await result.response;
      const text = response.text();
      console.log(text);// Adjust based on the actual API response structure

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












const Razorpay = require('razorpay');
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
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});










app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
