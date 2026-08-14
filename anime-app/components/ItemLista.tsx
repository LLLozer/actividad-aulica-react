import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ItemDeMiLista } from '../models/ItemDeMiLista';
import { COLORES } from '../constants/colores';
import { TIPOGRAFIA } from '../constants/tipografia';
import { ESPACIADO } from '../constants/espaciado';
import { obtenerNombreGenero } from '../constants/generos';

interface ItemListaProps {
  item: ItemDeMiLista;
  onEliminar?: (id: string, titulo: string) => void;
}

export const ItemLista: React.FC<ItemListaProps> = ({ item, onEliminar }) => {
  const etiquetaOrigen = item.origen === 'catalogo' ? 'Desde Catálogo' : 'Carga Manual';

  return (
    <View style={styles.contenedor}>
      <View style={styles.infoPrincipal}>
        <View style={styles.badgesRow}>
          <View style={styles.badgeGenero}>
            <Text style={styles.textoBadgeGenero}>
              {obtenerNombreGenero(item.genero)}
            </Text>
          </View>
          <View
            style={[
              styles.badgeOrigen,
              item.origen === 'manual' ? styles.badgeOrigenManual : styles.badgeOrigenCat,
            ]}
          >
            <Text
              style={[
                styles.textoBadgeOrigen,
                item.origen === 'manual'
                  ? styles.textoBadgeOrigenManual
                  : styles.textoBadgeOrigenCat,
              ]}
            >
              {etiquetaOrigen}
            </Text>
          </View>
        </View>

        <Text style={styles.titulo}>{item.titulo}</Text>

        <View style={styles.detallesRow}>
          <Text style={styles.episodiosTexto}>{item.episodios} episodios</Text>
          <View style={styles.puntajeRow}>
            <Text style={styles.estrella}>★</Text>
            <Text style={styles.puntajeTexto}>{item.puntajePersonal}/10</Text>
          </View>
        </View>

        {item.comentario ? (
          <Text style={styles.comentario}>"{item.comentario}"</Text>
        ) : null}
      </View>

      {onEliminar && (
        <TouchableOpacity
          style={styles.botonEliminar}
          onPress={() => onEliminar(item.id, item.titulo)}
          activeOpacity={0.7}
        >
          <Text style={styles.textoEliminar}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: COLORES.superficie,
    borderRadius: ESPACIADO.radioBorde,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: ESPACIADO.md,
    marginBottom: ESPACIADO.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoPrincipal: {
    flex: 1,
    marginRight: ESPACIADO.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.xs + 2,
    marginBottom: ESPACIADO.xs,
  },
  badgeGenero: {
    backgroundColor: COLORES.acentoClaro,
    paddingHorizontal: ESPACIADO.xs + 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  textoBadgeGenero: {
    fontSize: TIPOGRAFIA.tamano.pequeno,
    color: COLORES.acento,
    fontWeight: TIPOGRAFIA.peso.negrita,
  },
  badgeOrigen: {
    paddingHorizontal: ESPACIADO.xs + 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeOrigenCat: {
    backgroundColor: '#F1F5F9',
  },
  badgeOrigenManual: {
    backgroundColor: '#FEF3C7',
  },
  textoBadgeOrigen: {
    fontSize: TIPOGRAFIA.tamano.pequeno,
    fontWeight: TIPOGRAFIA.peso.medio,
  },
  textoBadgeOrigenCat: {
    color: '#475569',
  },
  textoBadgeOrigenManual: {
    color: '#B45309',
  },
  titulo: {
    fontSize: TIPOGRAFIA.tamano.subtitulo - 1,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
    marginBottom: ESPACIADO.xs,
  },
  detallesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.md,
    marginBottom: ESPACIADO.xs,
  },
  episodiosTexto: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoSecundario,
  },
  puntajeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estrella: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: '#EAB308',
    marginRight: 2,
  },
  puntajeTexto: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.textoPrincipal,
  },
  comentario: {
    fontSize: TIPOGRAFIA.tamano.pequeno,
    fontStyle: 'italic',
    color: COLORES.textoSecundario,
    marginTop: 2,
  },
  botonEliminar: {
    backgroundColor: '#FEE2E2',
    paddingVertical: ESPACIADO.xs + 4,
    paddingHorizontal: ESPACIADO.sm + 4,
    borderRadius: 8,
    alignSelf: 'center',
  },
  textoEliminar: {
    fontSize: TIPOGRAFIA.tamano.pequeno,
    color: COLORES.error,
    fontWeight: TIPOGRAFIA.peso.negrita,
  },
});
