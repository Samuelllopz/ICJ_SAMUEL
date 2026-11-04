import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export type UserRole = 'admin' | 'user';

export interface UserSession {
  username: string;
  name: string;
  role: UserRole;
  email?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAdmin: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  login: async () => false,
  loginAs: () => {},
  logout: () => {},
});

const AUTH_STORAGE_KEY = 'icj-multimedia-auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Por defecto: Modo Usuario Normal (Solo Navegación)
    return {
      username: 'usuario',
      name: 'Usuario Visitante',
      role: 'user',
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (username: string, pass: string): Promise<boolean> => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Credenciales rápidas de Administrador (Modificar todo)
    if (
      (cleanUser === 'admin' && cleanPass === 'icjadmin2026') ||
      (cleanUser === 'admin' && cleanPass === 'admin123') ||
      (cleanUser === 'administrador' && cleanPass === 'icjadmin2026')
    ) {
      setUser({
        username: 'admin',
        name: 'Encargado Multimedia (Admin)',
        role: 'admin',
      });
      return true;
    }

    // 2. Credenciales rápidas de Usuario Normal (Solo Navegación)
    if (
      (cleanUser === 'usuario' && cleanPass === 'icj2026') ||
      (cleanUser === 'usuario' && cleanPass === '1234') ||
      (cleanUser === 'lector' && cleanPass === 'icj2026')
    ) {
      setUser({
        username: 'usuario',
        name: 'Miembro ICJ (Navegación)',
        role: 'user',
      });
      return true;
    }

    // 3. Si está configurado Supabase Auth y el usuario introdujo un correo
    if (isSupabaseConfigured && cleanUser.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanUser,
          password: cleanPass,
        });

        if (!error && data?.user) {
          const roleFromMeta: UserRole =
            data.user.user_metadata?.role === 'admin' ||
            cleanUser.startsWith('admin')
              ? 'admin'
              : 'user';

          setUser({
            username: cleanUser,
            name: data.user.user_metadata?.name || (roleFromMeta === 'admin' ? 'Administrador Cloud' : 'Usuario Cloud'),
            role: roleFromMeta,
            email: data.user.email,
          });
          return true;
        }
      } catch (err) {
        console.warn('Error en Supabase Auth:', err);
      }
    }

    return false;
  };

  const loginAs = (role: UserRole) => {
    if (role === 'admin') {
      setUser({
        username: 'admin',
        name: 'Encargado Multimedia (Admin)',
        role: 'admin',
      });
    } else {
      setUser({
        username: 'usuario',
        name: 'Miembro ICJ (Navegación)',
        role: 'user',
      });
    }
  };

  const logout = () => {
    setUser({
      username: 'usuario',
      name: 'Usuario Visitante',
      role: 'user',
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
