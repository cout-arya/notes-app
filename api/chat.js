import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // ensures .env loads when running locally

export default async function handler(req, res) {
  // ✅ Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { message, type } = req.body;

  // ✅ Validate input
  if (!message || !type) {
    return res.status(400).json({ error: "Message and type are required" });
  }

  // ✅ Ensure API key is available
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY is missing in .env");
    return res.status(500).json({ error: "Server misconfiguration: API key missing" });
  }

  // ✅ Build prompt based on type
  let prompt;
  switch (type) {
    case "summary":
      prompt = `Summarize the following notes in 3–5 concise bullet points:\n${message}`;
      break;

    case "quiz":
      prompt = `Create 5 multiple-choice questions with answers based on these notes. Return ONLY valid JSON in this format:
[
  {"question": "Question text", "options": ["A","B","C","D"], "answer": "B"}
]
Notes: ${message}`;
      break;

    case "explain":
      prompt = `Explain the following topic in simple, easy-to-understand terms with real-world examples:\n${message}`;
      break;

    default:
      prompt = message;
  }

  try {
    // ✅ Determine correct Referer for OpenRouter header
    const referer = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:5173";

    // ✅ Send request to OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": referer,
          "X-Title": "Notes AI Assistant",
        },
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("No response received from OpenRouter model");
    }

    // ✅ Return successful response
    return res.status(200).json({ reply });
  } catch (error) {
    // ✅ Detailed logging for debugging
    console.error(
      "❌ Chat route error:",
      error.response?.data || error.message || error
    );

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unknown OpenRouter error";

    return res.status(status).json({
      success: false,
      message,
      details: error.response?.data || null,
    });
  }
}
