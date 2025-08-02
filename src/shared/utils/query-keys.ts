/**
 * Utilidades para gestionar query keys de TanStack Query
 */

/**
 * Serializa parámetros de manera consistente para query keys
 */
export function serializeParams(params: Record<string, any>): string {
  // Ordenar las claves para consistencia
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys.map(key => `${key}:${params[key]}`).join('|');
  return serialized;
}

/**
 * Crea una query key serializada
 */
export function createQueryKey(base: string[], params?: Record<string, any>): readonly unknown[] {
  if (!params) {
    return [...base] as const;
  }
  
  const serialized = serializeParams(params);
  return [...base, serialized] as const;
}

/**
 * Compara dos objetos de parámetros
 */
export function areParamsEqual(params1: Record<string, any>, params2: Record<string, any>): boolean {
  return serializeParams(params1) === serializeParams(params2);
}

/**
 * Extrae parámetros de una query key serializada
 */
export function extractParamsFromKey(queryKey: readonly unknown[]): Record<string, any> | null {
  const lastItem = queryKey[queryKey.length - 1];
  
  if (typeof lastItem === 'string' && lastItem.includes(':')) {
    const params: Record<string, any> = {};
    const pairs = lastItem.split('|');
    
    pairs.forEach(pair => {
      const [key, value] = pair.split(':');
      if (key && value !== undefined) {
        // Intentar convertir a número si es posible
        const numValue = Number(value);
        params[key] = isNaN(numValue) ? value : numValue;
      }
    });
    
    return params;
  }
  
  return null;
}

/**
 * Factory para crear query keys con serialización consistente
 */
export function createQueryKeyFactory(baseKey: string[]) {
  return {
    all: [...baseKey] as const,
    list: (params?: Record<string, any>) => createQueryKey([...baseKey, 'list'], params),
    detail: (id: string | number) => createQueryKey([...baseKey, 'detail'], { id }),
    search: (params: Record<string, any>) => createQueryKey([...baseKey, 'search'], params),
    custom: (action: string, params?: Record<string, any>) => 
      createQueryKey([...baseKey, action], params),
  };
} 