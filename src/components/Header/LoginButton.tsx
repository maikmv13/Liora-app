import React from 'react';
import { useAuth } from '../HealthTracker/contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function LoginButton() {
  const { user } = useAuth();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        Cerrar sesión
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      Iniciar sesión
    </button>
  );
} 