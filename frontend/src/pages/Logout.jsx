// src/pages/Notes.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from 'react';

const Notes = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Your Notes</h1>

      {/* Add this logout button at the top/right */}
      <button onClick={handleLogout} style={{ float: "right" }}>
        Logout
      </button>

      {/* Notes display and logic here */}
    </div>
  );
};

export default Notes;
