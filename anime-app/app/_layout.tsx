import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORES } from '../constants/colores';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORES.superficie,
          },
          headerTintColor: COLORES.textoPrincipal,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: COLORES.fondo,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="anime/[id]"
          options={{
            title: 'Detalle del Anime',
            headerBackTitle: 'Atrás',
          }}
        />
        <Stack.Screen
          name="mi-lista/nuevo"
          options={{
            title: 'Agregar a Mi Lista',
            headerBackTitle: 'Cancelar',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}