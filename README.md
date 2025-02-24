# Sistema de Gestión de Pólizas Frontend

## Descripción
Sistema web para la gestión de pólizas de inventario desarrollado con React. Permite el control y seguimiento de pólizas, asignación de empleados y gestión de inventario a través de una interfaz moderna y responsiva.

## Características Principales

- ✨ Gestión completa de pólizas de inventario (CRUD)
- 👥 Asignación dinámica de empleados a pólizas
- 📦 Consulta en tiempo real del inventario
- 🎨 Interfaz de usuario moderna y responsiva
- ✅ Validaciones en tiempo real
- 🔔 Sistema de notificaciones
- 🔍 Búsqueda y filtrado avanzado
- 📱 Diseño adaptativo (responsive)

## Tecnologías Utilizadas

- **React** v19.0.0 - Framework principal
- **Material-UI** v6.4.5 - Componentes de interfaz
- **Axios** v1.7.9 - Cliente HTTP
- **Framer Motion** v12.4.7 - Animaciones
- **React Router DOM** v7.2.0 - Enrutamiento
- **Vite** v6.1.0 - Build tool

## Requisitos Previos

- Node.js 18 o superior
- NPM o Yarn
- Conexión al backend (Spring Boot)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
```

2. Instalar dependencias:
```bash
cd crud-polizas-frontend
npm install
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```
## Estructura del Proyecto

```plaintext
src/
├── components/     # Componentes reutilizables
├── layouts/        # Layouts de la aplicación
├── pages/         # Páginas principales
│   └── polizas/   # Componentes específicos de pólizas
├── services/      # Servicios y llamadas API
├── context/       # Contextos de React
├── routes/        # Configuración de rutas
└── utils/         # Utilidades y helpers
```

## Scripts Disponibles

- npm run dev - Inicia el servidor de desarrollo
- npm run build - Construye la aplicación para producción
- npm run preview - Vista previa de la build de producción
- npm run lint - Ejecuta el linter

## Características Detalladas

### Gestión de Pólizas
- Creación de nuevas pólizas
- Edición de pólizas existentes
- Eliminación de pólizas
- Visualización detallada
### Sistema de Búsqueda
- Filtrado por múltiples campos
- Ordenamiento personalizado
- Búsqueda en tiempo real
### Interfaz de Usuario
- Diseño Material Design
- Animaciones fluidas
- Feedback visual inmediato
- Mensajes de confirmación
- Modales interactivos

## Integración con Backend
El frontend se comunica con un backend Spring Boot a través de una API REST. La configuración de la conexión se realiza en:

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}
```
