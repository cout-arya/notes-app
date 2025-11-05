import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext();

// Base URL — automatically switches between local and deployed
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // local backend
    : "https://your-vercel-app-name.vercel.app"; // ⬅️ replace with your Vercel URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Auto-restore login session on app load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Set Authorization header globally
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Call /api/auth/me to verify token
    axios
      .get(`${API_BASE_URL}/api/auth/me`)
      .then((res) => {
        console.log("✅ Auth restored:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.warn("⚠️ Auth restore failed:", err.response?.data || err.message);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔑 Login — save token & user
  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
  };

  // 🚪 Logout — clear everything
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // Global axios 401 interceptor — auto logout when token expires
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          console.warn("⚠️ Auto logout: token expired or invalid");
          logout();
        }
        return Promise.reject(err);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth state
export const useAuth = () => useContext(AuthContext);
