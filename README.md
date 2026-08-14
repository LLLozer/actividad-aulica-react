# Random Anime 🎲

Aplicación móvil desarrollada en **React Native con Expo SDK y expo-router** que recomienda animes al azar dentro de cuatro géneros fijos (**Isekai**, **Mecha**, **Slice of Life** y **Spokon**), con catálogo completo, pantalla de detalle, lista personal persistente y formulario de alta manual con validación simultánea.

---

## 📱 Pantallas de la Aplicación

1. **Descubrir (`/app/(tabs)/index.tsx`):** Selector de género, sorteo al azar puro con latencia simulada y botón para volver a sortear sin repetir inmediatamente.
2. **Catálogo (`/app/(tabs)/catalogo.tsx`):** Listado completo de animes por género ordenados por puntaje de la comunidad de mayor a menor.
3. **Detalle (`/app/anime/[id].tsx`):** Portada, sinopsis completa, año, episodios, puntaje y botón "Guardar en Mi Lista".
4. **Mi Lista (`/app/(tabs)/mi-lista.tsx`):** Animes guardados con persistencia local (`AsyncStorage`), ordenados del más reciente al más antiguo y acción para eliminar con confirmación.
5. **Formulario de Alta (`/app/mi-lista/nuevo.tsx`):** Carga manual de animes con validación simultánea de todos los campos y prevención de duplicados.

---

## 🛠️ Requisitos Previos

- **Node.js** (versión 18 o superior recomendada).
- **Expo Go** instalado en un teléfono móvil físico (iOS o Android).
- Dispositivo móvil y computadora conectados a la misma red Wi-Fi.

---

## 🚀 Puesta en Marcha

1. Ingresar a la carpeta de la app e instalar dependencias:
   ```bash
   cd anime-app
   npm install
   ```

2. (Opcional) Generar o actualizar el dataset semilla de animes:
   ```bash
   node scripts/seed-anime.mjs
   ```

3. Iniciar el servidor de desarrollo de Expo:
   ```bash
   npx expo start
   ```

4. Escanear el código QR que aparece en la terminal con la aplicación **Expo Go** en tu teléfono móvil.

---

## 🧪 Pruebas de Estados (Defensa Oral)

En `services/simulacion.ts`:
- Cambiar `SIMULAR_ERROR = true` para probar el manejo de errores y botones de reintento en todas las pantallas.
- Cambiar `SIMULAR_VACIO = true` para probar los estados vacíos con mensajes explicativos y acciones directas.

---

## 📑 Documentación y Proceso con Specify / Spec Kit

- [proceso.md](./proceso.md): Bitácora completa del proceso de desarrollo y experiencia con Spec Kit en primera persona.
- [spec.md](./spec.md): Especificación de requerimientos funcionales y criterios de aceptación.
- [plan.md](./plan.md): Plan de implementación y arquitectura.
- [tasks.md](./tasks.md): Lista de tareas atómicas ejecutadas.
- [specs/001-random-anime/](./specs/001-random-anime/): Documentación completa generada con Spec Kit (`contracts/`, `research.md`, `data-model.md`, `quickstart.md`).
