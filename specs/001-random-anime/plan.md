# Implementation Plan: Random Anime

**Branch**: `001-random-anime` | **Date**: 2026-08-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-random-anime/spec.md`

## Summary

Prototipo móvil que recomienda un anime al azar dentro de cuatro géneros (Isekai,
Mecha, Slice of Life, Spokon), permite explorar el catálogo, ver el detalle de cada
título y mantener una lista personal de pendientes con altas manuales validadas y bajas
con confirmación.

**Enfoque técnico:** aplicación Expo con navegación por archivos (`expo-router`) y
**sin backend**. Los datos reales de anime se obtienen una única vez mediante un script
de Node que consume la API pública de Jikan y genera un JSON semilla commiteado al
repositorio. En runtime, una capa de servicios simulada sirve esos datos con latencia
artificial de 500 a 1000 ms, con la misma forma que tendría un cliente HTTP real.

## Technical Context

**Language/Version**: TypeScript 5.x sobre React Native 0.85 / React 19.2

**Primary Dependencies**: Expo SDK 56, `expo-router`,
`@react-native-async-storage/async-storage`, `@expo/vector-icons`

**Storage**: AsyncStorage, solo para "Mi Lista". Catálogo en JSON estático dentro del
bundle.

**Testing**: verificación manual en dispositivo físico con Expo Go. Sin tests
automatizados: fuera de alcance del prototipo, decisión registrada en la constitución
(Principio IV).

**Target Platform**: Android e iOS mediante Expo Go. Dispositivo físico obligatorio.

**Project Type**: mobile-app (single project, sin backend)

**Performance Goals**: no aplica. La latencia es artificial y deliberada. Único
requisito: la interfaz no debe bloquearse durante la espera simulada.

**Constraints**:

- Sin conexión de red en runtime para los datos. La red solo afecta la descarga de las
  portadas, que degradan a marcador de posición (FR-034, FR-035, decisión AD-07).
- Sin librerías fuera de la lista permitida por la constitución.
- Todo el código debe ser explicable línea por línea por cualquiera de los dos
  integrantes.

**Scale/Scope**: 5 pantallas, 4 géneros, 40 a 60 animes en el catálogo, 1 usuario por
dispositivo. Sin paginado.

## Constitution Check

*GATE: debe pasar antes de la investigación de Fase 0. Re-verificado después del diseño
de Fase 1.*

| Principio | Verificación | Estado (pre-diseño) | Estado (post-diseño) |
|---|---|---|---|
| **I. Defendibilidad Individual** | ¿Hay algún patrón que un integrante no pueda explicar? Se descartó abstraer el manejo de estados a un hook genérico por este motivo. | PASA | PASA |
| **II. Sin Backend** | ¿Alguna pantalla consulta un servicio remoto o importa el JSON directamente? No: todo pasa por `services/`. El script de seed no se ejecuta desde la app. | PASA | PASA |
| **III. Simplicidad Explícita** | ¿Se introduce alguna librería prohibida? No. Validación a mano, estilos con `StyleSheet`, estado con `useState`. | PASA | PASA |
| **IV. Verificación en Dispositivo Real** | ¿Todos los estados son verificables sin modificar datos? Sí: flags `SIMULAR_VACIO` y `SIMULAR_ERROR` en `services/simulacion.ts`. | PASA | PASA |
| **V. Una Tarea, Un Commit, Un Registro** | ¿El orden de construcción permite tareas atómicas verificables? Sí, ver "Orden de construcción". | PASA | PASA |

**Desviaciones justificadas:** ninguna. La tabla de Complexity Tracking queda vacía a
propósito.

**Deuda consciente:** se repite el patrón de tres `useState` (`datos`, `cargando`,
`error`) en las cinco pantallas en lugar de extraerlo a un hook reutilizable. Es
duplicación deliberada: el Principio III prioriza legibilidad defendible sobre
elegancia, y un hook genérico es exactamente el tipo de abstracción que se vuelve
difícil de explicar en una defensa oral. Se registra en `PROCESO.md` al cerrar la
primera pantalla que lo use.

## Project Structure

### Documentation (this feature)

```text
specs/001-random-anime/
├── plan.md              # Este archivo
├── spec.md              # El QUÉ
├── research.md          # Fase 0: decisiones de investigación
├── data-model.md        # Fase 1: modelos, tipos y reglas de validación
├── quickstart.md        # Fase 1: cómo verificar la feature de punta a punta
├── contracts/
│   └── servicios.md     # Fase 1: contrato de la capa de servicios
├── checklists/
│   └── requirements.md  # Checklist de calidad de la spec
└── tasks.md             # Fase 2, la genera /speckit.tasks — NO este comando
```

> Nota del equipo: los archivos `spec.md`, `plan.md` y `tasks.md` se copian también a la
> raíz del repositorio al cerrar cada etapa, porque la entrega los exige ahí.

### Source Code (repository root)

```text
app/                              # rutas (expo-router)
├── _layout.tsx                   # Stack raíz
├── (tabs)/
│   ├── _layout.tsx               # Tabs: Descubrir | Catálogo | Mi Lista
│   ├── index.tsx                 # P1 Descubrir
│   ├── catalogo.tsx              # P2 Catálogo
│   └── mi-lista.tsx              # P4 Mi Lista
├── anime/
│   └── [id].tsx                  # P3 Detalle
└── mi-lista/
    └── nuevo.tsx                 # P5 Formulario

components/
├── TarjetaAnime.tsx
├── ItemLista.tsx
├── SelectorGenero.tsx
├── EstadoCargando.tsx
├── EstadoVacio.tsx
├── EstadoError.tsx
├── CampoTexto.tsx
└── Boton.tsx

services/
├── simulacion.ts                 # demorar() + flags SIMULAR_VACIO / SIMULAR_ERROR
├── animeService.ts               # listarPorGenero, obtenerPorId, sortearPorGenero
├── miListaService.ts             # listar, agregar, eliminar, existeTitulo
└── data/
    └── animes.json               # dataset semilla, generado una vez

models/
├── Anime.ts
├── ItemDeMiLista.ts
└── Genero.ts

constants/
├── colores.ts
├── tipografia.ts
├── espaciado.ts
└── generos.ts

utils/
└── validarItem.ts                # validación pura del formulario (AD-05)

scripts/
└── seed-anime.mjs                # se corre una vez, NO desde la app
```

**Structure Decision**: proyecto único de aplicación móvil, sin carpeta `backend/` ni
`api/`, porque el Principio II descarta cualquier servidor. Se adopta la convención de
`expo-router`, donde **la carpeta `app/` es la navegación**: cada archivo es una ruta y
no hay configurador de rutas separado. El resto de las carpetas son planas y por
responsabilidad (`components/`, `services/`, `models/`, `constants/`), sin agrupar por
feature, porque con 5 pantallas una estructura por feature agrega carpetas sin agregar
claridad.

**Regla de dependencias, en un solo sentido:**

```text
app/ → components/ → constants/
app/ → services/ → models/ → constants/
app/ → utils/ → models/
```

`services/` nunca importa de `app/` ni de `components/`.
`components/` nunca importa de `services/`: los datos llegan por props desde la
pantalla. Un componente que sabe cargar sus propios datos no se puede reusar y esconde
el estado de carga, que es justamente lo que la consigna pide mostrar.

## Key Architectural Decisions

### AD-01 — Datos reales servidos por una capa simulada

**Decisión:** consumir Jikan una única vez desde un script de Node, commitear el JSON
resultante, y servirlo en runtime a través de funciones `async` con latencia artificial.

**Alternativas descartadas:**

- *Consumir el servicio en vivo:* viola el requisito de la cátedra, y la demo pasaría a
  depender del wifi del instituto y de la disponibilidad de un mirror comunitario.
- *Levantar un backend propio:* mismo problema, más cinco puntos de falla el día de la
  defensa (notebook prendida, servidor corriendo, misma red, IP de LAN, firewall).
- *Inventar datos falsos:* la app se ve peor y no aporta nada pedagógicamente.

**Consecuencia:** la app funciona sin red. El día que existiera un backend, solo cambia
el cuerpo de las funciones de `services/`.

**Evidencia a favor, medida durante la Fase 0:** al consultar Jikan para verificar los
géneros, la primera llamada respondió y las siguientes devolvieron `504 Jikan failed to
connect to MyAnimeList`, tres reintentos incluidos. Es exactamente el escenario que esta
decisión evita. Ver [research.md](./research.md), R-01.

### AD-02 — Dos entidades separadas: `Anime` e `ItemDeMiLista`

El catálogo es de solo lectura; la lista personal es del usuario. Un tipo único
obligaría a campos opcionales por todos lados y a explicar por qué un anime del catálogo
tiene un "puntaje personal" vacío. Detalle en [data-model.md](./data-model.md).

### AD-03 — `Genero` como unión de literales, no `string`

`type Genero = 'isekai' | 'mecha' | 'slice-of-life' | 'spokon'`. El compilador avisa si
alguien escribe un género inexistente. Una línea que evita una clase entera de bugs.

### AD-04 — Estados manejados con tres `useState` explícitos

`datos`, `cargando`, `error`, y el render los evalúa en el orden que fija la
constitución: cargando → error → vacío → con datos. Se repite en cada pantalla en lugar
de abstraerse. Ver "Deuda consciente".

### AD-05 — Validación escrita a mano

Función pura que recibe los campos y devuelve un objeto `{ campo: mensaje }`. Se ejecuta
al intentar guardar, no en cada tecla, para poder mostrar todos los errores juntos
(FR-026). Sin Zod ni React Hook Form: "lo valida Zod" no es una respuesta que apruebe
una defensa oral.

### AD-06 — Flags de simulación de estados

`SIMULAR_VACIO` y `SIMULAR_ERROR` en `services/simulacion.ts`. Permiten verificar y
demostrar los estados vacío y de error sin modificar el dataset (FR-033). Es lo que más
rinde por línea de código en todo el proyecto.

### AD-07 — Portadas remotas con marcador de posición

**Decisión, ya tomada por el equipo y registrada en la spec:** se muestran las portadas
desde las URLs de MyAnimeList, con un marcador de posición cuando la imagen no carga.

**Consecuencia para el diseño:** `TarjetaAnime` usa el evento `onError` del componente
de imagen y una bandera local para cambiar al marcador. No hace falta precargar ni
cachear: sin red, la app entera sigue siendo usable y solo las portadas degradan
(FR-035, SC-009).

## Orden de construcción

Cada paso deja algo verificable en el teléfono y ninguno depende de algo inexistente.

1. Proyecto Expo base con navegación vacía funcionando en los dos teléfonos.
2. Constantes de diseño y componentes de estado (cargando, vacío, error).
3. Script de seed y `animes.json` en el repositorio.
4. Capa de servicios del catálogo, con simulación.
5. Pantalla Descubrir (US1).
6. Pantalla Detalle (US2, primera mitad).
7. Pantalla Catálogo (US4).
8. Servicio de Mi Lista sobre AsyncStorage.
9. Pantalla Mi Lista, con alta desde el detalle y baja con confirmación (US2, US5).
10. Formulario con validación (US3).
11. Pulido, checklist de regresión, README.

El orden **no** sigue las prioridades P1–P5 de la spec al pie de la letra: Detalle y
Catálogo se adelantan porque el formulario necesita que Mi Lista exista, y Mi Lista
necesita que haya algo que agregar. Las prioridades de la spec dicen qué se recorta si
falta tiempo; este orden dice qué se construye antes para que cada paso sea verificable.

## Complexity Tracking

> Se completa solo si el Constitution Check tiene violaciones que justificar.

Sin violaciones. Ninguna desviación de la constitución que justificar.

## Notas de complejidad por elemento

Esto no son violaciones, es dónde se va a ir el tiempo.

| Elemento | Complejidad | Nota |
|---|---|---|
| Sorteo sin repetir el anterior | Baja | FR-005. Se resuelve con un parámetro `excluirId` en `sortearPorGenero`. |
| Detección de duplicados en Mi Lista | Baja | FR-027. Comparación de títulos normalizados: minúsculas y sin espacios en los extremos. |
| Persistencia con AsyncStorage | Media | Serialización JSON y manejo del caso "clave inexistente" en el primer arranque, que devuelve `null` y no un array vacío. |
| IDs de género de Jikan | Media | Ver R-01 en research.md. IDs confirmados; falta confirmar en vivo el filtrado por Isekai al correr el seed. |
| Portadas remotas | Baja | Decidido en AD-07. Deja de ser riesgo abierto. |

## Riesgos abiertos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **El proyecto Expo todavía no existe** | Todo el plan es teórico hasta que exista | **Bloqueante. Es la primera tarea de `tasks.md` y no puede empezar ninguna otra antes.** |
| Filtrado por Isekai en Jikan | Un género queda vacío y se busca el bug en el código equivocado | El script imprime la cantidad de resultados por género y falla ruidosamente si alguno trae menos de 10. Ver R-01. |
| Jikan intermitente | El seed no se puede correr cuando hace falta | Reintentos con espera en el script, y el JSON ya commiteado hace que esto no afecte a la app ni a la defensa |
| Campos nulos en la respuesta de Jikan | La app rompe al renderizar | El script normaliza nulos a 0 y descarta entradas sin título o sin sinopsis. Ver R-02. |
| El agente genera imports de `@react-navigation/*` | No compila en SDK 56 | Prohibido explícitamente en la constitución y en `AGENTS.md`; se revisa a ojo en cada tarea |
| Spec Kit escribe en `specs/001-*/` y la entrega los pide en la raíz | El docente no encuentra los archivos | Copiarlos a la raíz al cerrar cada etapa y documentar la ruta en el README |
