# Data Model: Random Anime (Fase 1)

**Feature**: 001-random-anime | **Date**: 2026-08-14

Modelos, tipos y reglas de validación. Deriva de las Key Entities y de los requisitos
FR-020 a FR-027 de [spec.md](./spec.md).

## Género

```ts
// models/Genero.ts
export type Genero = 'isekai' | 'mecha' | 'slice-of-life' | 'spokon';
```

Unión de literales, no `string` (AD-03). Si alguien escribe `'isekay'`, el error aparece
al compilar y no como una lista vacía en el teléfono.

El nombre visible y el orden de los géneros viven en `constants/generos.ts`, junto con
el `mal_id` que usa el script de seed:

| `Genero` | Nombre visible | `mal_id` (solo script) |
|---|---|---|
| `isekai` | Isekai | 62 |
| `mecha` | Mecha | 18 |
| `slice-of-life` | Slice of Life | 36 |
| `spokon` | Spokon | 30 (Sports en MAL) |

## Anime

Título del catálogo. **Solo lectura**: la app nunca lo crea, edita ni elimina.

```ts
// models/Anime.ts
export interface Anime {
  id: number;
  titulo: string;
  genero: Genero;
  anio: number;
  episodios: number;
  sinopsis: string;
  puntaje: number;
  imagenUrl: string;
}
```

| Campo | Tipo | Origen y notas |
|---|---|---|
| `id` | `number` | `mal_id` de Jikan. Único en todo el catálogo, no solo dentro del género. Es el parámetro de la ruta de detalle. |
| `titulo` | `string` | Nunca vacío: el script descarta las entradas sin título. |
| `genero` | `Genero` | Asignado por el género **consultado**, no leído de la respuesta (R-02). Uno solo por anime. |
| `anio` | `number` | `0` si Jikan lo devolvió nulo. La pantalla muestra "año desconocido" cuando es `0`. |
| `episodios` | `number` | `0` si vino nulo. Se muestra "sin dato" cuando es `0`. |
| `sinopsis` | `string` | Nunca vacía: el script descarta las entradas sin sinopsis. |
| `puntaje` | `number` | Puntaje de la comunidad, escala 0 a 10 con un decimal. `0` si vino nulo. Es el criterio de orden del catálogo (FR-007). |
| `imagenUrl` | `string` | URL remota de MyAnimeList. Puede fallar la carga: se degrada a marcador de posición (AD-07, FR-034). |

**Ciclo de vida**: ninguno. Se genera una vez con el script de seed y se lee siempre
igual.

## ItemDeMiLista

Anotación personal del usuario. Se crea y se elimina, **no se edita** (fuera de alcance).

```ts
// models/ItemDeMiLista.ts
export interface ItemDeMiLista {
  id: string;
  titulo: string;
  genero: Genero;
  episodios: number;
  puntajePersonal: number;
  comentario: string;
  fechaAgregado: string;
  origen: 'catalogo' | 'manual';
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `string` | Generado en el alta con `Date.now().toString()`. Es `string` y no `number` a propósito: así nunca se confunde con el `id` de un `Anime`. |
| `titulo` | `string` | 2 a 80 caracteres. Es la clave de duplicados (FR-027). |
| `genero` | `Genero` | Obligatorio. |
| `episodios` | `number` | Entero de 1 a 5000. |
| `puntajePersonal` | `number` | Entero de 1 a 10. **No** es el puntaje de la comunidad y no se compara con él. |
| `comentario` | `string` | Opcional: cadena vacía si no se completó. Máximo 200 caracteres. |
| `fechaAgregado` | `string` | ISO 8601, del reloj del dispositivo. Es el criterio de orden de Mi Lista, del más reciente al más antiguo (FR-014). |
| `origen` | `'catalogo' \| 'manual'` | Se muestra en la lista (FR-015). Lo fija el servicio, no el usuario. |

### Cómo se completa cada campo según el origen

| Campo | Alta desde el catálogo (P3) | Alta manual (P5) |
|---|---|---|
| `titulo`, `genero`, `episodios` | Copiados del `Anime` | Los escribe el usuario |
| `puntajePersonal` | El puntaje de la comunidad, redondeado | Lo escribe el usuario |
| `comentario` | Cadena vacía | Opcional |
| `origen` | `'catalogo'` | `'manual'` |

> **Por qué se copian los datos y no se guarda solo el `id` del anime**: porque la lista
> tiene que poder contener animes que no están en el catálogo (US3). Guardar una
> referencia obligaría a dos formas distintas de ítem y a resolver cuál es cuál en cada
> render. Copiar es duplicación de datos, y es la opción que el Principio III prefiere.

**Ciclo de vida**: `alta → (existe en la lista) → baja`. No hay estados intermedios ni
edición.

## Reglas de validación del formulario (P5)

Función pura en `utils/validarItem.ts`, ejecutada al intentar guardar y no en cada tecla
(AD-05). Devuelve un objeto con un mensaje por campo inválido; si el objeto está vacío,
el alta procede. Vive en su propio archivo y no dentro de la pantalla para poder
probarla sin abrir el formulario, y porque una función pura sin `useState` alrededor es
más fácil de defender.

```ts
type ErroresFormulario = {
  titulo?: string;
  genero?: string;
  episodios?: string;
  puntajePersonal?: string;
  comentario?: string;
};
```

| Campo | Regla | Requisito | Mensaje |
|---|---|---|---|
| `titulo` | No vacío tras recortar espacios | FR-021 | "El título es obligatorio" |
| `titulo` | Entre 2 y 80 caracteres | FR-021 | "El título debe tener entre 2 y 80 caracteres" |
| `titulo` | No duplicado en Mi Lista | FR-027 | "Ya tenés ese título en tu lista" |
| `genero` | Seleccionado | FR-022 | "Elegí un género" |
| `episodios` | Numérico entero | FR-023 | "Los episodios tienen que ser un número" |
| `episodios` | Entre 1 y 5000 | FR-023 | "Los episodios tienen que estar entre 1 y 5000" |
| `puntajePersonal` | Numérico | FR-024 | "El puntaje tiene que ser un número" |
| `puntajePersonal` | Entre 1 y 10 | FR-024 | "El puntaje tiene que estar entre 1 y 10" |
| `comentario` | Vacío, o hasta 200 caracteres | FR-025 | "El comentario no puede superar los 200 caracteres" |

**Todas las reglas se evalúan siempre**, aunque una ya haya fallado: FR-026 exige
mostrar todos los errores juntos. Una validación que corta en el primer error incumple
el requisito.

**Comparación de títulos duplicados**: se comparan en minúsculas y sin espacios en los
extremos. `"  Steins;Gate "` y `"steins;gate"` son el mismo título. No se normalizan
acentos ni signos: es alcance que nadie pidió y complica la explicación.

## Forma del dataset semilla

`services/data/animes.json` es un array plano de `Anime`, no un objeto agrupado por
género:

```json
[
  {
    "id": 9253,
    "titulo": "Steins;Gate",
    "genero": "isekai",
    "anio": 2011,
    "episodios": 24,
    "sinopsis": "...",
    "puntaje": 9.07,
    "imagenUrl": "https://cdn.myanimelist.net/images/anime/..."
  }
]
```

**Por qué plano**: filtrar por género es una línea (`animes.filter(a => a.genero === g)`)
y buscar por id es otra. Un objeto agrupado obligaría a recorrer las cuatro claves para
buscar por id, que es justo lo que hace la pantalla de detalle.

**Volumen esperado**: 10 a 15 entradas por género, 40 a 60 en total.

## Trazabilidad

| Entidad / regla | Requisitos que cubre |
|---|---|
| `Genero` | FR-001 |
| `Anime` | FR-004, FR-007, FR-010, FR-034 |
| `ItemDeMiLista` | FR-012, FR-014, FR-015, FR-018, FR-020 |
| Reglas de validación | FR-021 a FR-027 |
| Dataset plano | FR-029, R-02 |
