import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Anime } from '../models/Anime';
import { COLORES } from '../constants/colores';
import { TIPOGRAFIA } from '../constants/tipografia';
import { ESPACIADO } from '../constants/espaciado';
import { obtenerNombreGenero } from '../constants/generos';

interface TarjetaAnimeProps {
  anime: Anime;
  onPress?: () => void;
}

export const TarjetaAnime: React.FC<TarjetaAnimeProps> = ({ anime, onPress }) => {
  const [errorImagen, setErrorImagen] = useState(false);

  const textoAnio = anime.anio && anime.anio > 0 ? `${anime.anio}` : 'Año desconocido';
  const textoEpisodios =
    anime.episodios && anime.episodios > 0
      ? `${anime.episodios} eps`
      : 'Sin dato de episodios';

  const Contenido = (
    <View style={styles.tarjeta}>
      <View style={styles.imagenContenedor}>
        {!errorImagen && anime.imagenUrl ? (
          <Image
            source={{ uri: anime.imagenUrl }}
            style={styles.imagen}
            resizeMode="cover"
            onError={() => setErrorImagen(true)}
          />
        ) : (
          <View style={styles.placeholderImagen}>
            <Text style={styles.textoPlaceholder}>🎬 Portada no disponible</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContenedor}>
        <View style={styles.badgeGenero}>
          <Text style={styles.textoBadge}>{obtenerNombreGenero(anime.genero)}</Text>
        </View>

        <Text style={styles.titulo} numberOfLines={2}>
          {anime.titulo}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaTexto}>{textoAnio}</Text>
          <Text style={styles.metaSeparador}>•</Text>
          <Text style={styles.metaTexto}>{textoEpisodios}</Text>
        </View>

        <View style={styles.puntajeRow}>
          <Text style={styles.estrella}>★</Text>
          <Text style={styles.puntajeTexto}>
            {anime.puntaje > 0 ? anime.puntaje.toFixed(1) : 'S/P'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        {Contenido}
      </TouchableOpacity>
    );
  }

  return Contenido;
};

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES.superficie,
    borderRadius: ESPACIADO.radioBorde,
    borderWidth: 1,
    borderColor: COLORES.borde,
    overflow: 'hidden',
    marginBottom: ESPACIADO.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  imagenContenedor: {
    width: '100%',
    height: 220,
    backgroundColor: '#E2E8F0',
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  placeholderImagen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  textoPlaceholder: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoSecundario,
    fontWeight: TIPOGRAFIA.peso.medio,
  },
  infoContenedor: {
    padding: ESPACIADO.md,
  },
  badgeGenero: {
    alignSelf: 'flex-start',
    backgroundColor: COLORES.acentoClaro,
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: ESPACIADO.xs,
    borderRadius: 6,
    marginBottom: ESPACIADO.xs,
  },
  textoBadge: {
    fontSize: TIPOGRAFIA.tamano.pequeno,
    color: COLORES.acento,
    fontWeight: TIPOGRAFIA.peso.negrita,
  },
  titulo: {
    fontSize: TIPOGRAFIA.tamano.subtitulo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
    marginBottom: ESPACIADO.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ESPACIADO.sm,
  },
  metaTexto: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoSecundario,
  },
  metaSeparador: {
    marginHorizontal: ESPACIADO.xs + 2,
    color: COLORES.textoSecundario,
  },
  puntajeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estrella: {
    fontSize: TIPOGRAFIA.tamano.cuerpo + 2,
    color: '#EAB308',
    marginRight: 4,
  },
  puntajeTexto: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
  },
});
