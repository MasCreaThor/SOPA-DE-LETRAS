// src/app/register/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { registerUser } from '@/services/firebase/auth.service';

interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await registerUser(data.email, data.password, data.displayName);
      toast.success('¡Registro exitoso!');
      router.push('/');
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      
      // Manejar errores específicos de Firebase
      if (error.code === 'auth/email-already-in-use') {
        toast.error('El correo electrónico ya está en uso');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Correo electrónico inválido');
      } else if (error.code === 'auth/weak-password') {
        toast.error('La contraseña es demasiado débil');
      } else {
        toast.error('Error al registrar usuario. Por favor, intenta de nuevo');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear una cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Nombre de usuario"
                type="text"
                {...register('displayName', {
                  required: 'El nombre de usuario es requerido',
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 caracteres'
                  }
                })}
                error={errors.displayName?.message}
                fullWidth
              />
            </div>

            <div>
              <Input
                label="Correo electrónico"
                type="email"
                {...register('email', {
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingresa un correo electrónico válido'
                  }
                })}
                error={errors.email?.message}
                fullWidth
              />
            </div>

            <div>
              <Input
                label="Contraseña"
                type="password"
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
                error={errors.password?.message}
                fullWidth
              />
            </div>

            <div>
              <Input
                label="Confirmar Contraseña"
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: value =>
                    value === password || 'Las contraseñas no coinciden'
                })}
                error={errors.confirmPassword?.message}
                fullWidth
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
              >
                Registrarse
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  O regístrate con
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    // Implementar registro con Google
                    toast.error('Registro con Google no implementado');
                  }}
                  leftIcon={(
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10 20 4.477 15.523 0 10 0z" />
                    </svg>
                  )}
                >
                  Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}