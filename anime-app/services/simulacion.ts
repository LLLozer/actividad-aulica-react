/**
 * Capa de simulación con latencia artificial y banderas de depuración.
 * Cumple FR-030 y FR-033.
 */

// Banderas para forzar estados de error y vacío para pruebas y defensa oral.
export const SIMULAR_VACIO = false;
export const SIMULAR_ERROR = false;

/**
 * Espera un tiempo aleatorio entre 500 y 1000 ms para simular latencia de red.
 */
export function demorar(): Promise<void> {
  const tiempo = Math.floor(Math.random() * 501) + 500; // 500 a 1000 ms
  return new Promise((resolve) => setTimeout(resolve, tiempo));
}
