const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { fetchGPTResponse } = require("./script.js");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Endpoint to handle GPT requests
app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Delegate the GPT response to script.js
    const gptResponse = await fetchGPTResponse(prompt);
    res.json({ response: gptResponse });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

app.use((req, res) => {
    res.status(404).send("Page not found");
  });