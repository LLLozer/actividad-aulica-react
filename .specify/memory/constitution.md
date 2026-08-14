<!--
SYNC IMPACT REPORT
Version change: (plantilla sin versionar) → 1.0.0
Motivo del bump: ratificación inicial. Se reemplazan todos los placeholders del
scaffold por principios concretos del proyecto.

Principios definidos (antes → después):
- [PRINCIPLE_1_NAME] → I. Defendibilidad Individual (NO NEGOCIABLE)
- [PRINCIPLE_2_NAME] → II. Sin Backend: los Datos Viven en una Capa Simulada
- [PRINCIPLE_3_NAME] → III. Simplicidad Explícita
- [PRINCIPLE_4_NAME] → IV. Verificación en Dispositivo Real
- [PRINCIPLE_5_NAME] → V. Una Tarea, Un Commit, Un Registro

Secciones agregadas:
- [SECTION_2_NAME] → Restricciones Técnicas
- [SECTION_3_NAME] → Flujo de Desarrollo y Puertas de Calidad
- [GOVERNANCE_RULES] → Governance (enmiendas, violaciones, complejidad, runtime)

Secciones eliminadas: ninguna.

Plantillas dependientes (no modificadas por este comando; leen la constitución en
runtime): .specify/templates/plan-template.md, spec-template.md, tasks-template.md,
checklist-template.md.

TODOs diferidos: ninguno.
-->

# Random Anime Constitution

Reglas del proyecto para el desarrollo del prototipo móvil de recomendaciones
aleatorias de anime. Este documento tiene autoridad sobre `spec.md`, `plan.md`,
`tasks.md` y sobre cualquier sugerencia del agente de IA.

## Core Principles

### I. Defendibilidad Individual (NO NEGOCIABLE)

Cada integrante del equipo debe poder explicar **cualquier línea** del código
entregado, por separado y sin ayuda del otro.

- Si una línea no se entiende, se le pregunta al agente hasta entenderla, o se rehace
  más simple. No se commitea código pendiente de comprensión.
- Quien **no** implementó una tarea la revisa antes del commit y debe poder explicarla.
  Si no puede, la tarea no está terminada.
- Prohibido generar la aplicación completa de una sola vez. Prohibido aceptar código
  sin leerlo.

Este principio gana contra la velocidad, contra la elegancia y contra cualquier
sugerencia de la IA. Es el criterio eliminatorio de la evaluación.

### II. Sin Backend: los Datos Viven en una Capa Simulada

La aplicación **no consulta ninguna API en tiempo de ejecución** y **no depende de
ningún servidor**.

- Los datos reales de anime se obtienen **una única vez** mediante el script
  `scripts/seed-anime.mjs`, que consume la API pública de Jikan
  (`https://api.jikan.moe/v4`) desde una máquina del equipo y genera
  `services/data/animes.json`. Ese JSON se commitea al repositorio.
- En runtime, toda lectura y escritura de datos pasa por funciones `async` de
  `services/`, con latencia artificial de 500 a 1000 ms mediante
  `new Promise(resolve => setTimeout(resolve, ms))`.
- **Ninguna pantalla importa el JSON directamente.** Si lo hace, la capa simulada
  pierde sentido y el principio queda violado.
- Las funciones de `services/` tienen la forma que tendría un cliente HTTP real: son
  asíncronas, demoran y pueden fallar. El día que existiera un backend, solo cambia
  el cuerpo de esas funciones; ninguna pantalla se toca.

**Justificación:** el requisito de la cátedra es explícito, y un servidor propio
introduce dependencias de red, IP y firewall el día de la demostración en dispositivo
real.

### III. Simplicidad Explícita

Se prefiere siempre la solución que se pueda explicar en treinta segundos.

**Permitido:**

- `StyleSheet.create` de React Native para todos los estilos.
- `useState`, `useEffect`, `useMemo` para el estado y los efectos.
- `expo-router` para la navegación.
- `@react-native-async-storage/async-storage` para la persistencia local.
- `@expo/vector-icons` para iconografía.

**Prohibido sin aprobación explícita del equipo, documentada en `PROCESO.md`:**

- Librerías de manejo de estado global (Redux, Zustand, Jotai, Context complejo).
- Librerías de formularios (Formik, React Hook Form, Yup, Zod).
- Librerías de estilos (styled-components, NativeWind, Tailwind).
- Librerías de gráficos o animación (Reanimated, Victory, Chart Kit).
- Patrones que oscurezcan la lectura: HOCs, render props, hooks genéricos abstractos,
  factories, inyección de dependencias.

**Regla de decisión:** ante dos soluciones, gana la que tiene menos capas, aunque
repita algo de código. La duplicación es más fácil de defender que la abstracción
prematura.

### IV. Verificación en Dispositivo Real

Una tarea está terminada cuando se probó en un teléfono físico con Expo Go. No en el
emulador, no "se ve bien en el código".

- Cada tarea de `tasks.md` define, antes de implementarse, **cómo se verifica**: qué
  hay que tocar en la app y qué tiene que pasar.
- La verificación es manual y debe poder hacerla cualquiera de los dos en menos de
  dos minutos.
- Toda pantalla que lea datos debe poder mostrarse en sus tres estados sin modificar
  el dataset: los servicios exponen constantes de simulación
  (`SIMULAR_VACIO`, `SIMULAR_ERROR`) que permiten forzar el estado vacío y el estado
  de error para verificarlos y para mostrarlos en la defensa.
- No se escriben tests automatizados. Está fuera de alcance del prototipo.

### V. Una Tarea, Un Commit, Un Registro

El desarrollo avanza de a una tarea por vez, en el orden de `tasks.md`.

- No se programa nada que no esté en una tarea. Si hace falta algo nuevo: primero
  entra a `spec.md`, después a `tasks.md`, después se programa.
- Un commit por tarea, con formato `feat: TXX - descripción`.
- Al cerrar cada tarea se escribe su entrada en `PROCESO.md`: prompt utilizado, qué
  generó la IA, qué se corrigió a mano, cómo se verificó en el teléfono.
- `PROCESO.md` se escribe **en el momento**, junto con el commit. Un documento escrito
  al final es incoherente con el historial de Git y se nota.
- Las tareas se alternan entre los dos integrantes. Ambos commitean desde su propia
  cuenta.

## Restricciones Técnicas

### Stack fijo

| Elemento | Decisión |
|---|---|
| Framework | React Native con Expo SDK 56 |
| Navegación | `expo-router` (basada en archivos, dentro de `/app`) |
| Lenguaje | TypeScript |
| Estilos | `StyleSheet.create` |
| Backend | Ninguno |
| Datos | JSON semilla + servicios `async` con latencia simulada |
| Persistencia | AsyncStorage, solo para "Mi Lista" |
| Ejecución | Expo Go sobre teléfono físico |

**Advertencia obligatoria para el agente:** desde Expo SDK 56, `expo-router` no acepta
imports desde paquetes `@react-navigation/*` en el código de la aplicación. Todo import
de navegación sale de `expo-router`. Cualquier `import ... from '@react-navigation/...'`
es un error y debe corregirse.

### Idioma

- Nombres de variables, funciones, componentes y archivos: **español**, salvo términos
  técnicos consolidados (`useState`, `loading`, `props`, `id`).
- Comentarios: **español**, con fin pedagógico — explican el *por qué*, no el *qué*.
- Textos visibles en la app: **español**.

### Convenciones de código

- Componentes en `PascalCase`, archivos de componentes con el mismo nombre.
- Archivos de rutas en `kebab-case`, según lo que exige `expo-router`.
- Un componente por archivo.
- Toda pantalla que consuma datos maneja explícitamente y en este orden:
  1. **Cargando** — `ActivityIndicator` visible, sin contenido parcial.
  2. **Error** — mensaje comprensible y forma de reintentar.
  3. **Vacío** — mensaje que explica por qué está vacío y qué hacer.
  4. **Con datos** — el contenido.
- Los estados se manejan con `useState` explícitos, no con banderas derivadas confusas.

### Diseño visual

El diseño es deliberadamente austero. Prioridad: legibilidad y velocidad de
implementación.

- Paleta de cinco colores, definida en `constants/colores.ts`: fondo, superficie,
  texto principal, texto secundario, acento. Un color adicional para error.
- Tres tamaños de tipografía: título (24), subtítulo (18), cuerpo (14).
- Espaciado en múltiplos de 8.
- Bordes redondeados en un solo valor (12), aplicado a tarjetas y botones.
- Sin tema oscuro, sin animaciones, sin transiciones personalizadas.

**Motivo:** el diseño no se evalúa. El código que lo produce sí, y hay que poder
explicarlo.

## Flujo de Desarrollo y Puertas de Calidad

### Orden de los artefactos

```
constitution.md  →  spec.md  →  plan.md  →  tasks.md  →  código
```

Ningún artefacto se genera sin que el anterior esté aprobado por el equipo. La spec
final requiere además aprobación docente antes de escribir código.

### Ciclo por tarea

1. Leer la tarea en `tasks.md` y su criterio de verificación.
2. Pedirle al agente **solo esa tarea**, con el contexto de `spec.md` y `plan.md`.
3. Leer todo el código generado antes de aceptarlo.
4. Revisión cruzada: lo revisa quien no lo implementó.
5. Probar en el teléfono con Expo Go.
6. Commit `feat: TXX - descripción`.
7. Entrada en `PROCESO.md`.

### Puertas de calidad — ninguna tarea se cierra sin esto

- [ ] Los dos integrantes entienden el código.
- [ ] No hay imports de `@react-navigation/*`.
- [ ] No se agregaron librerías fuera de la lista permitida.
- [ ] Ninguna pantalla accede a los datos sin pasar por `services/`.
- [ ] Los estados de carga, vacío y error se verificaron en el teléfono.
- [ ] Existe la entrada correspondiente en `PROCESO.md`.
- [ ] El commit referencia el ID de la tarea.

### Formato de entrega del agente

Al resolver una tarea, el agente debe responder con:

1. Los archivos creados o modificados, completos.
2. Explicación conceptual de lo implementado, orientada a que el alumno pueda
   defenderlo oralmente.
3. Cómo verificarlo en el teléfono con Expo Go, paso a paso.
4. Mensaje de commit sugerido, formato `feat: TXX - descripción`.
5. Bloque listo para pegar en `PROCESO.md`.

## Governance

Esta constitución tiene precedencia sobre cualquier otra práctica, sobre las
sugerencias del agente de IA y sobre la conveniencia del momento.

- **Enmiendas:** requieren acuerdo de los dos integrantes, quedan registradas en
  `PROCESO.md` con su justificación, e incrementan la versión de este documento según
  versionado semántico: MAJOR para remociones o redefiniciones incompatibles de
  principios, MINOR para principios o secciones nuevas, PATCH para aclaraciones y
  correcciones de redacción.
- **Violaciones:** si una tarea no puede resolverse sin violar un principio, se detiene
  la tarea y se enmienda la constitución o se recorta el alcance. No se viola en
  silencio.
- **Complejidad:** toda desviación del Principio III debe justificarse por escrito
  antes de implementarse, no después.
- **Revisión de cumplimiento:** las puertas de calidad de la sección anterior se
  verifican al cerrar cada tarea, antes del commit, por quien no la implementó.
- **Guía en runtime:** el agente usa `AGENTS.md` para las convenciones operativas.
  Ante conflicto entre `AGENTS.md` y esta constitución, manda la constitución.

**Version**: 1.0.0 | **Ratified**: 2026-08-14 | **Last Amended**: 2026-08-14
