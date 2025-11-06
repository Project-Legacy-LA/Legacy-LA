import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requireRoles = [], requireSuperuser = false }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <div className="text-lg font-medium">Checking access…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.status && user.status !== 'active') {
    return <Navigate to="/login" replace state={{ reason: 'disabled' }} />;
  }

  if (requireSuperuser && !user.is_superuser) {
    return <Navigate to="/" replace />;
  }

  if (requireRoles.length > 0 && !user.is_superuser) {
    const roles = user.roles || [];
    const hasRole = roles.some(role => requireRoles.includes(role));
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
