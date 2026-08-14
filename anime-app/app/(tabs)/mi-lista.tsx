import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ItemDeMiLista } from '../../models/ItemDeMiLista';
import { listar, eliminar } from '../../services/miListaService';
import { ItemLista } from '../../components/ItemLista';
import { Boton } from '../../components/Boton';
import { EstadoCargando } from '../../components/EstadoCargando';
import { EstadoVacio } from '../../components/EstadoVacio';
import { EstadoError } from '../../components/EstadoError';
import { COLORES } from '../../constants/colores';
import { TIPOGRAFIA } from '../../constants/tipografia';
import { ESPACIADO } from '../../constants/espaciado';

export default function MiListaPantalla() {
  const router = useRouter();

  const [items, setItems] = useState<ItemDeMiLista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarLista = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await listar();
      setItems(datos);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar tu lista de animes.');
    } finally {
      setCargando(false);
    }
  };

  // Recarga cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      cargarLista();
    }, [])
  );

  const confirmarEliminacion = (id: string, titulo: string) => {
    Alert.alert(
      'Quitar de Mi Lista',
      `¿Estás seguro de que querés eliminar "${titulo}" de tu lista?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminar(id);
              await cargarLista();
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'No se pudo eliminar el ítem.');
            }
          },
        },
      ]
    );
  };

  const irANuevo = () => {
    router.push('/mi-lista/nuevo');
  };

  const irADescubrir = () => {
    router.push('/');
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.headerContenedor}>
        <View style={styles.headerInfo}>
          <Text style={styles.titulo}>Mi Lista</Text>
          <Text style={styles.subtitulo}>
            Tus animes guardados y pendientes ({items.length})
          </Text>
        </View>
        <Boton
          titulo="+ Cargar a mano"
          onPress={irANuevo}
          estilo={styles.botonHeader}
          estiloTexto={styles.textoBotonHeader}
        />
      </View>

      {/* Manejo de estados: Cargando -> Error -> Vacío -> Con datos */}
      {cargando ? (
        <EstadoCargando mensaje="Cargando tu lista guardada..." />
      ) : error ? (
        <EstadoError mensaje={error} onReintentar={cargarLista} />
      ) : items.length === 0 ? (
        <EstadoVacio
          titulo="Tu lista está vacía"
          mensaje="Todavía no guardaste ningún anime. Podés sortear recomendaciones o agregar un título a mano."
          textoAccion="🎲 Ir a Descubrir"
          onAccion={irADescubrir}
          textoAccionSecundaria="✍️ Cargar uno a mano"
          onAccionSecundaria={irANuevo}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemLista item={item} onEliminar={confirmarEliminacion} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ESPACIADO.md,
    backgroundColor: COLORES.superficie,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  headerInfo: {
    flex: 1,
  },
  titulo: {
    fontSize: TIPOGRAFIA.tamano.titulo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
    marginBottom: 2,
  },
  subtitulo: {
    fontSize: TIPOGRAFIA.tamano.pequeno,
    color: COLORES.textoSecundario,
  },
  botonHeader: {
    paddingVertical: ESPACIADO.xs + 4,
    paddingHorizontal: ESPACIADO.sm + 4,
    borderRadius: 8,
  },
  textoBotonHeader: {
    fontSize: TIPOGRAFIA.tamano.pequeno + 1,
  },
  listaContenido: {
    padding: ESPACIADO.md,
    paddingBottom: ESPACIADO.xxl,
  },
});
