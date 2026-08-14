# CONTEXTO.md — Proyecto y forma de trabajo

> Documento de contexto del equipo. Explica **qué** construimos y **cómo** trabajamos.
> No reemplaza a `spec.md` (el qué en detalle) ni a `AGENTS.md` (las reglas que lee el agente).
> Orden de lectura para alguien que se suma: este archivo → `spec.md` → `plan.md` → `tasks.md`.

---

## 1. Qué es la app

**Nombre de trabajo:** Random Anime (definir nombre final).

Aplicación móvil que **recomienda un anime al azar** dentro de cuatro géneros, para
resolver el problema de "no sé qué mirar": el usuario elige un género, la app le
propone un título, y puede seguir tirando hasta que algo le convenza.

**Los cuatro géneros del catálogo:**

| Género | Escritura correcta | Qué es |
|---|---|---|
| Isekai | *Isekai* (no "Issekai") | El protagonista es transportado a otro mundo |
| Mecha | *Mecha* | Robots gigantes pilotados |
| Slice of Life | *Slice of Life* | Cotidiano, sin conflicto épico |
| Spokon | *Spokon* (スポ根), o "deportivo" | Superación a través del deporte |

> Nota: escribir mal los nombres de los géneros en una app **de** anime es lo primero
> que va a notar cualquiera que la mire. Corregido acá para que no se propague al código.

**Qué NO es:** no es un catálogo completo, ni un tracker de episodios vistos, ni una
red social. Ver la sección "Fuera de alcance" de `spec.md`.

---

## 2. Decisión clave: de dónde salen los datos

**Regla de la cátedra:** *"Sin backend real: los datos vienen de mocks (funciones que
simulan un servicio, con latencia artificial)."*

**Nuestra decisión:** usamos datos **reales** de anime, servidos por una **capa mock**.

### Cómo

1. **Una sola vez**, desde una máquina del equipo, consultamos la API pública de
   MyAnimeList (Jikan, `https://api.jikan.moe/v4`) para bajar entre 10 y 15 animes
   por género.
2. Guardamos el resultado, ya recortado a los campos que usamos, en
   `services/data/animes.json` y lo commiteamos al repositorio.
3. La app **nunca** consulta la API en tiempo de ejecución. Lee de ese JSON a través
   de funciones asíncronas con latencia simulada.

### Por qué así, y no consumiendo la API en vivo

| Motivo | Detalle |
|---|---|
| Cumple la consigna | El requisito de mocks es explícito y no negociable. |
| La demo no depende de la red | El día de la defensa no hay wifi que falle ni API caída. |
| Jikan es solo lectura | No permite escribir. El formulario de alta no tendría dónde guardar. |
| Jikan es no oficial | Es un mirror comunitario con límite de 60 requests/minuto. |
| Es lo que se hace de verdad | Fijar un dataset para desarrollo es práctica normal en la industria. |

### El contrato que hace que esto valga la pena

Todas las funciones de `services/` tienen la firma que tendría un cliente HTTP real:
son `async`, pueden fallar, y demoran. El día que quisiéramos consumir Jikan en vivo,
**solo se cambia el cuerpo de esas funciones**. Ninguna pantalla se toca.

Esto hay que poder explicarlo en la defensa. Es la razón arquitectónica de que exista
la carpeta `services/`.

---

## 3. Cómo cubrimos cada requisito mínimo

Tabla de trazabilidad. Sirve para verificar antes de entregar que no falta nada.

| Requisito de la consigna | Dónde se cumple |
|---|---|
| Al menos 4 pantallas con `expo-router` | Descubrir, Catálogo, Detalle, Mi Lista, Formulario (5) |
| Listado desde mocks + pantalla de detalle | Catálogo por género → Detalle del anime |
| Formulario de alta o edición con validación | Alta en "Mi Lista" |
| Sin backend real, datos mock | `services/` con JSON semilla + latencia |
| Manejo de estados de carga y vacío | Obligatorio en toda pantalla que lea datos |
| Corre en teléfono real con Expo Go | Se verifica al cerrar **cada** tarea |
| Persistencia con AsyncStorage (opcional) | "Mi Lista" sobrevive al cierre de la app |

### Las pantallas

**P1 — Descubrir (principal).** Selector de los 4 géneros. Botón "Recomendame uno".
Muestra la tarjeta del anime sorteado. Botón "Otro" para volver a sortear.
*Estados: inicial (sin sorteo), cargando, con resultado, error.*

**P2 — Catálogo.** Listado de todos los animes de un género, con su tarjeta.
Cada ítem navega al detalle.
*Estados: cargando, vacío, con datos, error.*

**P3 — Detalle.** Título, géneros, año, episodios, sinopsis, puntaje.
Acción "agregar a mi lista".
*Estados: cargando, no encontrado, con datos.*

**P4 — Mi Lista.** Los animes que el usuario guardó, propios o del catálogo.
*Estados: cargando, vacío, con datos.*

**P5 — Alta en Mi Lista (formulario).** Título, género, cantidad de episodios,
puntaje personal, comentario. **Acá vive toda la validación.**

> **Por qué el formulario es "Mi Lista" y no "agregar anime al catálogo":** un
> recomendador aleatorio no tiene una razón creíble para que el usuario cargue animes
> al catálogo global. "Mi lista de pendientes" sí. La consigna exige un formulario con
> validación; esta es la forma de tenerlo sin que se sienta pegado con cinta.

---

## 4. Modelo de datos

**Anime** (viene del catálogo, es de solo lectura)
- `id`, `titulo`, `generos[]`, `anio`, `episodios`, `sinopsis`, `puntaje`, `imagenUrl`

**ItemDeMiLista** (lo crea el usuario)
- `id`, `titulo`, `genero`, `episodios`, `puntajePersonal`, `comentario`, `fechaAgregado`

Los dos son estructuras distintas a propósito: el catálogo no se modifica nunca, la
lista personal sí. Mezclarlos en un solo tipo genera confusión en el código y preguntas
incómodas en la defensa.

---

## 5. Estructura del proyecto

```
/app                    -> pantallas (expo-router: la carpeta ES la navegación)
  /(tabs)
    index.tsx           -> P1 Descubrir
    catalogo.tsx        -> P2 Catálogo
    mi-lista.tsx        -> P4 Mi Lista
  /anime/[id].tsx       -> P3 Detalle
  /mi-lista/nuevo.tsx   -> P5 Formulario
  _layout.tsx

/components             -> componentes reutilizables (AnimeCard, EmptyState, Loading...)
/services               -> capa de datos simulada
  animeService.ts       -> funciones async con latencia
  miListaService.ts     -> alta y lectura de la lista personal
  /data/animes.json     -> dataset semilla bajado de Jikan
/constants              -> géneros, colores, textos
/models                 -> tipos e interfaces
```

**Regla dura:** ninguna pantalla importa `animes.json` directamente. Siempre pasa por
`services/`. Si una pantalla importa el JSON, la capa mock deja de tener sentido.

---

## 6. Cómo desarrollamos

### 6.1 El flujo, de arriba hacia abajo

```
constitution.md   -> reglas del proyecto (stack, idioma, convenciones)
      ↓
spec.md           -> QUÉ construimos (historias, pantallas, criterios de aceptación)
      ↓
plan.md           -> CÓMO (carpetas, modelos, arquitectura de mocks)
      ↓
tasks.md          -> tareas atómicas T01, T02, T03...
      ↓
código            -> una tarea por vez
```

Nada se saltea. Si algo no está en una tarea, no se programa. Si hace falta algo que
no está en la spec, **primero se agrega a la spec**, después a las tareas, después se
programa.

### 6.2 El ciclo de cada tarea

1. **Leer la tarea** en `tasks.md`. Entender el criterio de verificación antes de pedir nada.
2. **Pedirle al agente** solo esa tarea, dándole el contexto de `spec.md` y `plan.md`.
3. **Leer todo el código generado.** Si hay una línea que no entendemos, se le pregunta
   al agente hasta entenderla, o se rehace.
4. **Probar en el teléfono** con Expo Go. No en el emulador. No "se ve bien en el código".
5. **Commit** con el formato `feat: T07 - pantalla de detalle`.
6. **Escribir en `PROCESO.md`**, en el momento: prompt usado, qué generó la IA, qué
   corregimos a mano, cómo lo verificamos.

El paso 6 es el que todos postergan y el que vale 15% de la nota. Se hace ahora, no
la noche anterior.

### 6.3 Las reglas que no se negocian

1. **Código que no podemos explicar no se commitea.** La defensa es individual y
   eliminatoria. No importa si funciona.
2. **Una tarea por vez, un commit por tarea.**
3. **Toda tarea se prueba en el teléfono** antes de darse por terminada.
4. **Los dos integrantes commitean.** El historial de Git es evidencia evaluada.
5. **La spec manda.** Si la IA propone algo que no está en la spec, se rechaza.
6. **Sin librerías que no podamos explicar.** Estilos con `StyleSheet.create`,
   estado con `useState`/`useEffect`. Nada de librerías de formularios, de estado
   global ni de gráficos.

### 6.4 División del trabajo entre los dos

El riesgo real de trabajar de a dos con IA es que uno maneje el agente y el otro mire.
En la defensa individual eso se detecta en treinta segundos.

**Cómo lo evitamos:**
- Las tareas se **alternan**: si el integrante A hace T01, el integrante B hace T02.
- Quien **no** implementó la tarea es quien la **revisa** antes del commit, y tiene que
  poder explicarla. Si no la entiende, la tarea no está terminada.
- Cada uno commitea desde su propia máquina, con su propia cuenta de Git.
- Antes de empezar cualquier tarea: `git pull`. Antes de terminar el día: `git push`.

### 6.5 Convención de commits

```
feat: T04 - pantalla de catálogo por género
fix:  T04 - corregir estado vacío cuando el género no tiene animes
docs: actualizar PROCESO.md con la tarea T04
chore: bajar dataset semilla desde Jikan
```

---

## 7. Herramientas

- **Agente:** Claude Code.
- **Metodología:** GitHub Spec Kit (`specify`), integración `claude`.
- **Contexto del agente:** `AGENTS.md` en la raíz.
- **Stack:** Expo SDK 56, expo-router, React Native 0.85.
- **Persistencia:** `@react-native-async-storage/async-storage` para "Mi Lista".

### Advertencia técnica que nos va a morder

Desde Expo SDK 56, `expo-router` **dejó de aceptar imports de `@react-navigation/*`**
en el código de aplicación. Cualquier agente de IA entrenado con material anterior va a
generar esos imports igual. Si aparece un `import { useNavigation } from
'@react-navigation/native'`, está mal: se usan los entry points de `expo-router`.

Esto está anotado en `AGENTS.md` para que el agente lo tenga presente, pero igual hay
que revisarlo a ojo.

---

## 8. Estado actual y próximos pasos

- [ ] Aplanar la carpeta anidada del repositorio
- [ ] Reinstalar la integración de Spec Kit para Claude Code (hoy está en `copilot`)
- [ ] Eliminar `main.js` de la raíz
- [ ] Escribir `constitution.md` (hoy es la plantilla en blanco)
- [ ] Crear el proyecto Expo con `create-expo-app` y verificarlo en los dos teléfonos
- [ ] Bajar el dataset semilla desde Jikan y commitearlo
- [ ] Escribir `spec.md` con la idea definitiva y aprobarla con los docentes
- [ ] Generar `plan.md` y `tasks.md`
- [ ] Empezar T01

---

## 9. Riesgos conocidos

| Riesgo | Mitigación |
|---|---|
| Cambiar de idea otra vez | La idea está cerrada. Cambios post-`tasks.md` no se aceptan. |
| Un integrante no entiende el código del otro | Revisión cruzada obligatoria antes de cada commit. |
| `PROCESO.md` escrito al final | Se escribe al cerrar cada tarea, junto con el commit. |
| Scope creep (búsqueda, filtros, tracking) | Todo eso está en "Fuera de alcance" de `spec.md`. |
| La IA genera código que no entendemos | Se le pregunta hasta entenderlo, o se rehace más simple. |