// src/components/layout/Footer.tsx
"use client";
import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo y copyright */}
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-white">
              Sopa de Letras
            </Link>
            <p className="mt-1 text-sm text-gray-400">
              &copy; {year} Todos los derechos reservados.
            </p>
          </div>
          
          {/* Enlaces de navegación */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white text-sm">
              Inicio
            </Link>
            <Link href="/jugar" className="text-gray-300 hover:text-white text-sm">
              Jugar
            </Link>
            <Link href="/crear" className="text-gray-300 hover:text-white text-sm">
              Crear
            </Link>
            <Link href="/perfil" className="text-gray-300 hover:text-white text-sm">
              Perfil
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};