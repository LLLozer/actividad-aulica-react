import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORES } from '../constants/colores';
import { TIPOGRAFIA } from '../constants/tipografia';
import { ESPACIADO } from '../constants/espaciado';

interface EstadoVacioProps {
  titulo?: string;
  mensaje: string;
  textoAccion?: string;
  onAccion?: () => void;
  textoAccionSecundaria?: string;
  onAccionSecundaria?: () => void;
}

export const EstadoVacio: React.FC<EstadoVacioProps> = ({
  titulo = 'Sin datos disponibles',
  mensaje,
  textoAccion,
  onAccion,
  textoAccionSecundaria,
  onAccionSecundaria,
}) => {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
      {textoAccion && onAccion && (
        <TouchableOpacity style={styles.boton} onPress={onAccion} activeOpacity={0.8}>
          <Text style={styles.textoBoton}>{textoAccion}</Text>
        </TouchableOpacity>
      )}
      {textoAccionSecundaria && onAccionSecundaria && (
        <TouchableOpacity
          style={[styles.boton, styles.botonSecundario]}
          onPress={onAccionSecundaria}
          activeOpacity={0.8}
        >
          <Text style={[styles.textoBoton, styles.textoBotonSecundario]}>
            {textoAccionSecundaria}
          </Text>
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
    color: COLORES.textoPrincipal,
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
    backgroundColor: COLORES.acento,
    paddingVertical: ESPACIADO.sm + 2,
    paddingHorizontal: ESPACIADO.lg,
    borderRadius: ESPACIADO.radioBorde,
    alignItems: 'center',
    marginTop: ESPACIADO.xs,
  },
  botonSecundario: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORES.acento,
    marginTop: ESPACIADO.sm,
  },
  textoBoton: {
    color: COLORES.superficie,
    fontSize: TIPOGRAFIA.tamano.cuerpo,
    fontWeight: TIPOGRAFIA.peso.medio,
  },
  textoBotonSecundario: {
    color: COLORES.acento,
  },
});
