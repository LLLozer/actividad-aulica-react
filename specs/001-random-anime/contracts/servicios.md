# Contrato de la capa de servicios

**Feature**: 001-random-anime | **Date**: 2026-08-14

Este es **el** contrato del proyecto. La app no expone ningún servicio remoto ni
consume ninguno, así que la única frontera real es la que separa las pantallas de los
datos. Toda pantalla habla con los datos exclusivamente por acá (FR-029).

**Regla que le da sentido a todo esto**: estas funciones tienen la forma que tendría un
cliente HTTP real. Son `async`, demoran y pueden fallar. El día que existiera un
backend, solo cambia el cuerpo de estas funciones y ninguna pantalla se toca. Esto hay
que poder explicarlo en la defensa: es la razón arquitectónica de que exista
`services/`.

## `services/simulacion.ts`

Infraestructura compartida por los dos servicios.

```ts
export const SIMULAR_VACIO: boolean;
export const SIMULAR_ERROR: boolean;
export function demorar(): Promise<void>;
```

| Elemento | Comportamiento |
|---|---|
| `demorar()` | Espera entre 500 y 1000 ms, sorteados en cada llamada. Toda función de servicio la espera antes de devolver o de lanzar (FR-030). |
| `SIMULAR_ERROR` | En `false` por defecto. En `true`, toda función de lectura y escritura lanza `Error('Error simulado del servicio')` después de la demora. |
| `SIMULAR_VACIO` | En `false` por defecto. En `true`, las funciones que devuelven listas devuelven `[]`, y `sortearPorGenero` devuelve `null`. |

Las dos banderas se cambian a mano en el archivo y se recarga la app. No hay interfaz
para modificarlas (R-04).

## `services/animeService.ts`

Catálogo. Solo lectura. Lee de `services/data/animes.json`, que **ninguna pantalla
importa directamente**.

```ts
export function listarPorGenero(genero: Genero): Promise<Anime[]>;
export function obtenerPorId(id: number): Promise<Anime | null>;
export function sortearPorGenero(genero: Genero, excluirId?: number): Promise<Anime | null>;
```

### `listarPorGenero(genero)`

| | |
|---|---|
| **Devuelve** | Todos los animes de ese género, **ordenados por puntaje de mayor a menor** (FR-007). |
| **Lista vacía** | Es un resultado válido, no un error. La pantalla muestra el estado vacío (FR-008). |
| **Falla** | Lanza si `SIMULAR_ERROR`. La pantalla muestra el estado de error con reintento. |
| **Usado por** | P2 Catálogo. |

### `obtenerPorId(id)`

| | |
|---|---|
| **Devuelve** | El anime con ese id, o `null` si no existe. |
| **`null` no es un error** | Es el caso "anime no encontrado" (FR-011), y la pantalla lo distingue del estado de error. |
| **Falla** | Lanza si `SIMULAR_ERROR`. |
| **Usado por** | P3 Detalle. |

### `sortearPorGenero(genero, excluirId?)`

| | |
|---|---|
| **Devuelve** | Un anime al azar del género, o `null` si el género no tiene ninguno. |
| **`excluirId`** | Si viene, se descarta ese anime de los candidatos **siempre que quede al menos uno**. Con un único anime en el género, se devuelve el mismo (FR-005 y su caso borde). |
| **Aleatoriedad** | Azar puro. Sin historial, sin ponderar por puntaje, sin preferencias (FR-004). |
| **Falla** | Lanza si `SIMULAR_ERROR`. |
| **Usado por** | P1 Descubrir. |

## `services/miListaService.ts`

Lista personal. Lee y escribe. Persiste en el dispositivo bajo la clave
`@random_anime:mi_lista` (R-05).

```ts
export function listar(): Promise<ItemDeMiLista[]>;
export function agregar(nuevo: Omit<ItemDeMiLista, 'id' | 'fechaAgregado'>): Promise<ItemDeMiLista>;
export function eliminar(id: string): Promise<void>;
export function existeTitulo(titulo: string): Promise<boolean>;
```

### `listar()`

| | |
|---|---|
| **Devuelve** | Todos los items, **del más reciente al más antiguo** por `fechaAgregado` (FR-014). |
| **Primer arranque** | La clave no existe y el almacenamiento devuelve `null`. El servicio traduce eso a `[]`. Ninguna pantalla debe ver un `null` (R-05). |
| **Usado por** | P4 Mi Lista, y P3 Detalle para saber si el anime ya está guardado. |

### `agregar(nuevo)`

| | |
|---|---|
| **Recibe** | El ítem sin `id` ni `fechaAgregado`: esos dos los genera el servicio, no la pantalla. |
| **Devuelve** | El ítem completo, ya guardado. |
| **Rechaza** | Lanza `Error('Ya existe un título igual en tu lista')` si el título ya está, comparado en minúsculas y sin espacios en los extremos (FR-027). La validación de duplicados vive acá, no solo en el formulario: el detalle también da de alta. |
| **Usado por** | P3 Detalle (`origen: 'catalogo'`) y P5 Formulario (`origen: 'manual'`). |

### `eliminar(id)`

| | |
|---|---|
| **Efecto** | Saca el ítem de la lista y reescribe el almacenamiento. |
| **Id inexistente** | No es un error: la lista queda igual. Borrar dos veces lo mismo no debe romper nada. |
| **Usado por** | P4 Mi Lista, después de la confirmación (FR-017). |

### `existeTitulo(titulo)`

| | |
|---|---|
| **Devuelve** | `true` si ya hay un ítem con ese título, con la misma comparación normalizada que `agregar`. |
| **Para qué** | Que el formulario y el detalle puedan avisar **antes** de intentar guardar, en lugar de mostrar una excepción. `agregar` igual valida por su cuenta: esta función es para la interfaz, no es la defensa del dato. |

## Reglas transversales del contrato

1. **Todas** las funciones son `async` y esperan `demorar()` antes de resolver.
2. Ninguna función recibe ni devuelve componentes, elementos de interfaz ni estilos.
   Datos puros de un lado y del otro.
3. Los errores se lanzan como excepciones y la pantalla los captura con `try/catch`.
   Ninguna función devuelve `{ ok: false, error }`: dos mecanismos de error conviviendo
   es exactamente el tipo de cosa que no se puede defender en dos minutos.
4. La distinción entre **"no hay nada"** (lista vacía, `null`) y **"algo falló"**
   (excepción) es deliberada, y es lo que permite que las pantallas tengan estado vacío
   y estado de error separados, como exige FR-031.
5. `services/` no importa nada de `app/` ni de `components/`.

## Trazabilidad

| Función | Requisitos |
|---|---|
| `demorar` | FR-030 |
| `SIMULAR_VACIO`, `SIMULAR_ERROR` | FR-033 |
| `listarPorGenero` | FR-007, FR-008 |
| `obtenerPorId` | FR-010, FR-011 |
| `sortearPorGenero` | FR-004, FR-005 |
| `listar` | FR-014, FR-016, FR-018 |
| `agregar` | FR-012, FR-013, FR-027, FR-028 |
| `eliminar` | FR-017 |
| `existeTitulo` | FR-013, FR-027 |
