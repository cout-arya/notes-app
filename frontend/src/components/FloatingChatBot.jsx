import React, { useState, useRef, useEffect } from "react";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [type, setType] = useState("summary");
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input) return;
    setChat([...chat, { sender: "user", text: input, type: "user" }]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, type }),
      });
      const data = await res.json();

      let formattedReply = data.reply;

      if (type === "quiz") {
        try {
          const quiz = JSON.parse(data.reply);
          formattedReply = quiz;
        } catch (e) {
          console.error("Failed to parse quiz JSON:", e);
        }
      } else if (type === "summary" || type === "explain") {
        formattedReply = data.reply.split("\n").filter((line) => line.trim() !== "");
      }

      setChat((prev) => [...prev, { sender: "bot", text: formattedReply, type }]);
      setInput("");
    } catch (error) {
      console.error(error);
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Try again.", type: "error" },
      ]);
    }
  };

  const toggleAnswer = (key) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transform transition duration-300 z-50"
      >
        <ChatBubbleOvalLeftIcon className="w-8 h-8" />
      </button>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleChat}
        ></div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-2/3 lg:w-1/2 h-3/4 bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-t-3xl shadow-md">
            <h3 className="font-bold text-xl">Your AI Buddy</h3>
            <button
              onClick={toggleChat}
              className="text-2xl font-bold hover:text-gray-200 transition"
            >
              ✖
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-2xl shadow ${
                  c.sender === "user"
                    ? "bg-gradient-to-r from-green-300 to-green-200 ml-auto text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                {/* Quiz Type */}
                {c.type === "quiz" && Array.isArray(c.text) ? (
                  <div className="space-y-3">
                    {c.text.map((q, idx) => {
                      const key = `${i}-${idx}`;
                      return (
                        <div
                          key={idx}
                          className="bg-gray-100 p-3 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                          <p className="font-semibold mb-1">
                            {idx + 1}. {q.question}
                          </p>
                          <ul className="list-disc list-inside mb-2">
                            {q.options.map((opt, j) => (
                              <li key={j}>{opt}</li>
                            ))}
                          </ul>

                          {/* Toggle Button */}
                          <button
                            onClick={() => toggleAnswer(key)}
                            className="text-blue-600 text-sm font-medium hover:underline"
                          >
                            {revealedAnswers[key] ? "Hide Answer" : "Show Answer"}
                          </button>

                          {/* Animated Reveal */}
                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              revealedAnswers[key]
                                ? "max-h-20 opacity-100 mt-2"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <p className="text-sm font-bold bg-green-100 p-2 rounded-md">
                              ✅ Answer: {q.answer}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : Array.isArray(c.text) ? (
                  // Summary or Explain
                  <ul className="list-disc list-inside space-y-1">
                    {c.text.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  // Default plain text
                  <p>{c.text}</p>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex gap-3 p-4 border-t border-gray-300">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border px-4 py-2 rounded-2xl text-sm bg-white/80 focus:outline-none"
            >
              <option value="summary">Summary</option>
              <option value="quiz">Quiz</option>
              <option value="explain">Explain</option>
            </select>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border px-4 py-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Type your note or question..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="bg-gradient-to-br from-green-500 to-blue-500 text-white px-6 py-2 rounded-2xl hover:scale-105 transform transition duration-200"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatBot;
