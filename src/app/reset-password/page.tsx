// src/app/reset-password/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { resetPassword } from '@/services/firebase/auth.service';

interface ResetPasswordFormData {
  email: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormData>();
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      await resetPassword(data.email);
      setEmailSent(true);
      toast.success('Se ha enviado un correo para restablecer tu contraseña');
    } catch (error: any) {
      console.error('Error al enviar correo de recuperación:', error);
      
      // Manejar errores específicos de Firebase
      if (error.code === 'auth/user-not-found') {
        toast.error('No hay cuenta asociada a este correo');
      } else {
        toast.error('Error al enviar correo. Por favor, intenta de nuevo');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Restablecer contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {emailSent ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Correo enviado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Hemos enviado un enlace de recuperación a tu correo electrónico. 
                Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
              </p>
              <div className="mt-6">
                <Link href="/login">
                  <Button variant="primary" fullWidth>
                    Volver a Iniciar Sesión
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={loading}
                >
                  Enviar correo de recuperación
                </Button>
              </div>

              <div className="text-sm text-center">
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Volver a iniciar sesión
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}