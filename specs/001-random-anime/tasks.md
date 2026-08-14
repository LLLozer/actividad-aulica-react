---
description: "Lista de tareas — Random Anime"
---

# Tasks: Random Anime

**Input**: Design documents from `specs/001-random-anime/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/servicios.md](./contracts/servicios.md),
[quickstart.md](./quickstart.md)

**Tests**: sin tareas de test automatizado. La constitución las declara fuera de alcance
(Principio IV); la verificación es manual en dispositivo físico.

**Organization**: las tareas se agrupan por User Story para que cada una pueda
implementarse, verificarse y demostrarse por separado.

## Format: `[ID] [P?] [Story] Descripción`

- **[P]**: puede hacerse en paralelo con otra tarea marcada `[P]` de la misma fase
  (archivos distintos, sin dependencias entre sí).
- **[Story]**: a qué User Story pertenece (US1…US5). Setup, Foundational y Polish no
  llevan etiqueta.
- Cada tarea indica su ruta de archivo exacta.

## Path Conventions

Proyecto móvil único en la **raíz del repositorio**: `app/`, `components/`, `services/`,
`models/`, `constants/`, `utils/`, `scripts/`. Sin `backend/` ni `api/`: no hay servidor
(Principio II).

## Reglas del proyecto (de `constitution.md`)

- Una tarea por vez, un commit por tarea.
- Toda tarea se verifica en teléfono físico con Expo Go antes de cerrarse.
- Las tareas se alternan entre los integrantes. **Quien no la implementó, la revisa** y
  tiene que poder explicarla.
- Al cerrar cada tarea se escribe su entrada en `PROCESO.md`, en el momento.

**Integrantes**: **A** y **B**. Reemplazar por los nombres reales antes de empezar.

---

## Phase 1: Setup (infraestructura compartida)

**Purpose**: dejar el repositorio y el proyecto Expo en condiciones de recibir código.

- [ ] T001 Aplanar el repositorio moviendo el contenido de `actividad-aulica-react/` a la raíz, eliminar `main.js`, y crear el proyecto con `npx create-expo-app@latest .` (genera `package.json`, `app/`, `app.json`)
  - **Integrante**: A · **Depende de**: nada
  - **Ojo**: verificar que `.gitignore` incluya `node_modules` **antes** del primer `git add`. Un commit con `node_modules` adentro es medio día de limpieza.
  - **Verifica en Expo Go**: `npx expo start`, escanear el QR, la app de ejemplo abre en el teléfono.
  - **Commit**: `chore: T001 - proyecto Expo base con expo-router`

- [ ] T002 Vaciar las pantallas de ejemplo del template en `app/`, dejando la estructura mínima de navegación
  - **Integrante**: B · **Depende de**: T001
  - **Verifica en Expo Go**: la app abre en **los dos** teléfonos y muestra pantallas vacías, sin errores en consola.
  - **Commit**: `chore: T002 - limpiar template y verificar en segundo dispositivo`

- [ ] T003 [P] Reinstalar la integración de Spec Kit para Claude Code en `.specify/` y escribir `AGENTS.md` en la raíz
  - **Integrante**: A · **Depende de**: T001
  - `.specify/init-options.json` hoy dice `"ai": "copilot"`. `AGENTS.md` debe incluir la prohibición explícita de imports desde `@react-navigation/*` y la regla de que ninguna pantalla importa `animes.json`.
  - **Verifica**: los comandos `/speckit.*` resuelven como skills desde Claude Code, sin leer los `SKILL.md` a mano.
  - **Commit**: `chore: T003 - integracion claude y AGENTS.md`

**Checkpoint**: el proyecto corre en los dos teléfonos y el agente tiene sus reglas.

---

## Phase 2: Foundational (bloquea todas las User Stories)

**Purpose**: tipos, constantes, capa de simulación, componentes de estado y navegación.
Todo lo que más de una historia necesita.

**⚠️ CRÍTICO**: ninguna User Story puede empezar hasta que esta fase esté cerrada.

- [ ] T004 [P] Definir la paleta, la tipografía, el espaciado y los géneros en `constants/colores.ts`, `constants/tipografia.ts`, `constants/espaciado.ts` y `constants/generos.ts`
  - **Integrante**: B · **Depende de**: T002
  - Cinco colores más uno de error; tres tamaños (24/18/14); espaciado en múltiplos de 8; radio único de 12. `generos.ts` lleva los cuatro géneros con su etiqueta legible y su `mal_id` para el script de seed (ver tabla en [data-model.md](./data-model.md)).
  - **Verifica en Expo Go**: importar un color en la pantalla principal y ver que se aplica.
  - **Commit**: `feat: T004 - constantes de diseño`

- [ ] T005 [P] Definir `Genero`, `Anime` e `ItemDeMiLista` en `models/Genero.ts`, `models/Anime.ts` y `models/ItemDeMiLista.ts`
  - **Integrante**: A · **Depende de**: T002
  - Campos y tipos exactos en [data-model.md](./data-model.md). `Genero` es unión de literales, no `string` (AD-03).
  - **Verifica**: asignar a propósito un género inexistente y comprobar que TypeScript lo marca. Después borrarlo.
  - **Commit**: `feat: T005 - modelos de datos`

- [ ] T006 Implementar `demorar()` y las constantes `SIMULAR_VACIO` / `SIMULAR_ERROR` en `services/simulacion.ts`
  - **Integrante**: B · **Depende de**: T005
  - `demorar()` espera entre 500 y 1000 ms sorteados por llamada, con `new Promise(resolve => setTimeout(resolve, ms))`. Contrato completo en [contracts/servicios.md](./contracts/servicios.md). Cubre FR-030 y FR-033.
  - **Verifica en Expo Go**: llamar `demorar()` desde la pantalla principal y comprobar que la espera es perceptible.
  - **Commit**: `feat: T006 - capa de simulacion con latencia artificial`
  - > Esta es la tarea que más van a preguntar en la defensa. Los dos integrantes tienen que poder explicarla sin mirar el archivo.

- [ ] T007 Crear los componentes de estado en `components/EstadoCargando.tsx`, `components/EstadoVacio.tsx` y `components/EstadoError.tsx`
  - **Integrante**: A · **Depende de**: T004
  - Presentacionales puros, sin consultar servicios. `EstadoCargando` con `ActivityIndicator`; `EstadoVacio` con mensaje y acción opcional; `EstadoError` con mensaje y botón de reintentar. Cubre FR-031.
  - **Verifica en Expo Go**: renderizar los tres, uno debajo del otro, en una pantalla temporal.
  - **Commit**: `feat: T007 - componentes de estado (cargando, vacio, error)`

- [ ] T008 [P] Crear los componentes base en `components/Boton.tsx`, `components/CampoTexto.tsx` y `components/SelectorGenero.tsx`
  - **Integrante**: B · **Depende de**: T004
  - `Boton` con estados normal, deshabilitado y cargando (lo necesita FR-032). `CampoTexto` con label y mensaje de error debajo. `SelectorGenero` con los cuatro géneros como chips seleccionables.
  - **Verifica en Expo Go**: tocar los chips y ver que cambia la selección; el botón deshabilitado no responde al toque.
  - **Commit**: `feat: T008 - componentes base de UI`

- [ ] T009 Crear la navegación por tabs en `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/catalogo.tsx` y `app/(tabs)/mi-lista.tsx`
  - **Integrante**: A · **Depende de**: T002
  - Tres tabs con pantallas vacías rotuladas, sin lógica. Todos los imports de navegación salen de `expo-router` (R-06).
  - **Verifica en Expo Go**: se navega entre las tres tabs y cada una muestra su título.
  - **Commit**: `feat: T009 - navegacion por tabs con expo-router`

- [ ] T010 Escribir el script de datos semilla en `scripts/seed-anime.mjs` y generar `services/data/animes.json`
  - **Integrante**: B · **Depende de**: T005
  - **IDs de género ya verificados** contra Jikan el 2026-08-14 (ver R-01 en [research.md](./research.md)): Isekai **62**, Mecha **18**, Slice of Life **36**, Spokon → Sports **30**. No hace falta volver a consultar `/genres/anime`.
  - El script **imprime el conteo por género y falla ruidosamente si alguno trae menos de 10**. Esa es la red de seguridad de R-01, que quedó sin poder verificarse en vivo porque Jikan devolvió `504` en las llamadas siguientes.
  - Normaliza nulos (`year`, `episodes`, `score` → `0`), descarta entradas sin título o sin sinopsis, y asigna el género **por el que se consultó**, no leyendo `genres[]` (R-02).
  - **Verifica**: correr `node scripts/seed-anime.mjs`, abrir el JSON y confirmar 10 a 15 animes por género, sin campos nulos ni títulos repetidos.
  - **Commit**: `feat: T010 - script de datos semilla desde Jikan`

- [ ] T011 Implementar `listarPorGenero`, `obtenerPorId` y `sortearPorGenero` en `services/animeService.ts`
  - **Integrante**: A · **Depende de**: T006, T010
  - Contrato exacto en [contracts/servicios.md](./contracts/servicios.md). Todas: `await demorar()` primero, después los flags de simulación, después leer el JSON. `sortearPorGenero(genero, excluirId?)` no devuelve el `excluirId` **salvo que el género tenga uno solo** (FR-004, FR-005).
  - **Verifica en Expo Go**: llamar las tres desde la pantalla temporal y mostrar el resultado con `JSON.stringify`. Se ve la demora y después los datos.
  - **Commit**: `feat: T011 - servicio del catalogo con simulacion`

**Checkpoint**: hay datos, servicios, navegación y componentes. Las historias pueden empezar.

---

## Phase 3: User Story 1 — Sortear una recomendación (Priority: P1) 🎯 MVP

**Goal**: el usuario elige un género, toca "Recomendame uno" y recibe un anime al azar
de ese género, con la posibilidad de volver a sortear.

**Independent Test**: elegir un género, sortear, verificar que el anime pertenece a ese
género, y sortear cinco veces seguidas verificando que nunca repite el anterior. No
requiere ninguna otra pantalla.

- [ ] T012 [P] [US1] Crear `components/TarjetaAnime.tsx` con portada, título, año, episodios y puntaje
  - **Integrante**: B · **Depende de**: T004, T005
  - Recibe todo por props; **no consulta servicios** (regla de dependencias del plan). Incluye el respaldo de portada: `onError` en la imagen y una bandera local que cambia al marcador de posición (AD-07, FR-034). Muestra "año desconocido" y "sin dato" cuando `anio` o `episodios` valen `0`.
  - **Verifica en Expo Go**: renderizarla con datos escritos a mano. No se desborda con títulos largos, y con una URL de imagen rota se ve el marcador.
  - **Commit**: `feat: T012 - componente TarjetaAnime`

- [ ] T013 [US1] Implementar la pantalla Descubrir en `app/(tabs)/index.tsx`
  - **Integrante**: A · **Depende de**: T007, T008, T011, T012
  - Selector de género, botón "Recomendame uno", tarjeta del resultado, botón "Otro". Cuatro estados: inicial, cargando, con resultado, error. Cubre FR-002 a FR-006.
  - **Verifica en Expo Go** (escenario V1 de [quickstart.md](./quickstart.md)):
    1. Sortear sin elegir género: avisa y no sortea.
    2. Elegir Mecha y sortear: indicador de carga y después un anime de Mecha.
    3. Tocar "Otro" cinco veces: nunca repite el que estaba en pantalla.
    4. `SIMULAR_ERROR = true`: estado de error con botón de reintentar.
  - **Commit**: `feat: T013 - pantalla Descubrir con sorteo aleatorio`

**Checkpoint**: la app ya cumple su propósito. Esto solo es demostrable como MVP.

---

## Phase 4: User Story 2 — Detalle y Mi Lista (Priority: P2)

**Goal**: el usuario abre el detalle de un anime, lo agrega a su lista de pendientes, y
lo encuentra ahí después de cerrar y reabrir la app.

**Independent Test**: abrir un detalle, agregarlo, verlo en Mi Lista, cerrar la app por
completo, reabrirla y comprobar que sigue ahí.

- [ ] T014 [US2] Implementar la pantalla de detalle en `app/anime/[id].tsx`
  - **Integrante**: B · **Depende de**: T011, T013
  - Ruta dinámica. Lee el parámetro con `useLocalSearchParams` y **convierte a número** antes de buscar. Muestra todos los campos y la sinopsis completa. Estados: cargando, no encontrado, con datos. Cubre FR-009, FR-010, FR-011.
  - **Verifica en Expo Go**: tocar la tarjeta en Descubrir abre el detalle correcto; volver atrás funciona; entrar a `/anime/999999` muestra "no encontrado" y no un error.
  - **Commit**: `feat: T014 - pantalla de detalle con ruta dinamica`
  - > `useLocalSearchParams` devuelve **string** siempre. Olvidarse del `Number(id)` es el bug más común de este proyecto.

- [ ] T015 [US2] Implementar `listar`, `agregar`, `eliminar` y `existeTitulo` en `services/miListaService.ts`
  - **Integrante**: A · **Depende de**: T005, T006
  - Instalar `@react-native-async-storage/async-storage`. Clave única `@random_anime:mi_lista` con el array serializado (R-05). **Si la clave no existe, `getItem` devuelve `null` y el servicio traduce eso a `[]`**: el primer arranque no es un error. `agregar` rechaza títulos duplicados comparando en minúsculas y sin espacios en los extremos (FR-027). Contrato completo en [contracts/servicios.md](./contracts/servicios.md).
  - **Verifica en Expo Go**: desde la pantalla temporal, agregar un ítem, cerrar la app por completo, reabrir y comprobar que sigue ahí.
  - **Commit**: `feat: T015 - servicio de Mi Lista con AsyncStorage`

- [ ] T016 [US2] Agregar la acción "Agregar a mi lista" en `app/anime/[id].tsx`
  - **Integrante**: B · **Depende de**: T014, T015
  - Si el anime ya está en la lista, se indica visualmente y el botón queda deshabilitado. Durante la escritura el botón se deshabilita y al terminar confirma. `puntajePersonal` se copia del puntaje de la comunidad redondeado y `origen` es `'catalogo'` (ver tabla en [data-model.md](./data-model.md)). Cubre FR-012, FR-013, FR-032.
  - **Verifica en Expo Go**: agregar un anime; volver a entrar al mismo detalle y comprobar que indica que ya está y no permite duplicarlo.
  - **Commit**: `feat: T016 - agregar anime a Mi Lista desde el detalle`

- [ ] T017 [P] [US2] Crear `components/ItemLista.tsx` con título, género, puntaje personal y origen
  - **Integrante**: A · **Depende de**: T004, T005
  - Presentacional puro. El origen (`catalogo` / `manual`) se muestra de forma legible, no como el literal. Cubre FR-015.
  - **Verifica en Expo Go**: renderizarlo con un ítem de cada origen escrito a mano.
  - **Commit**: `feat: T017 - componente ItemLista`

- [ ] T018 [US2] Implementar la pantalla Mi Lista en `app/(tabs)/mi-lista.tsx`
  - **Integrante**: B · **Depende de**: T007, T015, T017
  - `FlatList` ordenada del más reciente al más antiguo, con acceso al formulario. Estados: cargando, vacío, con datos. El estado vacío ofrece ir a Descubrir o cargar uno a mano. Cubre FR-014, FR-016, FR-018, FR-019. **La eliminación no entra acá**: es US5 (T022).
  - **Verifica en Expo Go**: la lista muestra lo agregado en T016; cerrar y reabrir la app conserva el contenido; con la lista vacía se ve el mensaje explicativo, no una lista en blanco.
  - **Commit**: `feat: T018 - pantalla Mi Lista`

**Checkpoint**: US1 y US2 funcionan de forma independiente. La app ya persiste datos.

---

## Phase 5: User Story 3 — Cargar un anime a mano con validación (Priority: P3)

**Goal**: el usuario agrega a su lista un anime que no está en el catálogo, con todos
los errores de validación visibles a la vez.

**Independent Test**: intentar guardar con todo vacío y ver los cuatro errores juntos;
después completar bien y verificar que el ítem aparece primero en Mi Lista.

- [ ] T019 [P] [US3] Escribir la función pura de validación en `utils/validarItem.ts`
  - **Integrante**: A · **Depende de**: T005
  - Recibe los campos y devuelve `{ campo: mensaje }`; objeto vacío significa válido. **Evalúa todas las reglas siempre**, aunque una ya haya fallado: cortar en el primer error incumple FR-026. Tabla de reglas y mensajes exactos en [data-model.md](./data-model.md). Sin librerías (AD-05). Cubre FR-021 a FR-026.
  - **Verifica**: llamarla desde la pantalla temporal con datos inválidos a propósito y ver el objeto de errores completo.
  - **Commit**: `feat: T019 - funcion de validacion del formulario`

- [ ] T020 [US3] Implementar el formulario de alta en `app/mi-lista/nuevo.tsx`
  - **Integrante**: B · **Depende de**: T008, T015, T018, T019
  - Cinco campos, validación **al intentar guardar** y no en cada tecla, todos los errores juntos, botón deshabilitado durante el guardado, y detección de título duplicado con `existeTitulo` antes de intentar el alta. `origen` es `'manual'`. Cubre FR-020 a FR-028.
  - **Verifica en Expo Go** (escenario V4 de [quickstart.md](./quickstart.md)):
    1. Guardar con todo vacío: se muestran **todos** los errores a la vez.
    2. Título de 1 y de 81 caracteres, episodios en 0 y 5001, puntaje en 0 y 11: todos rechazados.
    3. Comentario de más de 200 caracteres: rechazado. Vacío: válido.
    4. Título que ya está en la lista: avisa que está duplicado.
    5. Completar bien y guardar: vuelve a Mi Lista con el ítem nuevo **primero**.
  - **Commit**: `feat: T020 - formulario de alta con validacion`

**Checkpoint**: el requisito duro de la consigna (formulario con validación) está cumplido.

---

## Phase 6: User Story 4 — Explorar el catálogo de un género (Priority: P4)

**Goal**: el usuario ve todos los animes de un género y elige él en lugar del azar.

**Independent Test**: recorrer los cuatro géneros verificando que el listado cambia,
que está ordenado por puntaje descendente y que cada ítem abre su detalle.

- [ ] T021 [US4] Implementar la pantalla Catálogo en `app/(tabs)/catalogo.tsx`
  - **Integrante**: A · **Depende de**: T011, T012, T014
  - Selector de género arriba, `FlatList` de tarjetas ordenadas por puntaje descendente. Estados: cargando, vacío, con datos, error. Cubre FR-007, FR-008, FR-009.
  - **Verifica en Expo Go**: cambiar de género recarga con su demora; tocar un ítem abre **ese** detalle; `SIMULAR_VACIO = true` muestra el estado vacío y `SIMULAR_ERROR = true` el de error con reintento.
  - **Commit**: `feat: T021 - pantalla de catalogo por genero`

**Checkpoint**: las cinco pantallas existen. Falta cerrar el ciclo de vida de la lista.

---

## Phase 7: User Story 5 — Quitar un ítem de mi lista (Priority: P5)

**Goal**: el usuario elimina de su lista lo que ya vio o dejó de interesarle, con
confirmación previa.

**Independent Test**: cancelar una eliminación y verificar que el ítem sigue; aceptarla
y verificar que desaparece y no vuelve al reabrir la app.

- [ ] T022 [US5] Agregar la acción de eliminar con confirmación en `app/(tabs)/mi-lista.tsx` y `components/ItemLista.tsx`
  - **Integrante**: B · **Depende de**: T018
  - Confirmación antes de borrar nada. Al eliminar el último ítem, la pantalla pasa al estado vacío. Eliminar un id inexistente no rompe nada. Cubre FR-017.
  - **Verifica en Expo Go** (escenario V6 de [quickstart.md](./quickstart.md)): cancelar deja el ítem; confirmar lo saca; cerrar y reabrir la app confirma que no volvió; vaciar la lista muestra el estado vacío.
  - **Commit**: `feat: T022 - eliminar item de Mi Lista con confirmacion`

**Checkpoint**: las cinco historias están completas y son demostrables por separado.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T023 Correr el checklist de regresión completo de [quickstart.md](./quickstart.md) (escenarios V1 a V8) en los dos teléfonos
  - **Integrante**: A y B juntos · **Depende de**: T022
  - Incluye V7 (estados vacío y error forzados con las banderas) y V8 (modo avión: todo funciona salvo las portadas). Cubre FR-029, FR-031, FR-033, FR-035, que son transversales y no pertenecen a ninguna historia.
  - Anotar todo lo que falle y abrir tareas correctivas `fix: TXX - ...`.
  - **Commit**: solo si hubo correcciones.

- [ ] T024 [P] Verificar las puertas de calidad de la constitución sobre todo el proyecto
  - **Integrante**: A · **Depende de**: T023
  - Sin imports de `@react-navigation/*` en ningún archivo; ninguna pantalla importa `services/data/animes.json`; `package.json` sin librerías fuera de la lista permitida; `SIMULAR_VACIO` y `SIMULAR_ERROR` en `false`.
  - **Verifica**: buscar `@react-navigation` y `animes.json` en todo el proyecto y confirmar que no aparecen fuera de `services/`.
  - **Commit**: `chore: T024 - verificacion de puertas de calidad`

- [ ] T025 Escribir `README.md` y cerrar `PROCESO.md` con las conclusiones
  - **Integrante**: B · **Depende de**: T024
  - README con cómo correr el proyecto y dónde están `spec.md`, `plan.md` y `tasks.md`. Conclusiones en `PROCESO.md`: qué funcionó al desarrollar con IA, qué no, qué harían distinto.
  - **Verifica**: alguien ajeno al proyecto sigue el README y logra correr la app.
  - **Commit**: `docs: T025 - README y conclusiones`

- [ ] T026 Copiar `spec.md`, `plan.md` y `tasks.md` desde `specs/001-random-anime/` a la raíz del repositorio
  - **Integrante**: A · **Depende de**: T025
  - La entrega los pide en la raíz y Spec Kit los escribe en `specs/`. Se copian al cerrar, no antes, para no mantener dos versiones divergentes durante todo el desarrollo.
  - **Verifica**: los tres archivos están en la raíz y su contenido coincide con el de `specs/001-random-anime/`.
  - **Commit**: `docs: T026 - copiar artefactos de spec kit a la raiz`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias. T001 bloquea absolutamente todo lo demás.
- **Foundational (Phase 2)**: depende de Setup. **Bloquea todas las User Stories.**
- **User Stories (Phase 3–7)**: todas dependen de Foundational.
  - US1 no depende de ninguna otra historia.
  - US2 reutiliza la tarjeta de US1 (T012) para navegar al detalle, pero es verificable
    sola.
  - US3 necesita que Mi Lista exista (T018), porque el formulario guarda ahí.
  - US4 solo depende de Foundational y de T014 para navegar al detalle. **Puede
    construirse en cualquier momento después de US2**, o recortarse si falta tiempo.
  - US5 necesita la pantalla Mi Lista (T018).
- **Polish (Phase 8)**: depende de todas las historias que se vayan a entregar.

### Sobre el orden respecto de `plan.md`

El "Orden de construcción" de [plan.md](./plan.md) pone el Catálogo antes de Mi Lista.
Acá las fases van en orden de **prioridad de la spec**, así que Catálogo (US4) quedó
después del formulario. Las dos secuencias son válidas y llegan al mismo lugar: mientras
Foundational esté cerrada, US4 puede hacerse cuando convenga. Si el equipo prefiere el
orden del plan, adelantar T021 justo después de T014 no rompe ninguna dependencia.

### Parallel Opportunities

Las tareas marcadas `[P]` de una misma fase tocan archivos distintos y pueden hacerse a
la vez, uno por integrante:

- **Phase 2**: T004 (constantes, B) y T005 (modelos, A) en paralelo. Después T007 (A) y
  T008 (B) en paralelo.
- **Phase 3**: T012 (B) mientras A todavía cierra Foundational.
- **Phase 4**: T017 (A) mientras B trabaja en T014.
- **Phase 5**: T019 (A) mientras B termina T018.

Con dos personas, el paralelismo real es de a dos tareas. Más que eso es coordinación
que no rinde.

---

## Implementation Strategy

### MVP primero (solo US1)

1. Phase 1 completa: el proyecto corre en los dos teléfonos.
2. Phase 2 completa: **crítico**, bloquea todo.
3. Phase 3 completa: US1 funcionando.
4. **PARAR Y VERIFICAR**: escenario V1 de quickstart en los dos teléfonos.
5. Si hasta acá funciona, ya hay algo demostrable aunque el resto se caiga.

### Entrega incremental

Setup + Foundational → US1 (MVP) → US2 → US3 → US4 → US5 → Polish.

Cada historia agrega valor sin romper las anteriores. Si el tiempo aprieta, se recorta
desde el final: **US4 es la más prescindible** según la spec. **US3 no se recorta jamás**:
el formulario con validación es requisito duro de la consigna.

---

## Resumen de asignación

| Integrante | Tareas | Total |
|---|---|---|
| **A** | T001, T003, T005, T007, T009, T011, T013, T015, T017, T019, T021, T023, T024, T026 | 14 |
| **B** | T002, T004, T006, T008, T010, T012, T014, T016, T018, T020, T022, T023, T025 | 13 |

T023 es de los dos. El reparto está equilibrado a propósito: si el historial de Git
muestra que uno hizo veinte tareas y el otro seis, la defensa individual del segundo va
a ser un problema.

---

## Trazabilidad: requisitos → tareas

| Requisitos | Tarea |
|---|---|
| FR-001 | T004, T005 |
| FR-002 a FR-006 | T013 |
| FR-007, FR-008 | T021 |
| FR-009 | T014, T021 |
| FR-010, FR-011 | T014 |
| FR-012, FR-013 | T016 |
| FR-014, FR-016, FR-019 | T018 |
| FR-015 | T017 |
| FR-017 | T022 |
| FR-018 | T015 |
| FR-020 a FR-026 | T019, T020 |
| FR-027, FR-028 | T015, T020 |
| FR-029 | T011, T015, T024 |
| FR-030 | T006 |
| FR-031 | T007, y cada pantalla |
| FR-032 | T008, T016, T020 |
| FR-033 | T006, T023 |
| FR-034 | T012 |
| FR-035 | T023 |

Los 35 requisitos funcionales están cubiertos. Los transversales (FR-029, FR-031,
FR-033, FR-035) se verifican de punta a punta en T023 y T024.

---

## Notes

- `[P]` = archivos distintos, sin dependencias entre sí.
- Un commit por tarea, con el ID adelante. El historial de Git es evidencia evaluada.
- Se puede parar en cualquier checkpoint y tener algo demostrable.
- Ninguna tarea se cierra sin: verificación en teléfono, revisión cruzada, y entrada en
  `PROCESO.md`.
