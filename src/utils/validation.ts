// src/utils/validation.ts
  /**
   * Validación de correo electrónico
   */
  export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validación de contraseña
   */
  export const isValidPassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
      return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    
    return { valid: true };
  };
  
  /**
   * Validación del nombre de usuario
   */
  export const isValidUsername = (username: string): { valid: boolean; message?: string } => {
    if (username.length < 3) {
      return { valid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { 
        valid: false, 
        message: 'El nombre de usuario solo puede contener letras, números y guiones bajos' 
      };
    }
    
    return { valid: true };
  };
