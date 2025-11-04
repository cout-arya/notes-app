import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ Backend returns: { accessToken, user }
      const { accessToken, user } = res.data;

      // ✅ Save token
      localStorage.setItem("token", accessToken);

      // ✅ Set header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // ✅ Update context (so Navbar & others know user is logged in)
      login({ token: accessToken, user });

      // ✅ Redirect
      navigate("/notes");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Login failed: " + (err.response?.data?.msg || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 py-4 text-center">
          <h2 className="text-white text-xl font-semibold">Login Form</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-8">
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
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-purple-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">
            Not a member?{" "}
            <Link to="/signup" className="text-purple-500 hover:underline">
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
