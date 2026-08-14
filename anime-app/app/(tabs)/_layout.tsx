import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../../constants/colores';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORES.acento,
        tabBarInactiveTintColor: COLORES.textoSecundario,
        tabBarStyle: {
          backgroundColor: COLORES.superficie,
          borderTopColor: COLORES.borde,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: COLORES.superficie,
          borderBottomColor: COLORES.borde,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: COLORES.textoPrincipal,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Descubrir',
          headerTitle: '🎲 Random Anime',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shuffle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalogo"
        options={{
          title: 'Catálogo',
          headerTitle: '📚 Catálogo por Género',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mi-lista"
        options={{
          title: 'Mi Lista',
          headerTitle: '⭐ Mi Lista de Anime',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
