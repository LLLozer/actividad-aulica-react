import { Genero } from '../models/Genero';

export interface InfoGenero {
  id: Genero;
  nombre: string;
  descripcion: string;
  mal_id: number;
}

export const GENEROS: InfoGenero[] = [
  {
    id: 'isekai',
    nombre: 'Isekai',
    descripcion: 'El protagonista es transportado a otro mundo',
    mal_id: 62,
  },
  {
    id: 'mecha',
    nombre: 'Mecha',
    descripcion: 'Robots gigantes pilotados',
    mal_id: 18,
  },
  {
    id: 'slice-of-life',
    nombre: 'Slice of Life',
    descripcion: 'Situaciones cotidianas, sin conflicto épico',
    mal_id: 36,
  },
  {
    id: 'spokon',
    nombre: 'Spokon',
    descripcion: 'Superación personal a través del deporte',
    mal_id: 30,
  },
];

export function obtenerNombreGenero(id: Genero): string {
  const gen = GENEROS.find((g) => g.id === id);
  return gen ? gen.nombre : id;
}
