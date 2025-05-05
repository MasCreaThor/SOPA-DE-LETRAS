// src/components/layout/Header.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/services/firebase/auth.service';

export const Header: React.FC = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  const isActive = (path: string) => pathname === path;
  
  const navigationItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Jugar', href: '/jugar' },
    { name: 'Crear', href: '/crear' },
  ];
  
  const userNavigationItems = [
    { name: 'Perfil', href: '/perfil' },
    { name: 'Cerrar Sesión', onClick: handleLogout }
  ];
  
  return (
    <header className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white font-bold text-xl">
                Sopa de Letras
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    ${isActive(item.href) 
                      ? 'bg-blue-700 text-white' 
                      : 'text-white hover:bg-blue-500'}
                    px-3 py-2 rounded-md text-sm font-medium
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Botones de autenticación */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!loading && (
              <>
                {user ? (
                  <div className="ml-3 relative">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="bg-blue-700 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        id="user-menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      >
                        <span className="sr-only">Abrir menú de usuario</span>
                        <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                      </button>
                      <span className="ml-2 text-white text-sm font-medium">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </div>
                    
                    {/* Menú desplegable */}
                    {mobileMenuOpen && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                        tabIndex={-1}
                      >
                        {userNavigationItems.map((item) => (
                          item.href ? (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <button
                              key={item.name}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              onClick={() => {
                                if (item.onClick) item.onClick();
                                setMobileMenuOpen(false);
                              }}
                            >
                              {item.name}
                            </button>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <Link
                      href="/login"
                      className="text-white bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/register"
                      className="text-blue-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Botón de menú móvil */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Menú móvil */}
      <div
        className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                ${isActive(item.href)
                  ? 'bg-blue-700 text-white'
                  : 'text-white hover:bg-blue-700'}
                block px-3 py-2 rounded-md text-base font-medium
              `}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Menú de usuario móvil */}
        {!loading && (
          <div className="pt-4 pb-3 border-t border-blue-700">
            {user ? (
              <>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center text-white text-lg">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {user.displayName || 'Usuario'}
                    </div>
                    <div className="text-sm font-medium text-blue-300">
                      {user.email || ''}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {userNavigationItems.map((item) => (
                    item.href ? (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <button
                        key={item.name}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                        onClick={() => {
                          if (item.onClick) item.onClick();
                          setMobileMenuOpen(false);
                        }}
                      >
                        {item.name}
                      </button>
                    )
                  ))}
                </div>
              </>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-700 hover:bg-blue-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};