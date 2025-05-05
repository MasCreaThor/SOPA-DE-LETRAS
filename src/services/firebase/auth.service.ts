// src/services/firebase/auth.service.ts
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    User
  } from 'firebase/auth';
  import { auth, database } from '@/lib/firebase';
  import { ref, set } from 'firebase/database';
  
  export const registerUser = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Actualizar el perfil con el nombre de usuario
      await updateProfile(user, { displayName });
      
      // Crear perfil en la base de datos
      await set(ref(database, `users/${user.uid}`), {
        email,
        displayName,
        createdAt: new Date().toISOString(),
        stats: {
          gamesPlayed: 0,
          gamesCreated: 0,
          wordsFound: 0,
          bestScore: 0
        }
      });
      
      return user;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  };
  
  export const loginUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };
  
  export const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };
  
  export const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error);
      throw error;
    }
  };
  
  export const updateUserProfile = async (user: User, data: { displayName?: string, photoURL?: string }) => {
    try {
      await updateProfile(user, data);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  };