import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORES } from '../constants/colores';
import { TIPOGRAFIA } from '../constants/tipografia';
import { ESPACIADO } from '../constants/espaciado';

interface BotonProps {
  titulo: string;
  onPress: () => void;
  deshabilitado?: boolean;
  cargando?: boolean;
  variante?: 'primario' | 'secundario' | 'peligro';
  estilo?: ViewStyle;
  estiloTexto?: TextStyle;
}

export const Boton: React.FC<BotonProps> = ({
  titulo,
  onPress,
  deshabilitado = false,
  cargando = false,
  variante = 'primario',
  estilo,
  estiloTexto,
}) => {
  const estaInactivo = deshabilitado || cargando;

  let fondoColor = COLORES.acento;
  let colorTexto = COLORES.superficie;
  let bordeColor = 'transparent';

  if (variante === 'secundario') {
    fondoColor = 'transparent';
    colorTexto = COLORES.acento;
    bordeColor = COLORES.acento;
  } else if (variante === 'peligro') {
    fondoColor = COLORES.error;
    colorTexto = COLORES.superficie;
  }

  if (estaInactivo) {
    fondoColor = '#CBD5E1';
    colorTexto = '#64748B';
    bordeColor = 'transparent';
  }

  return (
    <TouchableOpacity
      style={[
        styles.boton,
        {
          backgroundColor: fondoColor,
          borderColor: bordeColor,
          borderWidth: variante === 'secundario' ? 1 : 0,
        },
        estilo,
      ]}
      onPress={onPress}
      disabled={estaInactivo}
      activeOpacity={0.8}
    >
      {cargando ? (
        <ActivityIndicator
          size="small"
          color={variante === 'secundario' ? COLORES.acento : COLORES.superficie}
        />
      ) : (
        <Text style={[styles.texto, { color: colorTexto }, estiloTexto]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: {
    paddingVertical: ESPACIADO.md,
    paddingHorizontal: ESPACIADO.lg,
    borderRadius: ESPACIADO.radioBorde,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  texto: {
    fontSize: TIPOGRAFIA.tamano.cuerpo + 1,
    fontWeight: TIPOGRAFIA.peso.negrita,
  },
});
