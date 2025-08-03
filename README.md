# 🌤️ WeatherWidget

**Widget meteorológico moderno que muestra clima actual, pronóstico, búsqueda de ciudades y mapa interactivo.**

## 📋 Tabla de Contenidos

- [Información del Proyecto](#información-del-proyecto)
- [Configuración](#configuración)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Patrones de Diseño](#patrones-de-diseño)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)

## ℹ️ Información del Proyecto

WeatherWidget es una aplicación web moderna que proporciona información meteorológica en tiempo real. Permite buscar ciudades, visualizar el clima actual y pronósticos, y explorar ubicaciones en un mapa interactivo.

### Características Principales

- 🔍 **Búsqueda Inteligente**: Autocompletado con sugerencias de ciudades
- 🌡️ **Clima Actual**: Temperatura, humedad, viento y condiciones atmosféricas
- 📅 **Pronóstico**: Predicciones para los próximos días
- 🗺️ **Mapa Interactivo**: Visualización geográfica con Leaflet
- 📍 **Geolocalización**: Detección automática de ubicación
- 💾 **Persistencia**: Historial de búsquedas guardado localmente
- 📱 **Responsive**: Diseño adaptativo para todos los dispositivos

## ⚙️ Configuración

### Requisitos Previos

- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd WeatherWidget
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   cp .env.example .env
   ```
   
   Editar `.env` con tus credenciales:
   ```env
   VITE_API_KEY=tu_api_key_de_openweathermap
   VITE_BASE_URL=https://api.openweathermap.org
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Ejecuta linting del código |

## 🏗️ Arquitectura

### Patrón de Arquitectura

La aplicación sigue una **arquitectura modular basada en features** con separación clara de responsabilidades:

```
src/
├── app/                 # Configuración global
│   ├── components/      # Componentes principales
│   ├── providers/       # Proveedores de contexto
│   ├── store/          # Store de Redux
│   └── styles/         # Estilos globales
├── features/           # Módulos de funcionalidades
│   ├── weather/        # Funcionalidad meteorológica
│   ├── search/         # Búsqueda de ciudades
│   └── map/           # Mapa interactivo
└── shared/            # Código reutilizable
    ├── hooks/         # Hooks personalizados
    ├── services/      # Servicios HTTP
    ├── utils/         # Utilidades
    └── types/         # Tipos compartidos
```

### Principios de Diseño

- **SOLID**: Separación de responsabilidades
- **DRY**: Evitar duplicación de código
- **KISS**: Mantener simplicidad
- **Feature-based**: Organización por funcionalidades

## 🛠️ Tecnologías

### Frontend
- **React 19.1.0**: Biblioteca de UI
- **TypeScript 5.8.3**: Tipado estático
- **Vite 7.0.4**: Build tool y dev server
- **SASS 1.89.2**: Preprocesador CSS

### Estado y Datos
- **Redux Toolkit 2.8.2**: Gestión de estado
- **Redux Persist 6.0.0**: Persistencia de datos
- **TanStack Query 5.84.1**: Cache y sincronización de datos

### UI/UX
- **Ant Design 5.26.7**: Componentes de UI
- **Leaflet 1.9.4**: Mapas interactivos
- **React Leaflet 5.0.0**: Integración React-Leaflet

### Utilidades
- **Axios 1.11.0**: Cliente HTTP
- **date-fns 4.1.0**: Manipulación de fechas
- **ESLint 9.30.1**: Linting de código

## 🎯 Patrones de Diseño

### 1. **Feature-Slice Design**
Cada feature es un módulo independiente con su propia estructura:
```
feature/
├── components/     # Componentes específicos
├── hooks/         # Hooks de la feature
├── services/      # Llamadas a API
├── store/         # Estado Redux
└── types/         # Tipos TypeScript
```

### 2. **Custom Hooks Pattern**
Hooks personalizados para lógica reutilizable:
- `useWeather`: Gestión de datos meteorológicos
- `useSearch`: Búsqueda de ciudades
- `useLazyBackground`: Carga diferida de imágenes
- `useDebounce`: Optimización de búsquedas

### 3. **Provider Pattern**
Proveedores de contexto para inyección de dependencias:
- `ReduxProvider`: Estado global
- `QueryProvider`: Cache de datos
- `MessageProvider`: Notificaciones

### 4. **Service Layer Pattern**
Capa de servicios para comunicación con APIs:
- `HttpClient`: Cliente HTTP centralizado
- `WeatherApiService`: Servicios meteorológicos
- `SearchApiService`: Servicios de búsqueda

### 5. **Selector Pattern**
Selectores para acceso eficiente al estado:
- Selectores básicos para cada slice
- Selectores derivados para datos computados
- Memoización con `createSelector`

## 📁 Estructura del Proyecto

### Módulos Principales

#### **Weather Feature**
- **Componentes**: `CurrentWeather`, `WeatherDetails`, `WeatherHeader`
- **Hooks**: `useWeather`, `useWeatherAndForecast`
- **Servicios**: `weatherApi.ts`
- **Estado**: `weatherSlice.ts`

#### **Search Feature**
- **Componentes**: `SearchBar`, `SearchSuggestions`, `RecentSearchesPanel`
- **Hooks**: `useSearch`, `useSmartSuggestions`, `useHistoryManagement`
- **Servicios**: `searchApi.ts`
- **Estado**: `searchSlice.ts`

#### **Map Feature**
- **Componentes**: `MapComponent`, `MapWrapper`, `MapUpdater`
- **Hooks**: `useMapState`, `useMapSelection`
- **Estado**: `mapSlice.ts`

### Hooks Compartidos

| Hook | Descripción |
|------|-------------|
| `useDebounce` | Optimiza llamadas a API |
| `useGeolocation` | Maneja geolocalización |
| `useProgressBar` | Controla barra de progreso |
| `useAutoScroll` | Scroll automático |
| `useLazyBackground` | Carga diferida de fondos |

### Servicios

| Servicio | Función |
|----------|---------|
| `HttpClient` | Cliente HTTP con interceptores |
| `ErrorHandler` | Manejo centralizado de errores |
| `WeatherApiService` | APIs meteorológicas |
| `SearchApiService` | APIs de geocoding |

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
VITE_API_KEY=tu_api_key_de_openweathermap
VITE_BASE_URL=https://api.openweathermap.org
```

### Alias de Importación

| Alias | Ruta |
|-------|------|
| `@` | `src/` |
| `@app` | `src/app/` |
| `@features` | `src/features/` |
| `@shared` | `src/shared/` |
| `@assets` | `src/assets/` |

### Configuración de Build

- **Vite**: Configurado para React + TypeScript
- **ESLint**: Reglas para React Hooks y TypeScript
- **SASS**: Preprocesador CSS con variables CSS

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Previsualización
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

---

**Desarrollado con ❤️ usando React, TypeScript y las mejores prácticas de desarrollo web moderno.**
