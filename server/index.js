const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const key = "AIzaSyBTd5GCKzvM4z7mnR-EqvMbcks8uePQgsY";

const genAI = new GoogleGenerativeAI(key);

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

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
