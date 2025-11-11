import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

// Automatically choose API base URL
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://edunote.vercel.app"; // 🔹 Replace with your actual Vercel app name

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore login session when app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔑 Login
  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // 🔍 Global 401 interceptor for expired tokens
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

export const useAuth = () => useContext(AuthContext);
