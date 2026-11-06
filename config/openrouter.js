const { OpenAI } = require("openai");

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://ovmvigive-web.vercel.app", // Aapki website ka URL
    "X-Title": "OmniGive Dating App",
  },
});

module.exports = openrouter;