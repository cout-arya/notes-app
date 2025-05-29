import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import React from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    

    if (token) {
      // 👇✅ Set default headers globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .get("/api/auth/me")
        .then((res) => {
          console.log("✅ Me route response:", res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.error("❌ Auth restore failed:", err);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);

    // 👇✅ Also set default headers after login
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
