import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, requiredLevel }) {
  const location = useLocation();

  const hasPermission = location.state?.authLevel === requiredLevel;

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;