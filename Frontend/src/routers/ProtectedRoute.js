import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if there's an access_token in sessionStorage
  const token = sessionStorage.getItem('access_token'); // Adjusted for sessionStorage

  if (!token) {
    return <Navigate to="*" replace />; // Redirect to signin if no token is found
  }

  return <Outlet />; // Render child routes if authenticated
};

export default ProtectedRoute;
