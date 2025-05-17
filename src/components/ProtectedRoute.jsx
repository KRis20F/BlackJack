import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  // Verificamos si hay un userId en localStorage
  const isAuthenticated = localStorage.getItem('userId') !== null;

  if (!isAuthenticated) {
    // Si no está autenticado (no hay userId), redirigimos a login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute; 