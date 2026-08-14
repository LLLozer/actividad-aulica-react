# Quickstart: cómo verificar Random Anime

**Feature**: 001-random-anime | **Date**: 2026-08-14

Guía de verificación manual en dispositivo físico. Es la que se usa al cerrar cada
tarea (Principio IV) y la que se corre entera antes de entregar.

**No incluye código de implementación.** Los contratos están en
[contracts/servicios.md](./contracts/servicios.md) y los modelos en
[data-model.md](./data-model.md).

## Requisitos previos

- Node.js instalado en la máquina de desarrollo.
- Expo Go instalado en el teléfono, y el teléfono en la **misma red wifi** que la
  computadora.
- El proyecto ya creado y con dependencias instaladas.

## Puesta en marcha

```bash
npx expo start
```

Escanear el QR con Expo Go: cámara en iOS, la propia app en Android. La app abre en P1
Descubrir.

> Si el teléfono no encuentra el servidor, casi siempre es la red: computadora en
> ethernet y teléfono en wifi son redes distintas. `npx expo start --tunnel` lo resuelve
> a costa de ir más lento.

## Generar el dataset semilla

Se corre **una sola vez** por la vida del proyecto, no cada vez que se levanta la app.

```bash
node scripts/seed-anime.mjs
```

Qué tiene que pasar:

- Imprime la cantidad de animes obtenidos por cada uno de los cuatro géneros.
- **Falla ruidosamente si algún género trae menos de 10.** Eso es la red de seguridad del
  riesgo R-01: si Isekai vuelve vacío, se entera acá y no en el teléfono.
- Escribe `services/data/animes.json` con 40 a 60 entradas.

Después de correrlo, **leer el JSON antes de commitearlo**: que no haya títulos
repetidos, sinopsis vacías ni años en `0` de más.

## Escenarios de validación

Cada escenario referencia la User Story de [spec.md](./spec.md) que verifica. Ninguno
lleva más de dos minutos.

### V1 — Sortear una recomendación (US1)

1. Abrir la app. **Esperado**: los cuatro géneros visibles, ningún anime, un texto que
   invita a sortear.
2. Tocar "Recomendame uno" **sin elegir género**. **Esperado**: no sortea, avisa que hay
   que elegir un género primero.
3. Elegir Mecha y tocar "Recomendame uno". **Esperado**: indicador de carga visible
   entre medio segundo y un segundo, después una tarjeta con título, año, episodios y
   puntaje.
4. Verificar que el anime sorteado **es** de Mecha (comparar contra el catálogo).
5. Tocar "Otro" cinco veces seguidas. **Esperado**: cada resultado es distinto del
   inmediatamente anterior.
6. Tocar la tarjeta. **Esperado**: abre el detalle de **ese** anime.

### V2 — Detalle y alta en Mi Lista (US2)

1. Abrir el detalle de cualquier anime. **Esperado**: portada, título, género, año,
   episodios, puntaje y sinopsis completa.
2. Tocar "Agregar a mi lista". **Esperado**: el botón se deshabilita durante la
   escritura y al terminar confirma.
3. Volver a entrar al mismo detalle. **Esperado**: indica que ya está en la lista y el
   botón queda deshabilitado.
4. Ir a Mi Lista. **Esperado**: el ítem aparece primero, marcado como venido del
   catálogo.

### V3 — Persistencia (US2, FR-018)

1. Con al menos un ítem en Mi Lista, **cerrar la app por completo** (no minimizar:
   sacarla de las apps recientes).
2. Volver a abrirla e ir a Mi Lista. **Esperado**: todo sigue ahí.

> Este es el escenario que más se olvida y el que un docente prueba primero.

### V4 — Formulario y validación (US3)

1. Entrar al formulario desde Mi Lista.
2. Tocar guardar con **todo vacío**. **Esperado**: aparecen los errores de título,
   género, episodios y puntaje **al mismo tiempo**, cada uno junto a su campo. No de a
   uno.
3. Título con 1 carácter → error. Con 81 caracteres → error.
4. Episodios en `0`, en `5001` y con letras → error en los tres casos.
5. Puntaje en `0`, en `11` y con letras → error en los tres casos.
6. Comentario de más de 200 caracteres → error. Comentario vacío → válido.
7. Cargar un título que **ya está** en Mi Lista → no guarda y avisa que está duplicado.
8. Completar todo bien y guardar. **Esperado**: el botón se deshabilita mientras
   escribe, vuelve a Mi Lista, y el ítem nuevo está **primero**, marcado como cargado a
   mano.

### V5 — Catálogo (US4)

1. Ir a Catálogo y elegir cada uno de los cuatro géneros.
2. **Esperado**: el listado cambia, y en cada uno los animes están ordenados por puntaje
   de mayor a menor.
3. Tocar un ítem cualquiera. **Esperado**: abre el detalle de ese anime, no de otro.

### V6 — Baja de Mi Lista (US5)

1. En Mi Lista, pedir eliminar un ítem y **cancelar**. **Esperado**: el ítem sigue ahí.
2. Pedir eliminarlo de nuevo y confirmar. **Esperado**: desaparece.
3. Cerrar y reabrir la app. **Esperado**: no volvió.
4. Eliminar todos los items. **Esperado**: aparece el estado vacío con su mensaje.

### V7 — Estados de carga, vacío y error (FR-031, FR-033)

Este escenario es el que hay que tener listo para mostrar en la defensa.

1. En `services/simulacion.ts`, poner `SIMULAR_ERROR = true` y recargar.
2. Recorrer Descubrir, Catálogo, Detalle y Mi Lista. **Esperado**: las cuatro muestran
   un mensaje de error comprensible y una forma de reintentar. Ninguna queda en blanco
   ni con un botón trabado.
3. Volver `SIMULAR_ERROR` a `false`, poner `SIMULAR_VACIO = true` y recargar.
4. Recorrer las mismas pantallas. **Esperado**: cada una muestra su estado vacío
   explicativo, no una lista en blanco.
5. **Devolver las dos banderas a `false`.** No se commitea con una en `true`.

### V8 — Sin conexión (FR-035, SC-009)

1. Poner el teléfono en modo avión con la app ya cargada.
2. Recorrer Descubrir, Catálogo, Detalle y Mi Lista. **Esperado**: todo funciona; solo
   las portadas se ven como marcador de posición.

> Con Expo Go hace falta que la app ya esté cargada: el modo avión también corta la
> conexión con el servidor de desarrollo. Lo que se está verificando es que los **datos**
> no dependen de la red, y eso se cumple.

## Checklist de regresión antes de entregar

- [ ] V1 a V8 pasan en los **dos** teléfonos.
- [ ] `SIMULAR_VACIO` y `SIMULAR_ERROR` están en `false` en el commit final.
- [ ] No hay ningún `import ... from '@react-navigation/...'` en el proyecto.
- [ ] Ninguna pantalla importa `animes.json`: todas pasan por `services/`.
- [ ] No hay librerías fuera de la lista permitida en `package.json`.
- [ ] `PROCESO.md` tiene una entrada por cada tarea, con su commit.
- [ ] Los dos integrantes pueden explicar cualquier archivo del proyecto.
