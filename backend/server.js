const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route to generate blog content
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const openrouterResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions ",
      {
        model: "qwen/qwen-2.5-72b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Return only the generated content
    res.json({
      content: openrouterResponse.data.choices[0]?.message?.content || ⚠️ No content returned."
    });

  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: "Failed to generate blog." });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Blog Generator Backend is running!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});