import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    console.log({ username, email, password }); // ✅ Debug: Check what's being sent

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        email,
        password,
      });

      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);

      // ✅ Show meaningful server error message
      alert(
        "Signup failed: " +
          (err.response?.data?.error ||
           err.response?.data?.msg ||
           "Unknown error")
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 text-center">
          <h2 className="text-white text-xl font-semibold">Signup</h2>
        </div>
        <form onSubmit={handleSignup} className="px-6 py-8">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
          >
            Signup
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-purple-500 hover:underline">
              Login now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
