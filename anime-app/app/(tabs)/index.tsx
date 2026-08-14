import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Genero } from '../../models/Genero';
import { Anime } from '../../models/Anime';
import { sortearPorGenero } from '../../services/animeService';
import { SelectorGenero } from '../../components/SelectorGenero';
import { TarjetaAnime } from '../../components/TarjetaAnime';
import { Boton } from '../../components/Boton';
import { EstadoCargando } from '../../components/EstadoCargando';
import { EstadoError } from '../../components/EstadoError';
import { COLORES } from '../../constants/colores';
import { TIPOGRAFIA } from '../../constants/tipografia';
import { ESPACIADO } from '../../constants/espaciado';

export default function DescubrirPantalla() {
  const router = useRouter();

  const [generoSeleccionado, setGeneroSeleccionado] = useState<Genero | ''>('');
  const [animeSorteado, setAnimeSorteado] = useState<Anime | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  const sortear = async (esReintento = false) => {
    if (!generoSeleccionado) {
      setErrorValidacion('Por favor, seleccioná un género antes de sortear.');
      return;
    }

    setErrorValidacion(null);
    setError(null);
    setCargando(true);

    try {
      const excluirId = esReintento && animeSorteado ? animeSorteado.id : undefined;
      const resultado = await sortearPorGenero(generoSeleccionado, excluirId);
      if (!resultado) {
        setError('No se encontraron animes para el género seleccionado.');
      } else {
        setAnimeSorteado(resultado);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al obtener la recomendación.');
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioGenero = (genero: Genero) => {
    setGeneroSeleccionado(genero);
    setErrorValidacion(null);
    setAnimeSorteado(null);
    setError(null);
  };

  const irAlDetalle = () => {
    if (animeSorteado) {
      router.push(`/anime/${animeSorteado.id}`);
    }
  };

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>
      <View style={styles.header}>
        <Text style={styles.titulo}>¿No sabés qué mirar?</Text>
        <Text style={styles.subtitulo}>
          Elegí un género y dejá que el azar elija tu próxima historia.
        </Text>
      </View>

      <SelectorGenero
        seleccionado={generoSeleccionado}
        onSeleccionar={manejarCambioGenero}
        error={errorValidacion || undefined}
      />

      <View style={styles.acciones}>
        <Boton
          titulo={animeSorteado ? '🎲 Proponer otro' : '✨ Recomendame uno'}
          onPress={() => sortear(!!animeSorteado)}
          cargando={cargando}
        />
      </View>

      {/* Manejo explícito de los 4 estados: Cargando -> Error -> Vacío/Inicial -> Con datos */}
      {cargando ? (
        <View style={styles.estadoContenedor}>
          <EstadoCargando mensaje="Buscando la mejor recomendación al azar..." />
        </View>
      ) : error ? (
        <View style={styles.estadoContenedor}>
          <EstadoError mensaje={error} onReintentar={() => sortear(false)} />
        </View>
      ) : animeSorteado ? (
        <View style={styles.resultadoContenedor}>
          <Text style={styles.resultadoTitulo}>Recomendación para vos:</Text>
          <TarjetaAnime anime={animeSorteado} onPress={irAlDetalle} />
          <Text style={styles.ayudaTocar}>👆 Tocá la tarjeta para ver la sinopsis completa</Text>
        </View>
      ) : (
        <View style={styles.estadoInicial}>
          <Text style={styles.iconoInicial}>⛩️</Text>
          <Text style={styles.textoInicial}>
            Seleccioná uno de los cuatro géneros y presioná el botón para sortear.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    padding: ESPACIADO.md,
    paddingBottom: ESPACIADO.xxl,
  },
  header: {
    marginBottom: ESPACIADO.md,
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
    lineHeight: 20,
  },
  acciones: {
    marginVertical: ESPACIADO.sm,
  },
  estadoContenedor: {
    paddingVertical: ESPACIADO.xl,
  },
  resultadoContenedor: {
    marginTop: ESPACIADO.md,
  },
  resultadoTitulo: {
    fontSize: TIPOGRAFIA.tamano.subtitulo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
    marginBottom: ESPACIADO.sm,
  },
  ayudaTocar: {
    fontSize: TIPOGRAFIA.tamano.pequeno,
    color: COLORES.textoSecundario,
    textAlign: 'center',
    marginTop: ESPACIADO.xs,
  },
  estadoInicial: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ESPACIADO.xxl,
    paddingHorizontal: ESPACIADO.lg,
  },
  iconoInicial: {
    fontSize: 48,
    marginBottom: ESPACIADO.md,
  },
  textoInicial: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoSecundario,
    textAlign: 'center',
    lineHeight: 22,
  },
});
