import axios from "axios";

export default async function handler(req, res) {
  // ✅ Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message, type } = req.body;

  // ✅ Validate input
  if (!message || !type) {
    return res.status(400).json({ error: "Message and type required" });
  }

  // ✅ Build prompt dynamically based on type
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
    // ✅ Pick correct Referer based on environment
    const referer =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}` // Vercel production URL
        : "http://localhost:5173"; // Local dev frontend

    // ✅ Make request to OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini", // ✅ A lightweight & fast model
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ Must exist
          "Content-Type": "application/json",
          "HTTP-Referer": referer, // ✅ Required by OpenRouter
          "X-Title": "Notes AI Assistant", // ✅ Your app name
        },
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("No response returned by model");
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Chat route error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown OpenRouter error",
      details: error.response?.data || null,
    });
  }
}
