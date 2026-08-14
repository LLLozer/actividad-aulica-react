# Reglas de Agente para Random Anime

1. **Navegación**: Utilizar exclusivamente `expo-router` (`useRouter`, `useLocalSearchParams`, `Link`, `Tabs`, `Stack`). Está terminantemente prohibido importar desde paquetes `@react-navigation/*`.
2. **Capa de Datos**: Ninguna pantalla o componente de UI debe importar `services/data/animes.json` directamente. Todo acceso a datos debe realizarse a través de `services/animeService.ts` o `services/miListaService.ts`.
3. **Persistencia**: La lista personal se almacena en `@react-native-async-storage/async-storage` bajo la clave `@random_anime:mi_lista`.
4. **Estados de UI**: Toda pantalla que consuma datos asíncronos debe manejar explícitamente los 4 estados:
   - Cargando (`EstadoCargando` con ActivityIndicator)
   - Error (`EstadoError` con mensaje y reintento)
   - Vacío (`EstadoVacio` con mensaje explicativo)
   - Con datos
5. **Estilos y Arquitectura**: Usar `StyleSheet.create` con constantes de diseño de `constants/`. Mantener simplicidad explícita.
