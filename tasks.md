# Tasks: Random Anime

**Input**: Design documents from `specs/001-random-anime/`

## Phase 1: Setup
- [x] T001 Inicializar proyecto Expo con soporte expo-router.
- [x] T002 Limpiar pantallas y configurar layout de navegación.
- [x] T003 Integrar reglas de arquitectura en `AGENTS.md` y Spec Kit.

## Phase 2: Foundational
- [x] T004 Constantes de diseño en `constants/colores.ts`, `tipografia.ts`, `espaciado.ts`, `generos.ts`.
- [x] T005 Modelos de datos en `models/Genero.ts`, `models/Anime.ts`, `models/ItemDeMiLista.ts`.
- [x] T006 Capa de simulación con latencia artificial y flags en `services/simulacion.ts`.
- [x] T007 Componentes de estado en `components/EstadoCargando.tsx`, `EstadoVacio.tsx`, `EstadoError.tsx`.
- [x] T008 Componentes base de UI en `components/Boton.tsx`, `CampoTexto.tsx`, `SelectorGenero.tsx`.
- [x] T009 Navegación por tabs en `app/_layout.tsx`, `app/(tabs)/_layout.tsx`.
- [x] T010 Script de datos semilla `scripts/seed-anime.mjs` y generación de `services/data/animes.json`.
- [x] T011 Servicio del catálogo con simulación en `services/animeService.ts`.

## Phase 3: User Story 1 — Descubrir y Sortear (P1)
- [x] T012 Componente `components/TarjetaAnime.tsx` con portada remota y respaldo.
- [x] T013 Pantalla Descubrir en `app/(tabs)/index.tsx` con sorteo sin repetición inmediata.

## Phase 4: User Story 2 — Detalle y Mi Lista (P2)
- [x] T014 Pantalla de detalle en `app/anime/[id].tsx` con ruta dinámica.
- [x] T015 Servicio de Mi Lista con persistencia local en `services/miListaService.ts`.
- [x] T016 Acción "Agregar a mi lista" desde el detalle evitando duplicados.
- [x] T017 Componente `components/ItemLista.tsx`.
- [x] T018 Pantalla Mi Lista en `app/(tabs)/mi-lista.tsx` con FlatList ordenada.

## Phase 5: User Story 3 — Formulario de alta con validación (P3)
- [x] T019 Función pura de validación simultánea en `utils/validarItem.ts`.
- [x] T020 Pantalla de formulario en `app/mi-lista/nuevo.tsx`.

## Phase 6: User Story 4 — Catálogo por género (P4)
- [x] T021 Pantalla de catálogo en `app/(tabs)/catalogo.tsx` ordenado por puntaje.

## Phase 7: User Story 5 — Quitar de Mi Lista (P5)
- [x] T022 Acción de eliminar con diálogo de confirmación en `app/(tabs)/mi-lista.tsx`.

## Phase 8: Polish & Documentation
- [x] T023 Verificación de escenarios de prueba manuales.
- [x] T024 Verificación de calidad y ausencia de `@react-navigation/*`.
- [x] T025 Redacción de `PROCESO.md` y documentación.
