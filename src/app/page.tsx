// src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Sopa de Letras</span>
              <span className="block text-blue-200">Crea, Juega, Comparte</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-blue-100">
              Crea tus propias sopas de letras personalizadas, juega con las creaciones de otros usuarios y comparte tus mejores diseños.
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <Link href="/jugar">
                  <Button variant="warning" size="lg">
                    Jugar Ahora
                  </Button>
                </Link>
                <Link href="/crear">
                  <Button variant="secondary" size="lg">
                    Crear Nuevo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="text-base text-blue-600 font-semibold tracking-wide uppercase">Características</p>
            <h2 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Una forma divertida de aprender
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Nuestra plataforma de sopas de letras te ofrece una experiencia completa para divertirte y aprender.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Crea tus propias sopas</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Diseña sopas de letras personalizadas con palabras y descripciones propias. Ajusta la dificultad a tu gusto.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Juega online</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Disfruta de una experiencia de juego fluida con nuestro sistema de selección intuitivo. Compite por los mejores tiempos.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Comparte y descubre</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Comparte tus creaciones y descubre sopas de letras creadas por otros usuarios con temáticas variadas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Games Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <p className="text-base text-blue-600 font-semibold tracking-wide uppercase">Juegos Recientes</p>
            <h2 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              ¡Explora y juega!
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Descubre las sopas de letras más populares y recientes creadas por nuestra comunidad.
            </p>
          </div>

          {/* Aquí se mostraría un componente para listar juegos recientes */}
          <div className="text-center">
            <p className="text-gray-500 mb-6">Cargando juegos recientes...</p>
            <Link href="/jugar">
              <Button variant="primary" size="lg">
                Ver todos los juegos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">¿Listo para empezar?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Crea tu cuenta para guardar tus puntuaciones, crear tus propias sopas de letras y competir con otros usuarios.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link href="/register">
                <Button variant="warning" size="lg">
                  Crear Cuenta
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}