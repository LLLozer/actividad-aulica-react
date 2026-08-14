import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Genero } from '../../models/Genero';
import { agregar, existeTitulo } from '../../services/miListaService';
import { validarItem, ErroresFormulario } from '../../utils/validarItem';
import { CampoTexto } from '../../components/CampoTexto';
import { SelectorGenero } from '../../components/SelectorGenero';
import { Boton } from '../../components/Boton';
import { COLORES } from '../../constants/colores';
import { TIPOGRAFIA } from '../../constants/tipografia';
import { ESPACIADO } from '../../constants/espaciado';

export default function NuevoAnimePantalla() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState<Genero | ''>('');
  const [episodios, setEpisodios] = useState('');
  const [puntajePersonal, setPuntajePersonal] = useState('');
  const [comentario, setComentario] = useState('');

  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [guardando, setGuardando] = useState(false);

  const manejarGuardar = async () => {
    // 1. Ejecutar validación pura para obtener todos los errores de una vez (FR-026)
    const datos = {
      titulo,
      genero,
      episodios,
      puntajePersonal,
      comentario,
    };

    const nuevosErrores = validarItem(datos);

    // 2. Verificar duplicados si el título pasó la validación básica (FR-027)
    if (!nuevosErrores.titulo) {
      try {
        const yaExiste = await existeTitulo(titulo);
        if (yaExiste) {
          nuevosErrores.titulo = 'Ya tenés ese título en tu lista';
        }
      } catch {
        // Continuar
      }
    }

    setErrores(nuevosErrores);

    // Si hay errores, no guardar
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    // 3. Guardar el nuevo ítem
    setGuardando(true);
    try {
      await agregar({
        titulo: titulo.trim(),
        genero: genero as Genero,
        episodios: Number(episodios),
        puntajePersonal: Number(puntajePersonal),
        comentario: comentario.trim(),
        origen: 'manual',
      });

      Alert.alert('¡Guardado!', 'El anime fue agregado exitosamente a tu lista.', [
        {
          text: 'Continuar',
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Error al guardar', err?.message || 'No se pudo guardar el anime.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.tituloHeader}>Cargar Anime a Mano</Text>
        <Text style={styles.subtituloHeader}>
          Completá los datos del anime que querés registrar en tu lista personal.
        </Text>
      </View>

      <CampoTexto
        label="Título del Anime"
        placeholder="Ej: Solo Leveling"
        value={titulo}
        onChangeText={(text) => {
          setTitulo(text);
          if (errores.titulo) setErrores((prev) => ({ ...prev, titulo: undefined }));
        }}
        error={errores.titulo}
        requerido
        maxLength={80}
      />

      <SelectorGenero
        seleccionado={genero}
        onSeleccionar={(gen) => {
          setGenero(gen);
          if (errores.genero) setErrores((prev) => ({ ...prev, genero: undefined }));
        }}
        error={errores.genero}
      />

      <CampoTexto
        label="Cantidad de Episodios"
        placeholder="Ej: 12"
        value={episodios}
        onChangeText={(text) => {
          setEpisodios(text);
          if (errores.episodios) setErrores((prev) => ({ ...prev, episodios: undefined }));
        }}
        error={errores.episodios}
        keyboardType="numeric"
        requerido
      />

      <CampoTexto
        label="Puntaje Personal (1 al 10)"
        placeholder="Ej: 9"
        value={puntajePersonal}
        onChangeText={(text) => {
          setPuntajePersonal(text);
          if (errores.puntajePersonal)
            setErrores((prev) => ({ ...prev, puntajePersonal: undefined }));
        }}
        error={errores.puntajePersonal}
        keyboardType="numeric"
        requerido
      />

      <CampoTexto
        label="Comentario Personal (opcional)"
        placeholder="Ej: Me encantó la animación y el desarrollo..."
        value={comentario}
        onChangeText={(text) => {
          setComentario(text);
          if (errores.comentario) setErrores((prev) => ({ ...prev, comentario: undefined }));
        }}
        error={errores.comentario}
        multiline
        numberOfLines={3}
        maxLength={200}
      />

      <View style={styles.acciones}>
        <Boton
          titulo="💾 Guardar en Mi Lista"
          onPress={manejarGuardar}
          cargando={guardando}
        />
        <Boton
          titulo="Cancelar"
          onPress={() => router.back()}
          variante="secundario"
          deshabilitado={guardando}
          estilo={styles.botonCancelar}
        />
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
    padding: ESPACIADO.md,
    paddingBottom: ESPACIADO.xxl,
  },
  header: {
    marginBottom: ESPACIADO.lg,
  },
  tituloHeader: {
    fontSize: TIPOGRAFIA.tamano.titulo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
    marginBottom: ESPACIADO.xs,
  },
  subtituloHeader: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoSecundario,
    lineHeight: 20,
  },
  acciones: {
    marginTop: ESPACIADO.lg,
    gap: ESPACIADO.sm,
  },
  botonCancelar: {
    marginTop: ESPACIADO.xs,
  },
});
