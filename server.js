const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { createDocumentWithKeywords } = require('./generateKeywordsDoc');
const { handleNonSEOPrompt } = require("./script");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Endpoint to handle general GPT requests
app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Determine if the prompt is SEO-related
    if (prompt.toLowerCase().includes("seo")) {
      // Handle SEO prompt
      await createDocumentWithKeywords(prompt);
      res.json({ message: "The SEO document has been created successfully." });
    } else {
      // Handle non-SEO prompt
      const response = await handleNonSEOPrompt(prompt);
      res.json({ message: "Non-SEO response processed successfully.", response });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: error.message || "An error occurred" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});