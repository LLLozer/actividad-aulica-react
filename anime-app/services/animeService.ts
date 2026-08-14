import { Anime } from '../models/Anime';
import { Genero } from '../models/Genero';
import { demorar, SIMULAR_ERROR, SIMULAR_VACIO } from './simulacion';
import catalogoJson from './data/animes.json';

const catalogo: Anime[] = catalogoJson as Anime[];

/**
 * Lista todos los animes de un género ordenados por puntaje de mayor a menor.
 * Cumple FR-007, FR-008.
 */
export async function listarPorGenero(genero: Genero): Promise<Anime[]> {
  await demorar();

  if (SIMULAR_ERROR) {
    throw new Error('Error al consultar el catálogo de animes.');
  }

  if (SIMULAR_VACIO) {
    return [];
  }

  const filtrados = catalogo.filter((anime) => anime.genero === genero);
  return filtrados.sort((a, b) => b.puntaje - a.puntaje);
}

/**
 * Obtiene un anime por su identificador único.
 * Cumple FR-010, FR-011.
 */
export async function obtenerPorId(id: number): Promise<Anime | null> {
  await demorar();

  if (SIMULAR_ERROR) {
    throw new Error('Error al obtener el detalle del anime.');
  }

  const anime = catalogo.find((a) => a.id === id);
  return anime || null;
}

/**
 * Sortea un anime al azar dentro del género seleccionado.
 * Evita repetir el anterior si hay 2 o más animes en el género.
 * Cumple FR-004, FR-005.
 */
export async function sortearPorGenero(
  genero: Genero,
  excluirId?: number
): Promise<Anime | null> {
  await demorar();

  if (SIMULAR_ERROR) {
    throw new Error('Error al sortear una recomendación de anime.');
  }

  if (SIMULAR_VACIO) {
    return null;
  }

  const delGenero = catalogo.filter((a) => a.genero === genero);
  if (delGenero.length === 0) {
    return null;
  }

  let candidatos = delGenero;
  if (excluirId !== undefined && delGenero.length > 1) {
    const sinAnterior = delGenero.filter((a) => a.id !== excluirId);
    if (sinAnterior.length > 0) {
      candidatos = sinAnterior;
    }
  }

  const indiceAzar = Math.floor(Math.random() * candidatos.length);
  return candidatos[indiceAzar];
}
