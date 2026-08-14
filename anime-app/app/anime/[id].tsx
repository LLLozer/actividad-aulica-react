import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Anime } from '../../models/Anime';
import { obtenerPorId } from '../../services/animeService';
import { agregar, existeTitulo } from '../../services/miListaService';
import { Boton } from '../../components/Boton';
import { EstadoCargando } from '../../components/EstadoCargando';
import { EstadoVacio } from '../../components/EstadoVacio';
import { EstadoError } from '../../components/EstadoError';
import { COLORES } from '../../constants/colores';
import { TIPOGRAFIA } from '../../constants/tipografia';
import { ESPACIADO } from '../../constants/espaciado';
import { obtenerNombreGenero } from '../../constants/generos';

export default function DetalleAnimePantalla() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [anime, setAnime] = useState<Anime | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yaEnLista, setYaEnLista] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorImagen, setErrorImagen] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);

    const animeId = Number(id);
    if (isNaN(animeId)) {
      setAnime(null);
      setCargando(false);
      return;
    }

    try {
      const data = await obtenerPorId(animeId);
      setAnime(data);
      if (data) {
        const existe = await existeTitulo(data.titulo);
        setYaEnLista(existe);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al cargar el detalle del anime.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const agregarAMiLista = async () => {
    if (!anime || yaEnLista || guardando) return;

    setGuardando(true);
    try {
      await agregar({
        titulo: anime.titulo,
        genero: anime.genero,
        episodios: anime.episodios,
        puntajePersonal: Math.max(1, Math.min(10, Math.round(anime.puntaje || 8))),
        comentario: '',
        origen: 'catalogo',
      });
      setYaEnLista(true);
      Alert.alert(
        '¡Agregado con éxito!',
        `"${anime.titulo}" se guardó en tu lista de pendientes.`
      );
    } catch (err: any) {
      Alert.alert('No se pudo agregar', err?.message || 'Error al guardar.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <EstadoCargando mensaje="Cargando detalles del anime..." />;
  }

  if (error) {
    return <EstadoError mensaje={error} onReintentar={cargarDatos} />;
  }

  if (!anime) {
    return (
      <EstadoVacio
        titulo="Anime no encontrado"
        mensaje="No se encontró el anime solicitado o el identificador es inválido."
        textoAccion="Volver atrás"
        onAccion={() => router.back()}
      />
    );
  }

  const textoAnio = anime.anio && anime.anio > 0 ? `${anime.anio}` : 'Año desconocido';
  const textoEpisodios =
    anime.episodios && anime.episodios > 0
      ? `${anime.episodios} episodios`
      : 'Sin dato de episodios';

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>
      <View style={styles.portadaContenedor}>
        {!errorImagen && anime.imagenUrl ? (
          <Image
            source={{ uri: anime.imagenUrl }}
            style={styles.portada}
            resizeMode="cover"
            onError={() => setErrorImagen(true)}
          />
        ) : (
          <View style={styles.placeholderPortada}>
            <Text style={styles.textoPlaceholder}>🎬 Portada no disponible</Text>
          </View>
        )}
      </View>

      <View style={styles.tarjetaInfo}>
        <View style={styles.badgeGenero}>
          <Text style={styles.textoBadgeGenero}>
            {obtenerNombreGenero(anime.genero)}
          </Text>
        </View>

        <Text style={styles.titulo}>{anime.titulo}</Text>

        <View style={styles.filaMetadatos}>
          <View style={styles.itemMeta}>
            <Text style={styles.etiquetaMeta}>Año</Text>
            <Text style={styles.valorMeta}>{textoAnio}</Text>
          </View>
          <View style={styles.separadorVertical} />
          <View style={styles.itemMeta}>
            <Text style={styles.etiquetaMeta}>Episodios</Text>
            <Text style={styles.valorMeta}>{textoEpisodios}</Text>
          </View>
          <View style={styles.separadorVertical} />
          <View style={styles.itemMeta}>
            <Text style={styles.etiquetaMeta}>Puntaje</Text>
            <Text style={styles.valorMeta}>★ {anime.puntaje > 0 ? anime.puntaje.toFixed(1) : 'S/P'}</Text>
          </View>
        </View>

        <View style={styles.seccionSinopsis}>
          <Text style={styles.sinopsisTitulo}>Sinopsis</Text>
          <Text style={styles.sinopsisTexto}>{anime.sinopsis}</Text>
        </View>

        <View style={styles.accionBoton}>
          <Boton
            titulo={
              yaEnLista
                ? '✓ Ya está en tu lista'
                : '⭐ Guardar en Mi Lista'
            }
            onPress={agregarAMiLista}
            deshabilitado={yaEnLista}
            cargando={guardando}
            variante={yaEnLista ? 'secundario' : 'primario'}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    paddingBottom: ESPACIADO.xxl,
  },
  portadaContenedor: {
    width: '100%',
    height: 320,
    backgroundColor: '#E2E8F0',
  },
  portada: {
    width: '100%',
    height: '100%',
  },
  placeholderPortada: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
  },
  textoPlaceholder: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoSecundario,
  },
  tarjetaInfo: {
    marginTop: -ESPACIADO.lg,
    backgroundColor: COLORES.superficie,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: ESPACIADO.lg,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  badgeGenero: {
    alignSelf: 'flex-start',
    backgroundColor: COLORES.acentoClaro,
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: ESPACIADO.xs,
    borderRadius: 6,
    marginBottom: ESPACIADO.sm,
  },
  textoBadgeGenero: {
    fontSize: TIPOGRAFIA.tamano.pequeno,
    color: COLORES.acento,
    fontWeight: TIPOGRAFIA.peso.negrita,
  },
  titulo: {
    fontSize: TIPOGRAFIA.tamano.titulo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
    marginBottom: ESPACIADO.md,
    lineHeight: 30,
  },
  filaMetadatos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORES.fondo,
    borderRadius: ESPACIADO.radioBorde,
    paddingVertical: ESPACIADO.md,
    paddingHorizontal: ESPACIADO.sm,
    marginBottom: ESPACIADO.lg,
  },
  itemMeta: {
    alignItems: 'center',
  },
  etiquetaMeta: {
    fontSize: TIPOGRAFIA.tamano.pequeno,
    color: COLORES.textoSecundario,
    marginBottom: 2,
  },
  valorMeta: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
  },
  separadorVertical: {
    width: 1,
    height: 28,
    backgroundColor: COLORES.borde,
  },
  seccionSinopsis: {
    marginBottom: ESPACIADO.xl,
  },
  sinopsisTitulo: {
    fontSize: TIPOGRAFIA.tamano.subtitulo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
    marginBottom: ESPACIADO.xs,
  },
  sinopsisTexto: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoPrincipal,
    lineHeight: 22,
  },
  accionBoton: {
    marginTop: ESPACIADO.xs,
  },
});
