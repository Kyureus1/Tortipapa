const fs = require("fs");
const fetch = require("node-fetch");
const { Document, Packer, Paragraph, TextRun } = require("docx");

// Function to fetch SEO keywords from GPT
async function getSEOKeywords(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: `your name is Tortipapa, and you're an assistant in McCarthy Academy` },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
  return data.choices[0].message.content.trim();
}

// Function that combines GPT fetching and document creation
async function createDocumentWithKeywords(prompt) {
  try {
    // Fetch keywords from GPT
    const gptOutput = await getSEOKeywords(prompt);

    // Process GPT output into an array of keywords
    const keywords = gptOutput.split("\n").map((line) => line.trim()).filter((line) => line);

    // Create the Word document with the keywords
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: keywords.map((keyword) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: keyword,
                  font: "Arial",
                  size: 28, // 14pt font size
                }),
              ],
              spacing: { after: 200 }, // Add spacing between paragraphs
            })
          ),
        },
      ],
    });

    // Save the document
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("seo_keywords.docx", buffer);

    console.log("Document created with GPT keywords: seo_keywords.docx");
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}

module.exports = { createDocumentWithKeywords };

