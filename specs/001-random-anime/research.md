# Research: Random Anime (Fase 0)

**Feature**: 001-random-anime | **Date**: 2026-08-14

Investigación previa al diseño. Cada entrada tiene decisión, fundamento y alternativas
descartadas. Todo lo marcado como NEEDS CLARIFICATION en el Technical Context quedó
resuelto acá.

## R-01 — IDs de género en Jikan, y el caso Isekai

**Pregunta**: el plan marcaba como riesgo que *Isekai* figurara en MyAnimeList como
**theme** y no como **genre**, lo que dejaría ese género vacío al correr el seed.

**Verificado en vivo el 2026-08-14** contra `GET https://api.jikan.moe/v4/genres/anime`:

| Género del proyecto | Nombre en MAL | `mal_id` | Cantidad de animes |
|---|---|---|---|
| Isekai | Isekai | **62** | 510 |
| Mecha | Mecha | **18** | 1363 |
| Slice of Life | Slice of Life | **36** | 1288 |
| Spokon | Sports | **30** | 838 |

**Decisión**: usar esos cuatro `mal_id` en el script de seed. *Spokon* se mapea a
**Sports (30)**: MyAnimeList no tiene una categoría "Spokon", y Sports es su equivalente
directo. El nombre visible en la app sigue siendo "Spokon", que es como lo definió la
spec; el `mal_id` es un detalle interno del script.

**Lo que quedó sin confirmar**: el endpoint devolvió las 78 categorías en una sola
respuesta, que incluye géneros, themes y demographics juntos. Que Isekai aparezca ahí
confirma **su ID**, pero no zanja si MAL lo clasifica como género o como theme. En la
práctica el parámetro `genres=` de `/anime` acepta ambos porque comparten espacio de
IDs, pero no se pudo verificar en vivo: las llamadas siguientes devolvieron `504 Jikan
failed to connect to MyAnimeList`, con tres reintentos.

**Mitigación, que reemplaza a la verificación previa**: el script de seed imprime la
cantidad de resultados obtenidos por género y **falla ruidosamente** si alguno devuelve
menos de 10. Así el problema aparece en la consola del script, que es donde se puede
arreglar, y no como un género vacío en la app, que es donde se busca el bug en el lugar
equivocado. Si Isekai fallara con `genres=62`, la alternativa es el mismo ID sobre el
parámetro `themes=`.

**Alternativas descartadas**: hardcodear una lista de animes elegidos a mano por el
equipo, que es más trabajo y menos representativo; o usar un género distinto a Isekai,
que cambia la spec por una razón técnica y no de producto.

## R-02 — Forma de la respuesta de Jikan y campos que pueden venir nulos

**Investigado**: la estructura de `GET /anime?genres=<id>&order_by=score&sort=desc`.
Cada entrada trae `mal_id`, `title`, `year`, `episodes`, `synopsis`, `score`,
`images.jpg.image_url`, `genres[]` y `themes[]`.

**Decisión**: el script recorta cada entrada a los ocho campos del modelo `Anime` y
normaliza antes de escribir el JSON:

- `year`, `episodes` y `score` nulos → `0`.
- Entradas sin `title` o sin `synopsis` → se descartan, no se rellenan con texto de
  relleno.
- `synopsis` se recorta si excede lo razonable para la pantalla de detalle, cortando en
  el final de una oración.
- El género del proyecto se asigna según el género **por el que se consultó**, no
  leyendo `genres[]` de la respuesta: un anime puede ser Mecha y Slice of Life a la vez,
  y la spec define un género principal único por título.

**Fundamento**: la app no puede tener lógica defensiva contra datos malos, porque los
datos son fijos y están en el repositorio. Toda la limpieza ocurre una vez, en el
script, donde se puede leer el resultado antes de commitearlo. Que un campo nulo llegue
al render es un bug que se paga en la defensa.

**Alternativas descartadas**: normalizar en la capa de servicios en cada lectura, que
esconde el problema y agrega código que hay que explicar; o no normalizar y confiar en
que Jikan siempre devuelva datos completos, que es falso.

## R-03 — Cómo se simula la latencia

**Decisión**: una única función `demorar(ms)` en `services/simulacion.ts`, construida
sobre `new Promise(resolve => setTimeout(resolve, ms))`, con el rango de 500 a 1000 ms
sorteado por llamada.

**Fundamento**: es la forma que fija el Principio II de la constitución, y es una línea
que cualquiera de los dos puede explicar. Concentrarla en un solo archivo evita que
aparezca un `setTimeout` suelto en cada servicio.

**Alternativas descartadas**: latencia fija de 800 ms, que se ve artificial y no
ejercita bien los estados de carga; latencia configurable por servicio, que es
flexibilidad que nadie va a usar.

## R-04 — Cómo se fuerzan los estados vacío y de error

**Decisión**: dos constantes booleanas exportadas desde `services/simulacion.ts`,
`SIMULAR_VACIO` y `SIMULAR_ERROR`, en `false` por defecto. Cada función de servicio las
consulta antes de devolver datos: con `SIMULAR_ERROR` lanza una excepción, con
`SIMULAR_VACIO` devuelve una lista vacía.

**Fundamento**: FR-033 exige poder forzar esos estados sin tocar el dataset. Cambiar una
constante a `true` y recargar es una operación de dos segundos que se puede hacer
delante del docente. Que sean constantes y no un menú de ajustes dentro de la app es
deliberado: el menú sería una sexta pantalla que nadie pidió.

**Alternativas descartadas**: borrar entradas del JSON para ver el estado vacío, que
ensucia el repositorio y es irreversible por descuido; una pantalla de configuración de
desarrollo, que es alcance nuevo.

## R-05 — Persistencia de Mi Lista

**Decisión**: una única clave en AsyncStorage, `@random_anime:mi_lista`, que guarda el
array completo serializado con `JSON.stringify`. Cada alta o baja lee el array, lo
modifica y lo vuelve a escribir entero.

**Fundamento**: con 40 a 60 animes de catálogo y una lista personal que en la práctica
tendrá menos de 20 items, reescribir el array completo es instantáneo y es la operación
más simple de explicar. Una clave por ítem obligaría a listar y filtrar claves, que es
más código para el mismo resultado.

**Caso que hay que manejar explícitamente**: en el primer arranque la clave no existe y
`getItem` devuelve `null`, no un array vacío. Si eso no se contempla, la app rompe al
abrir Mi Lista por primera vez, que es justo lo primero que va a hacer el evaluador.

**Alternativas descartadas**: SQLite o `expo-sqlite`, que es una dependencia nueva y una
capa entera que explicar para guardar veinte objetos; mantener la lista solo en memoria,
que incumple FR-018.

## R-06 — Navegación con expo-router en SDK 56

**Decisión**: navegación por archivos, con un `Stack` raíz en `app/_layout.tsx` y un
grupo `(tabs)` para las tres pantallas principales. Detalle y formulario quedan fuera
del grupo de tabs, como rutas apiladas encima.

**Fundamento**: Descubrir, Catálogo y Mi Lista son destinos entre los que el usuario
salta libremente, que es exactamente para lo que sirven las tabs. Detalle y formulario
son pantallas a las que se **entra y de las que se vuelve**, que es lo que hace un
stack. Además el detalle recibe un parámetro de ruta `[id]`, y eso no encaja en una tab.

**Restricción dura confirmada por la constitución**: desde SDK 56, todo import de
navegación sale de `expo-router` (`useRouter`, `useLocalSearchParams`, `Link`, `Stack`,
`Tabs`). Cualquier `import ... from '@react-navigation/...'` es un error, no una
alternativa de estilo.

**Alternativas descartadas**: stack puro sin tabs, que obliga a volver atrás para
cambiar de sección y se siente peor con tres destinos de igual jerarquía.

## R-07 — Sorteo aleatorio sin repetir el anterior

**Decisión**: `sortearPorGenero(genero, excluirId?)` filtra el catálogo por género,
descarta el `excluirId` si vino y si quedan candidatos, y elige uno con
`Math.floor(Math.random() * candidatos.length)`.

**Fundamento**: cumple FR-004 (azar puro) y FR-005 (no repetir el anterior) sin llevar
historial ni estado extra. La condición "si quedan candidatos" es la que resuelve el
caso borde del género con un solo anime, donde repetir es la única opción posible.

**Alternativas descartadas**: barajar el género entero y consumir de a uno, que deja de
ser azar puro y agrega estado que persistir entre sorteos; reintentar el sorteo hasta
que salga distinto, que en un género de un solo elemento es un bucle infinito.
