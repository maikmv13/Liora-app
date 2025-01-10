import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ChevronLeft, User, UserCog, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Register } from '../Register';

interface LoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function Login({ onClose, onLoginSuccess }: LoginProps) {
  // ... rest of the component remains the same ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login')) {
          throw new Error('Correo electrónico o contraseña incorrectos');
        }
        if (signInError.message.includes('Email not confirmed')) {
          throw new Error('Por favor, confirma tu correo electrónico');
        }
        throw signInError;
      }

      if (user) {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          if (profileError.message.includes('Results contain 0 rows')) {
            throw new Error('Perfil no encontrado. Por favor, contacta con soporte.');
          }
          throw profileError;
        }
        
        if (userType && profiles.user_type !== userType) {
          throw new Error(`Esta cuenta no está registrada como ${userType === 'user' ? 'usuario' : 'nutricionista'}`);
        }

        onLoginSuccess();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component remains the same ...
}