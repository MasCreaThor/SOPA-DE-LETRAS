// src/context/AuthContext.tsx
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/services/firebase/database.service';
import { User } from '@/types/user.types';
import { UserProfile } from '@/types/wordSearch.types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Suscribirse a cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        try {
          setLoading(true);

          if (firebaseUser) {
            // Usuario autenticado
            const userWithProfile = firebaseUser as User;
            
            try {
              // Obtener perfil desde la base de datos
              const profile = await getUserProfile(firebaseUser.uid);
              userWithProfile.profile = profile;
              setUserProfile(profile);
            } catch (err) {
              console.error('Error al cargar perfil de usuario:', err);
              // Continuar incluso si el perfil no se puede cargar
              // Esto permite que el usuario siga autenticado
            }
            
            setUser(userWithProfile);
          } else {
            // Usuario no autenticado
            setUser(null);
            setUserProfile(null);
          }
        } catch (err) {
          console.error('Error en estado de autenticación:', err);
          setError(err instanceof Error ? err : new Error('Error en autenticación'));
        } finally {
          setLoading(false);
        }
      }
    );

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, []);

  // Proporcionar los valores del contexto
  const value = {
    user,
    userProfile,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};