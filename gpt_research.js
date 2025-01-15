const fs = require('fs');
const OpenAI = require("openai");
const {loadKnowledge, saveKnowledge, updateMemory} = require("./memory.js");

// Load environment variables
require("dotenv").config();

// Initialize OpenAI API

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function fetchTrends(topic) {
    try {
        const knowledge = await loadKnowledge();
        const memory = JSON.stringify(knowledge.memory, null, 2);
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { "role": "system", 
                    "content": `Here is the business knowledge base:
                    ${knowledge}
                    here's your memory: ${memory}
                  `},
                { "role": "user", "content": `${topic}`},
            ]
        });
        const content = response.choices[0].message.content;
        updateMemory;
        //console.log(`Trends in ${topic}:\n${content}`);
        return content;
    } catch (error) {
        console.error("Error fetching trends:", error);
        throw error;
    }
}

module.exports = fetchTrends;