// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token'); // Check for the token

  // If a token exists, render the child component (e.g., Dashboard).
  // If not, redirect to the login page.
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;