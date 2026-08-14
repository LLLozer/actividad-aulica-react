import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORES } from '../constants/colores';
import { TIPOGRAFIA } from '../constants/tipografia';
import { ESPACIADO } from '../constants/espaciado';

interface EstadoCargandoProps {
  mensaje?: string;
}

export const EstadoCargando: React.FC<EstadoCargandoProps> = ({
  mensaje = 'Cargando datos...',
}) => {
  return (
    <View style={styles.contenedor}>
      <ActivityIndicator size="large" color={COLORES.acento} />
      <Text style={styles.texto}>{mensaje}</Text>
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
  texto: {
    marginTop: ESPACIADO.md,
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
});
