import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notes from "./pages/Notes";

// Components
import PrivateRoute from "./components/PrivateRoute";

function NotesLayout() {
  return (
    <div className="flex h-screen text-white bg-gray-900">
      <div className="flex-1 flex flex-col">
        <Notes />
      </div>
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Route - Notes */}
        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <NotesLayout />
            </PrivateRoute>
          }
        />

        {/* Redirect to /notes if logged in, else to /login */}
        <Route
          path="/"
          element={<Navigate to={user ? "/notes" : "/login"} replace />}
        />
        
        {/* Catch-all route (optional) */}
        <Route
          path="*"
          element={<Navigate to={user ? "/notes" : "/login"} replace />}
        />
      </Routes>
  );
}

export default App;
