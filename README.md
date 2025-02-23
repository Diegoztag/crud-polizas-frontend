# Sistema de Gestión de Pólizas

Sistema web para la gestión de pólizas de inventario desarrollado con React y Spring Boot.

## Características

- Gestión de pólizas de inventario
- Asignación de empleados a pólizas
- Consulta de inventario
- Interfaz de usuario moderna y responsiva
- Validaciones en tiempo real
- Notificaciones de acciones

## Tecnologías Frontend

- React 19.0.0
- Material-UI 6.4.5
- Axios para peticiones HTTP
- Framer Motion para animaciones
- Vite como build tool

## Requisitos Previos

- Node.js 18 o superior
- NPM o Yarn
- Java 17 o superior (para el backend)
- Maven (para el backend)

## Instalación y Configuración

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
```

2. Instalar las dependencias del frontend:
```bash
cd crud-polizas-frontend
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

Estructura del Proyecto

src/
├── components/     # Componentes reutilizables
├── layouts/        # Layouts de la aplicación
├── pages/          # Páginas principales
├── services/       # Servicios y llamadas API
├── context/        # Contextos de React
└── utils/          # Utilidades y helpers

Scripts Disponibles

- npm run dev : Inicia el servidor de desarrollo
- npm run build : Construye la aplicación para producción
- npm run preview : Vista previa de la build de producción
- npm run lint : Ejecuta el linter
