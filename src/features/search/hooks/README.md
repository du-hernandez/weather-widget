# Hooks de Search

Esta carpeta contiene todos los hooks personalizados para la funcionalidad de búsqueda.

## Hooks Disponibles

### `useSearch.ts`
Hooks principales para búsqueda de ciudades y gestión de cache.

**Hooks incluidos:**
- `useSearchCities()` - Búsqueda de ciudades en la API
- `useCityByCoordinates()` - Búsqueda por coordenadas
- `useAddToHistory()` - Agregar ciudad al historial
- `useClearSearchCache()` - Limpiar cache de búsqueda

### `useSmartSuggestions.ts`
Hook para sugerencias inteligentes con prioridad de historial.

**Características:**
- Prioriza búsquedas recientes sobre resultados de API
- Debounce de 500ms para optimizar llamadas
- Máximo 5 sugerencias del historial

**Uso:**
```typescript
const { suggestions, source, isLoading } = useSmartSuggestions(query);
```

### `useHistoryManagement.ts`
Hook para gestión completa del historial de búsquedas.

**Funciones:**
- `removeItem(id)` - Remover item específico
- `clearAllHistory()` - Limpiar todo el historial
- `addCityToHistory(city)` - Agregar ciudad al historial

**Uso:**
```typescript
const { history, hasHistory, removeItem, clearAllHistory } = useHistoryManagement();
```

### `useCityValidation.ts`
Hook para validación de ciudades y búsqueda exacta.

**Funciones:**
- `hasExactMatch(cityName)` - Verificar coincidencia exacta
- `getExactMatch()` - Obtener coincidencia exacta
- `getSuggestions()` - Obtener sugerencias
- `shouldShowDidYouMean()` - Verificar si mostrar "Did You Mean"

**Uso:**
```typescript
const { exactMatch, suggestions, shouldShowDidYouMean } = useCityValidation(query);
```

## Persistencia

El historial de búsquedas se persiste automáticamente usando Redux Persist:
- Solo se persiste el `searchHistory`
- No se persisten resultados temporales ni estados de carga
- Configuración en `src/app/store/persistConfig.ts`

## Debounce

Todos los hooks que hacen llamadas a la API usan debounce de 500ms para optimizar el rendimiento. 