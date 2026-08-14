import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { COLORES } from '../constants/colores';
import { TIPOGRAFIA } from '../constants/tipografia';
import { ESPACIADO } from '../constants/espaciado';

interface CampoTextoProps extends TextInputProps {
  label: string;
  error?: string;
  requerido?: boolean;
}

export const CampoTexto: React.FC<CampoTextoProps> = ({
  label,
  error,
  requerido = false,
  style,
  ...props
}) => {
  const tieneError = !!error;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.label}>
        {label}
        {requerido && <Text style={styles.requerido}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          tieneError && styles.inputError,
          props.multiline && styles.inputMultilinea,
          style,
        ]}
        placeholderTextColor={COLORES.textoSecundario}
        {...props}
      />
      {tieneError && <Text style={styles.textoError}>{error}</Text>}
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
    marginBottom: ESPACIADO.xs,
  },
  requerido: {
    color: COLORES.error,
  },
  input: {
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: ESPACIADO.radioBorde,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.sm + 4,
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    color: COLORES.textoPrincipal,
  },
  inputError: {
    borderColor: COLORES.error,
  },
  inputMultilinea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  textoError: {
    marginTop: ESPACIADO.xs,
    fontSize: TIPOGRAFIA.tamano.pequeno,
    color: COLORES.error,
    fontWeight: TIPOGRAFIA.peso.medio,
  },
});
