import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Genero } from '../models/Genero';
import { GENEROS } from '../constants/generos';
import { COLORES } from '../constants/colores';
import { TIPOGRAFIA } from '../constants/tipografia';
import { ESPACIADO } from '../constants/espaciado';

interface SelectorGeneroProps {
  seleccionado: Genero | null | '';
  onSeleccionar: (genero: Genero) => void;
  error?: string;
}

export const SelectorGenero: React.FC<SelectorGeneroProps> = ({
  seleccionado,
  onSeleccionar,
  error,
}) => {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.label}>
        Género de Anime <Text style={styles.requerido}>*</Text>
      </Text>
      <View style={styles.chipsContenedor}>
        {GENEROS.map((gen) => {
          const estaActivo = seleccionado === gen.id;
          return (
            <TouchableOpacity
              key={gen.id}
              style={[
                styles.chip,
                estaActivo && styles.chipActivo,
              ]}
              onPress={() => onSeleccionar(gen.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.textoChip,
                  estaActivo && styles.textoChipActivo,
                ]}
              >
                {gen.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.textoError}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: ESPACIADO.md,
    width: '100%',
  },
  label: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    fontWeight: TIPOGRAFIA.peso.medio,
    color: COLORES.textoPrincipal,
    marginBottom: ESPACIADO.sm,
  },
  requerido: {
    color: COLORES.error,
  },
  chipsContenedor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIADO.sm,
  },
  chip: {
    paddingVertical: ESPACIADO.sm,
    paddingHorizontal: ESPACIADO.md,
    borderRadius: ESPACIADO.radioBorde,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  chipActivo: {
    backgroundColor: COLORES.acento,
    borderColor: COLORES.acento,
  },
  textoChip: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoPrincipal,
    fontWeight: TIPOGRAFIA.peso.medio,
  },
  textoChipActivo: {
    color: COLORES.superficie,
    fontWeight: TIPOGRAFIA.peso.negrita,
  },
  textoError: {
    marginTop: ESPACIADO.xs,
    fontSize: TIPOGRAFIA.tamano.pequeno,
    color: COLORES.error,
    fontWeight: TIPOGRAFIA.peso.medio,
  },
});
