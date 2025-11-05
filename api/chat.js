const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message, type } = req.body;

  if (!message || !type) return res.status(400).json({ error: "Message and type required" });

  let prompt = "";
switch(type) {
  case "summary":
    prompt = `Summarize the following notes in 3-5 bullet points:\n${message}`;
    break;

  case "quiz":
    prompt = `Create 5 multiple-choice questions with answers based on the following notes. 
Return them as JSON in this format:
[
  {"question": "Question text", "options": ["A","B","C","D"], "answer": "B"},
  ...
]
Notes: ${message}`;
    break;

  case "explain":
    prompt = `Explain the following topic in simple terms with examples:\n${message}`;
    break;

  default:
    prompt = message;
}


  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
