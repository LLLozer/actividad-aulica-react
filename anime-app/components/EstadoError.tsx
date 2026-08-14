import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORES } from '../constants/colores';
import { TIPOGRAFIA } from '../constants/tipografia';
import { ESPACIADO } from '../constants/espaciado';

interface EstadoErrorProps {
  mensaje?: string;
  onReintentar?: () => void;
}

export const EstadoError: React.FC<EstadoErrorProps> = ({
  mensaje = 'Ocurrió un error inesperado al procesar la solicitud.',
  onReintentar,
}) => {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Algo salió mal</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
      {onReintentar && (
        <TouchableOpacity style={styles.boton} onPress={onReintentar} activeOpacity={0.8}>
          <Text style={styles.textoBoton}>Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ESPACIADO.lg,
  },
  titulo: {
    fontSize: TIPOGRAFIA.tamano.subtitulo,
    fontWeight: TIPOGRAFIA.peso.negrita,
    color: COLORES.error,
    marginBottom: ESPACIADO.sm,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoSecundario,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: ESPACIADO.lg,
  },
  boton: {
    backgroundColor: COLORES.error,
    paddingVertical: ESPACIADO.sm + 2,
    paddingHorizontal: ESPACIADO.lg,
    borderRadius: ESPACIADO.radioBorde,
    alignItems: 'center',
  },
  textoBoton: {
    color: COLORES.superficie,
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    fontWeight: TIPOGRAFIA.peso.medio,
  },
});
