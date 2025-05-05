# Sopa de Letras

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38b2ac)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)

Una aplicación web moderna para crear, jugar y compartir sopas de letras personalizadas.

![Captura de pantalla de la aplicación](https://via.placeholder.com/1200x600?text=Sopa+de+Letras)

## 🚀 Características

- ✏️ **Creación Personalizada**: Diseña sopas de letras con tus propias palabras y descripciones
- 🎮 **Experiencia de Juego Intuitiva**: Sistema de selección que funciona con ratón y pantalla táctil
- 🔄 **Sincronización en Tiempo Real**: Los datos se sincronizan instantáneamente entre dispositivos
- 👤 **Perfiles de Usuario**: Seguimiento de estadísticas y logros personales
- 🌐 **Compartir**: Comparte fácilmente tus creaciones con amigos
- 📱 **Diseño Responsivo**: Funciona perfectamente en dispositivos móviles y escritorio
- 🎯 **Diferentes Niveles de Dificultad**: Desde sencillo para principiantes hasta desafiante para expertos

## 🛠️ Tecnologías

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Realtime Database)
- **Despliegue**: Vercel

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm (versión 8 o superior)
- Cuenta de Firebase
- Cuenta de Vercel (para despliegue)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/MasCreaThor/SOPA-DE-LETRAS.git
cd sopa-de-letras
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (correo electrónico/contraseña)
3. Configura Realtime Database
4. Copia la configuración de Firebase

### 4. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=tu_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🚀 Despliegue

### Desplegar en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftu-usuario%2Fsopa-de-letras)

1. Haz clic en el botón de arriba o importa manualmente el proyecto en Vercel
2. Configura las variables de entorno de Firebase
3. ¡Despliega!

Para más detalles, consulta la [Guía de Despliegue](docs/deployment-guide.md).

## 📁 Estructura del Proyecto

```
/
├── src/
│   ├── app/                # Páginas de la aplicación (Next.js App Router)
│   ├── components/         # Componentes React reutilizables
│   ├── services/           # Servicios (Firebase, lógica de juego)
│   ├── hooks/              # Hooks personalizados
│   ├── utils/              # Utilidades y helpers
│   ├── context/            # Contextos de React
│   ├── types/              # Definiciones de TypeScript
│   ├── lib/                # Configuraciones (Firebase)
│   └── styles/             # Estilos globales
├── public/                 # Archivos estáticos
└── docs/                   # Documentación adicional
```

## 📖 Guías de Uso

### Jugar una Sopa de Letras

1. Navega a la página principal y haz clic en "Jugar Ahora"
2. Selecciona una sopa de letras de la lista
3. Lee las descripciones y encuentra las palabras correspondientes en la cuadrícula
4. Selecciona las letras arrastrando el cursor o dedo para formar palabras
5. ¡Encuentra todas las palabras antes de que se acabe el tiempo!

### Crear una Sopa de Letras

1. Inicia sesión y navega a "Crear Nuevo"
2. Añade palabras y sus descripciones usando el formulario
3. Configura el título, descripción y dificultad
4. Haz clic en "Generar Cuadrícula" para visualizar tu sopa de letras
5. Si estás satisfecho, haz clic en "Guardar Sopa de Letras"
6. ¡Comparte el enlace con tus amigos!

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con cobertura
npm run test:coverage
```

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👏 Reconocimientos

- Iconos de [Heroicons](https://heroicons.com/)
- Plantillas de Tailwind de [Tailwind UI](https://tailwindui.com/)
- Animaciones inspiradas en [Framer Motion](https://www.framer.com/motion/)

## 📞 Contacto

¿Preguntas o sugerencias? ¡Contáctanos!

- Proyecto: [https://github.com/MasCreaThor/SOPA-DE-LETRAS.git]
- Email: yamunozr22@itp.edu.co

---

Desarrollado con ❤️ por MasCreaThor