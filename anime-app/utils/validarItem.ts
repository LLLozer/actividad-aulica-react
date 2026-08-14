import { Genero } from '../models/Genero';

export interface DatosFormularioItem {
  titulo: string;
  genero: Genero | '';
  episodios: string;
  puntajePersonal: string;
  comentario: string;
}

export interface ErroresFormulario {
  titulo?: string;
  genero?: string;
  episodios?: string;
  puntajePersonal?: string;
  comentario?: string;
}

/**
 * Función pura de validación para el formulario de Mi Lista.
 * Evalúa todas las reglas de forma simultánea (cumple FR-021 a FR-026).
 */
export function validarItem(datos: DatosFormularioItem): ErroresFormulario {
  const errores: ErroresFormulario = {};

  // 1. Título
  const tituloLimpio = datos.titulo ? datos.titulo.trim() : '';
  if (!tituloLimpio) {
    errores.titulo = 'El título es obligatorio';
  } else if (tituloLimpio.length < 2 || tituloLimpio.length > 80) {
    errores.titulo = 'El título debe tener entre 2 y 80 caracteres';
  }

  // 2. Género
  if (!datos.genero) {
    errores.genero = 'Elegí un género';
  }

  // 3. Episodios
  if (!datos.episodios || datos.episodios.trim() === '') {
    errores.episodios = 'Los episodios tienen que ser un número';
  } else {
    const epNum = Number(datos.episodios);
    if (isNaN(epNum) || !Number.isInteger(epNum)) {
      errores.episodios = 'Los episodios tienen que ser un número';
    } else if (epNum < 1 || epNum > 5000) {
      errores.episodios = 'Los episodios tienen que estar entre 1 y 5000';
    }
  }

  // 4. Puntaje Personal (1 a 10)
  if (!datos.puntajePersonal || datos.puntajePersonal.trim() === '') {
    errores.puntajePersonal = 'El puntaje tiene que ser un número';
  } else {
    const puntajeNum = Number(datos.puntajePersonal);
    if (isNaN(puntajeNum)) {
      errores.puntajePersonal = 'El puntaje tiene que ser un número';
    } else if (puntajeNum < 1 || puntajeNum > 10) {
      errores.puntajePersonal = 'El puntaje tiene que estar entre 1 y 10';
    }
  }

  // 5. Comentario (opcional, máx 200 caracteres)
  if (datos.comentario && datos.comentario.length > 200) {
    errores.comentario = 'El comentario no puede superar los 200 caracteres';
  }

  return errores;
}
