# PROCESO.md — Bitácora de Desarrollo y Experiencia con Specify & Spec Kit

> **Autor:** Bitácora en primera persona del proceso de diseño, especificación, arquitectura y desarrollo del proyecto *Random Anime* utilizando **GitHub Spec Kit** (`specify`).

---

## 1. Introducción y Punto de Partida

Cuando comenzamos con este proyecto para la materia de React Native, teníamos un objetivo claro pero desafiante: construir una aplicación móvil completa, defendible oralmente en cada línea de código, que cumpliera con todos los requisitos de la cátedra (mínimo de pantallas con `expo-router`, catálogo con detalle, manejo explícito de estados de carga/error/vacío, formulario con validación y persistencia local sin backend real).

Decidimos encarar el desarrollo con una metodología guiada por especificaciones (**Spec-Driven Development**) utilizando **GitHub Spec Kit** (`specify`). A continuación cuento detalladamente cómo fue todo el recorrido, desde las decisiones iniciales y los prompts con el agente, hasta la implementación final y las lecciones aprendidas.

---

## 2. El Proceso con Specify y la Creación de las Specs

### 2.1. Definiendo las Reglas: La Constitución (`constitution.md`)

Antes de escribir una sola línea de código o pantalla, establecimos nuestra "Constitución" en `.specify/memory/constitution.md`. Esto fue fundamental para marcarle la cancha a la IA y a nosotros mismos:

1. **Principio I — Defendibilidad Individual (No Negociable):** Cada integrante del equipo tiene que poder explicar cualquier línea de código ante los profesores en la defensa individual. Si una abstracción o hook mágico es difícil de justificar, se descarta por una solución más simple y explícita.
2. **Principio II — Sin Backend Real pero con Datos Creíbles:** Prohibido consumir APIs en vivo en runtime el día de la demo (para evitar caídas de wifi o límites de tasa de Jikan) y prohibido inventar datos tontos. Se decidió bajar un dataset real de MyAnimeList una sola vez con un script y consumirlo mediante una capa de servicios asíncrona con latencia artificial (`demorar()`).
3. **Principio III — Simplicidad Explícita:** Estilos con `StyleSheet.create`, estados con `useState`/`useEffect`, y nada de librerías externas pesadas (como Formik, Redux o Zod) que complejicen la defensa oral.
4. **Principio IV — Verificación en Teléfono Real:** Toda tarea se prueba físicamente con Expo Go antes de considerarse cerrada.
5. **Principio V — Flujo Especificación → Tarea → Commit:** Nada se programa si no está previamente estipulado en la spec.

### 2.2. La Especificación Funcional (`spec.md`)

Con `specify` modelamos la feature `001-random-anime` en `specs/001-random-anime/spec.md`.
Allí redactamos:
- Los cuatro géneros fijos: **Isekai**, **Mecha**, **Slice of Life** y **Spokon**.
- Las 5 User Stories priorizadas:
  - **US1 (P1 - MVP):** Sortear una recomendación al azar dentro de un género, con botón "Otro" que garantice no repetir de inmediato el mismo anime si hay más de uno.
  - **US2 (P2):** Ver pantalla de detalle y agregar a "Mi Lista" de pendientes.
  - **US3 (P3):** Cargar un anime a mano mediante un formulario con validación simultánea campo por campo.
  - **US4 (P4):** Explorar el catálogo ordenado por puntaje de la comunidad de mayor a menor.
  - **US5 (P5):** Quitar un anime de "Mi Lista" con confirmación preventiva.
- Los 35 Requisitos Funcionales (FR-001 a FR-035) y Criterios de Éxito (SC-001 a SC-010).

### 2.3. Investigación y Resolución de Riesgos (`research.md`)

Durante la fase de investigación nos encontramos con desafíos reales:
- **Riesgo de categorías en Jikan (R-01):** Verificamos los IDs de género en Jikan API (Isekai: 62, Mecha: 18, Slice of Life: 36, Sports/Spokon: 30). Descubrimos que Jikan a veces arrojaba errores `504 Gateway Timeout`. Por eso, en `seed-anime.mjs` implementamos un dataset curado de respaldo para que el script nunca falle y garantice 12 animes por género (48 en total).
- **Advertencia técnica de Expo SDK (R-06):** En versiones recientes de Expo, `expo-router` no permite imports directos de `@react-navigation/*`. Si la IA proponía `useNavigation` o `useRoute`, sabíamos que debíamos corregirlo para usar `useRouter`, `useLocalSearchParams` y `Link` propios de `expo-router`.

### 2.4. Modelado y Contratos (`data-model.md` y `contracts/servicios.md`)

Una de las mejores decisiones de diseño fue **separar las entidades `Anime` e `ItemDeMiLista`**:
- `Anime` (Catálogo): Es de solo lectura, viene del seed, tiene `id` numérico, sinopsis, año y puntaje de la comunidad.
- `ItemDeMiLista` (Lista del usuario): Tiene `id` de texto (`Date.now().toString()`), fecha de agregado, puntaje personal (1-10), comentario opcional y origen (`catalogo` o `manual`).

Diseñamos los contratos en `services/`:
- `animeService.ts`: `listarPorGenero()`, `obtenerPorId()`, `sortearPorGenero()`.
- `miListaService.ts`: `listar()`, `agregar()`, `eliminar()`, `existeTitulo()`.
- `simulacion.ts`: `demorar()`, `SIMULAR_VACIO`, `SIMULAR_ERROR` (clave para demostrar los estados en 10 segundos ante los docentes).

---

## 3. Registro Tarea por Tarea (Implementación y Verificación)

Seguimos fielmente la lista de tareas de `tasks.md`:

### Fase 1: Setup e Infraestructura Base
- **T001 & T002:** Inicializamos el proyecto con Expo y `expo-router`, limpiamos plantillas de ejemplo y dejamos la base de navegación lista.
- **T003:** Creamos `AGENTS.md` con las restricciones duras para que cualquier prompt de IA respete la arquitectura establecida.

### Fase 2: Foundational (Fundamentos y Capa Simulada)
- **T004:** Definimos `constants/colores.ts`, `tipografia.ts`, `espaciado.ts` y `generos.ts`.
- **T005:** Escribimos los tipos TypeScript en `models/Genero.ts`, `models/Anime.ts` e `models/ItemDeMiLista.ts`.
- **T006:** Implementamos la función `demorar()` (500–1000 ms) y las constantes `SIMULAR_VACIO` y `SIMULAR_ERROR` en `services/simulacion.ts`.
- **T007 & T008:** Creamos los componentes reutilizables: `EstadoCargando`, `EstadoVacio`, `EstadoError`, `Boton`, `CampoTexto` y `SelectorGenero`.
- **T009:** Configuramos el layout de tabs en `app/_layout.tsx` y `app/(tabs)/_layout.tsx`.
- **T010:** Ejecutamos `scripts/seed-anime.mjs` generando `services/data/animes.json` con 48 animes (12 por género) sin nulos.
- **T011:** Implementamos `services/animeService.ts` aplicando la simulación de latencia en cada método.

### Fase 3: User Story 1 — Descubrir y Sortear (MVP)
- **T012:** Creamos `components/TarjetaAnime.tsx` con manejo de imagen remota y placeholder de respaldo en caso de error de red.
- **T013:** Implementamos la pantalla principal en `app/(tabs)/index.tsx`. Probamos:
  1. Sortear sin elegir género: Muestra mensaje de validación.
  2. Elegir género y sortear: Muestra cargando con latencia simulada y luego la tarjeta del anime.
  3. Tocar "Proponer otro": Sortea sin repetir inmediatamente el anterior.

### Fase 4: User Story 2 — Detalle y Mi Lista Persistente
- **T014:** Implementamos la pantalla dinámica `app/anime/[id].tsx` usando `useLocalSearchParams` y parseando el ID a número.
- **T015:** Implementamos `services/miListaService.ts` con `@react-native-async-storage/async-storage` bajo la clave `@random_anime:mi_lista`, manejando el caso de lista vacía en el primer arranque.
- **T016:** Integramos el botón "Guardar en Mi Lista" en el detalle, deshabilitándolo si ya existe.
- **T017 & T018:** Creamos `components/ItemLista.tsx` y la pantalla `app/(tabs)/mi-lista.tsx` con recarga automática (`useFocusEffect`) y orden descendente por fecha.

### Fase 5: User Story 3 — Formulario de Alta con Validación
- **T019:** Escribimos la función pura `utils/validarItem.ts` que valida título (2-80 chars), género seleccionado, episodios (1-5000 numérico), puntaje (1-10) y comentario (máx 200 chars), evaluando todas las reglas al mismo tiempo.
- **T020:** Construimos `app/mi-lista/nuevo.tsx`. Al presionar guardar sin datos, se muestran todos los mensajes de error en rojo simultáneamente. Si está todo correcto, guarda con origen `manual` y vuelve a la lista.

### Fase 6: User Story 4 — Exploración de Catálogo
- **T021:** Implementamos `app/(tabs)/catalogo.tsx` con chips de selección de género y `FlatList` ordenada por puntaje comunitario. Tocar cualquier anime navega a su detalle.

### Fase 7: User Story 5 — Baja con Confirmación
- **T022:** Agregamos el botón "Eliminar" en `ItemLista` y la confirmación mediante `Alert.alert` en `app/(tabs)/mi-lista.tsx`. Si se confirma, se borra de AsyncStorage y la lista se actualiza al instante.

### Fase 8: Control de Calidad y Cierre
- **T023 & T024:** Verificamos los 8 escenarios de prueba de `quickstart.md` (sorteo, detalle, persistencia al reiniciar la app, validación múltiple, catálogo, eliminación, banderas `SIMULAR_ERROR`/`SIMULAR_VACIO` y funcionamiento sin conexión de datos).
- **T025 & T026:** Documentamos el proceso completo en `proceso.md`, `README.md` y sincronizamos los artefactos en la raíz del proyecto.

---

## 4. Reflexión y Aprendizajes de Trabajar con IA y Spec Kit

1. **La importancia de no saltar directo al código:**
   Al principio uno siente la tentación de pedirle a la IA: *"haceme una app de anime con 5 pantallas"*. El resultado de eso siempre es código spaghetti, librerías incompatibles y cosas que después no podés explicar. Usar `specify` para definir la Constitución, las Entidades y los Contratos primero, transformó el desarrollo en un proceso ordenado donde cada archivo tiene un propósito claro.

2. **Evitar librerías "caja negra":**
   Hacer la validación del formulario con una función pura en TypeScript en lugar de instalar Zod o Formik nos tomó 20 líneas de código y nos garantiza que en la defensa oral podemos explicar exactamente cómo funciona cada `if`.

3. **Capa Mock con propósito:**
   El requisito de "sin backend" muchas veces se resuelve poniendo un `require('./data.json')` adentro de un componente. Nosotros creamos una carpeta `services/` con métodos `async` y latencia `demorar()`. Si el día de mañana queremos conectar una API real, la interfaz de usuario no cambia en lo absoluto.

---

## 5. Estado Final del Proyecto

- **5 Pantallas funcionales:** Descubrir (`index.tsx`), Catálogo (`catalogo.tsx`), Detalle (`anime/[id].tsx`), Mi Lista (`mi-lista.tsx`) y Formulario de Alta (`mi-lista/nuevo.tsx`).
- **Navegación:** `expo-router` con tabs y stack.
- **Persistencia:** AsyncStorage local.
- **Dataset:** 48 animes reales organizados en 4 géneros.
- **Puertas de calidad:** 100% aprobadas y listas para probar.
