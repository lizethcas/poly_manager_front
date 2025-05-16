# Poly Manager Front

## Descripción
Poly Manager Front es una plataforma de gestión educativa desarrollada con Nuxt 3, que permite la administración de cursos en línea. La aplicación ofrece diferentes interfaces para estudiantes y profesores, permitiendo a los estudiantes acceder a los cursos disponibles y a los profesores gestionar el contenido de sus cursos.

## Características Principales
- **Panel de Control**: Visualización de estadísticas y resumen de actividades.
- **Gestión de Cursos**: Creación, edición y eliminación de cursos para profesores.
- **Visualización de Cursos**: Interfaz amigable para que los estudiantes naveguen por los cursos disponibles.
- **Chat Integrado**: Sistema de comunicación en tiempo real con asistente IA.
- **Diseño Responsivo**: Interfaz adaptable a dispositivos móviles y de escritorio.
- **Gestión de Usuarios**: Sistema de perfiles para diferentes roles (estudiantes, profesores, administradores).

## Tecnologías Utilizadas
- **Nuxt 3**: Framework basado en Vue.js para creación de aplicaciones web.
- **Vue Query**: Gestión de estado y solicitudes a API.
- **Pinia**: Gestión del estado de la aplicación con persistencia.
- **Vuetify**: Componentes UI y sistema de diseño.
- **Tailwind CSS**: Framework de utilidades CSS para el diseño.
- **TypeScript**: Tipado estático para mejorar la calidad del código.
- **Axios**: Cliente HTTP para realizar peticiones a APIs.

## Requisitos Previos
- Node.js >= 16.x
- Yarn >= 1.22 (recomendado) o npm

## Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd poly_manager_front

# Instalar dependencias
yarn install
# o con npm
npm install
```

## Configuración
La aplicación utiliza variables de entorno para configurar aspectos como la URL de la API. Para configurar el proyecto:

1. Crea un archivo `.env` en la raíz del proyecto (si no existe).
2. Agrega las variables necesarias siguiendo el ejemplo de `.env.example`.

## Desarrollo

```bash
# Iniciar servidor de desarrollo
yarn dev
# o con npm
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:3000`.

## Construcción para Producción

```bash
# Generar build de producción
yarn build
# o con npm
npm run build

# Previsualizar build de producción localmente
yarn preview
# o con npm
npm run preview
```

## Despliegue
El proyecto está configurado para despliegue en GitHub Pages:

```bash
# Generar y desplegar
yarn deploy
# o con npm
npm run deploy
```

Para otros entornos de despliegue, consulta la [documentación de Nuxt](https://nuxt.com/docs/getting-started/deployment).

## Estructura del Proyecto
```
poly_manager_front/
├── assets/         # Recursos estáticos (CSS, imágenes)
├── components/     # Componentes Vue reutilizables
├── composables/    # Composables de Vue para lógica reutilizable
├── data/           # Datos estáticos y constantes
├── interfaces/     # Definiciones de tipos TypeScript
├── layouts/        # Layouts de la aplicación
├── pages/          # Páginas y rutas
├── plugins/        # Plugins de Nuxt
├── public/         # Archivos públicos
├── server/         # Servidor Nuxt (API, middlewares)
├── services/       # Servicios para comunicación con APIs
├── stores/         # Tiendas Pinia para gestión de estado
└── utils/          # Utilidades y funciones helpers
```




