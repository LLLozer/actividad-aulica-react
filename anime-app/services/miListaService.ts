import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemDeMiLista } from '../models/ItemDeMiLista';
import { demorar, SIMULAR_ERROR, SIMULAR_VACIO } from './simulacion';

const STORAGE_KEY = '@random_anime:mi_lista';

/**
 * Normaliza un título para comparaciones seguras de duplicados.
 */
function normalizarTitulo(titulo: string): string {
  return titulo.trim().toLowerCase();
}

/**
 * Lee la lista del almacenamiento local sin latencia interna.
 */
async function leerAlmacenamiento(): Promise<ItemDeMiLista[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (!json) {
    return [];
  }
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Guarda la lista en el almacenamiento local.
 */
async function guardarAlmacenamiento(lista: ItemDeMiLista[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

/**
 * Lista todos los ítems guardados en Mi Lista, ordenados de más reciente a más antiguo.
 * Cumple FR-014, FR-016, FR-018.
 */
export async function listar(): Promise<ItemDeMiLista[]> {
  await demorar();

  if (SIMULAR_ERROR) {
    throw new Error('Error al leer los animes de tu lista personal.');
  }

  if (SIMULAR_VACIO) {
    return [];
  }

  const items = await leerAlmacenamiento();
  // Ordenar de más reciente a más antiguo por fechaAgregado
  return items.sort(
    (a, b) => new Date(b.fechaAgregado).getTime() - new Date(a.fechaAgregado).getTime()
  );
}

/**
 * Verifica si un título ya se encuentra en la lista (comparación en minúsculas y sin espacios extremos).
 * Cumple FR-013, FR-027.
 */
export async function existeTitulo(titulo: string): Promise<boolean> {
  const normalizado = normalizarTitulo(titulo);
  const items = await leerAlmacenamiento();
  return items.some((item) => normalizarTitulo(item.titulo) === normalizado);
}

/**
 * Agrega un nuevo ítem a Mi Lista y lo persiste.
 * Cumple FR-012, FR-020, FR-027, FR-028.
 */
export async function agregar(
  nuevo: Omit<ItemDeMiLista, 'id' | 'fechaAgregado'>
): Promise<ItemDeMiLista> {
  await demorar();

  if (SIMULAR_ERROR) {
    throw new Error('Error al guardar el anime en tu lista.');
  }

  const yaExiste = await existeTitulo(nuevo.titulo);
  if (yaExiste) {
    throw new Error('Ya existe un título igual en tu lista');
  }

  const itemCompleto: ItemDeMiLista = {
    ...nuevo,
    id: Date.now().toString(),
    fechaAgregado: new Date().toISOString(),
  };

  const listaActual = await leerAlmacenamiento();
  const listaActualizada = [itemCompleto, ...listaActual];
  await guardarAlmacenamiento(listaActualizada);

  return itemCompleto;
}

/**
 * Elimina un ítem de Mi Lista por su identificador.
 * Cumple FR-017.
 */
export async function eliminar(id: string): Promise<void> {
  await demorar();

  if (SIMULAR_ERROR) {
    throw new Error('Error al eliminar el anime de tu lista.');
  }

  const listaActual = await leerAlmacenamiento();
  const listaActualizada = listaActual.filter((item) => item.id !== id);
  await guardarAlmacenamiento(listaActualizada);
}
