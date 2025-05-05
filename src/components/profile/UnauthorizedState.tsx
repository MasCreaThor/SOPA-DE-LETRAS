// src/components/profile/UnauthorizedState.tsx
import React from 'react';
import { useRouter } from 'next/navigation';

const UnauthorizedState: React.FC = () => {
  const router = useRouter();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
        <p className="text-lg mb-6">Debes iniciar sesión para ver tu perfil.</p>
        <button
          onClick={() => router.push('/login')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedState;