import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Genero } from '../../models/Genero';
import { Anime } from '../../models/Anime';
import { listarPorGenero } from '../../services/animeService';
import { SelectorGenero } from '../../components/SelectorGenero';
import { TarjetaAnime } from '../../components/TarjetaAnime';
import { EstadoCargando } from '../../components/EstadoCargando';
import { EstadoVacio } from '../../components/EstadoVacio';
import { EstadoError } from '../../components/EstadoError';
import { COLORES } from '../../constants/colores';
import { TIPOGRAFIA } from '../../constants/tipografia';
import { ESPACIADO } from '../../constants/espaciado';
import { obtenerNombreGenero } from '../../constants/generos';

export default function CatalogoPantalla() {
  const router = useRouter();

  const [generoSeleccionado, setGeneroSeleccionado] = useState<Genero>('isekai');
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarCatalogo = async (gen: Genero) => {
    setCargando(true);
    setError(null);
    try {
      const datos = await listarPorGenero(gen);
      setAnimes(datos);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar el catálogo de animes.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCatalogo(generoSeleccionado);
  }, [generoSeleccionado]);

  const manejarCambioGenero = (gen: Genero) => {
    if (gen !== generoSeleccionado) {
      setGeneroSeleccionado(gen);
    }
  };

  const irAlDetalle = (id: number) => {
    router.push(`/anime/${id}`);
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.headerContenedor}>
        <Text style={styles.titulo}>Catálogo Completo</Text>
        <Text style={styles.subtitulo}>
          Explorá los animes disponibles ordenados por puntaje de la comunidad.
        </Text>
        <SelectorGenero
          seleccionado={generoSeleccionado}
          onSeleccionar={manejarCambioGenero}
        />
      </View>

      {/* Manejo de estados: Cargando -> Error -> Vacío -> Con datos */}
      {cargando ? (
        <EstadoCargando
          mensaje={`Cargando animes de ${obtenerNombreGenero(generoSeleccionado)}...`}
        />
      ) : error ? (
        <EstadoError
          mensaje={error}
          onReintentar={() => cargarCatalogo(generoSeleccionado)}
        />
      ) : animes.length === 0 ? (
        <EstadoVacio
          titulo="Sin animes disponibles"
          mensaje={`No se encontraron animes registrados para el género ${obtenerNombreGenero(
            generoSeleccionado
          )}.`}
          textoAccion="Reintentar carga"
          onAccion={() => cargarCatalogo(generoSeleccionado)}
        />
      ) : (
        <FlatList
          data={animes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TarjetaAnime anime={item} onPress={() => irAlDetalle(item.id)} />
          )}
          contentContainerStyle={styles.listaContenido}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  headerContenedor: {
    padding: ESPACIADO.md,
    backgroundColor: COLORES.superficie,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  titulo: {
    fontSize: TIPOGRAFIA.tamano.titulo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
    marginBottom: ESPACIADO.xs,
  },
  subtitulo: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoSecundario,
    marginBottom: ESPACIADO.md,
    lineHeight: 18,
  },
  listaContenido: {
    padding: ESPACIADO.md,
    paddingBottom: ESPACIADO.xxl,
  },
});
