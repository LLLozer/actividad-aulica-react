import { Genero } from './Genero';

export interface Anime {
  id: number;
  titulo: string;
  genero: Genero;
  anio: number;
  episodios: number;
  sinopsis: string;
  puntaje: number;
  imagenUrl: string;
}
