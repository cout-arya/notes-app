import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import React from 'react';
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // wait for user to load

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
