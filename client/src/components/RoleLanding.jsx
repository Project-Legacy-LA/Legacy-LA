import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RoleLanding() {
  const navigate = useNavigate();
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (initializing) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (user.is_superuser) {
      navigate('/superuser/invite-attorney', { replace: true });
      return;
    }

    const roles = user.roles || [];
    if (roles.includes('attorney_owner')) {
      navigate('/attorney', { replace: true });
      return;
    }

    navigate('/', { replace: true });
  }, [user, initializing, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="text-lg font-medium">Preparing your workspace…</div>
    </div>
  );
}
