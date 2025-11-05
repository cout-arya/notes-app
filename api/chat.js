import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message, type } = req.body;

  if (!message || !type) {
    return res.status(400).json({ error: "Message and type required" });
  }

  // Build the prompt dynamically
  let prompt = "";
  switch (type) {
    case "summary":
      prompt = `Summarize the following notes in 3-5 concise bullet points:\n${message}`;
      break;

    case "quiz":
      prompt = `Create 5 multiple-choice questions with answers based on these notes. Return ONLY a valid JSON array:
[
  {"question": "Question text", "options": ["A","B","C","D"], "answer": "B"}
]
Notes: ${message}`;
      break;

    case "explain":
      prompt = `Explain the following topic in simple terms with real-world examples:\n${message}`;
      break;

    default:
      prompt = message;
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini", // ✅ Valid and available model name
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // ✅ Required metadata header
          "X-Title": "Notes AI Assistant",          // ✅ Descriptive project name
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

    // Return full error info to help debugging
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
