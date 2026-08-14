import { Genero } from './Genero';

export interface ItemDeMiLista {
  id: string;
  titulo: string;
  genero: Genero;
  episodios: number;
  puntajePersonal: number;
  comentario: string;
  fechaAgregado: string;
  origen: 'catalogo' | 'manual';
}
