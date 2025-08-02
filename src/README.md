# Alias de Importación

Este proyecto utiliza alias de importación para hacer el código más limpio y mantenible.

## Alias Disponibles

| Alias | Ruta | Descripción |
|-------|------|-------------|
| `@` | `src/` | Root del código fuente |
| `@app` | `src/app/` | Configuración global de la aplicación |
| `@features` | `src/features/` | Módulos de funcionalidades |
| `@shared` | `src/shared/` | Código reutilizable |
| `@assets` | `src/assets/` | Recursos estáticos |

## Ejemplos de Uso

### Antes (paths relativos)
```typescript
import { useAppSelector } from '../../shared/hooks/redux';
import { selectWeather } from '../../features/weather/store/selectors';
import WeatherWidget from './app/components/WeatherWidget';
```

### Después (alias)
```typescript
import { useAppSelector } from '@shared/hooks/redux';
import { selectWeather } from '@features/weather/store/selectors';
import WeatherWidget from '@app/components/WeatherWidget';
```

## Ventajas

1. **Imports más limpios** - No más `../../../`
2. **Mantenimiento fácil** - Mover archivos no rompe imports
3. **Legibilidad** - Fácil identificar de dónde viene cada import
4. **Consistencia** - Patrón uniforme en todo el proyecto

## Configuración

Los alias están configurados en:
- `vite.config.ts` - Para Vite
- `tsconfig.app.json` - Para TypeScript 