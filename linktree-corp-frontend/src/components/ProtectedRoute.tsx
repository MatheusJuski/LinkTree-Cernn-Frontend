import React, { ReactElement } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;