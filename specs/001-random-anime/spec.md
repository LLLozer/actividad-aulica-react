# Feature Specification: Random Anime

**Feature Branch**: `001-random-anime`

**Created**: 2026-08-14

**Status**: Draft — pendiente de aprobación docente

**Input**: User description: "Aplicación móvil que recomienda un anime al azar dentro de cuatro géneros (Isekai, Mecha, Slice of Life, Spokon), con catálogo por género, pantalla de detalle, lista personal persistente y formulario de alta con validación, sobre datos simulados sin backend."

## Resumen

Aplicación móvil que **recomienda un anime al azar** dentro de cuatro géneros, para
resolver el problema de "tengo ganas de mirar algo pero no sé qué".

El usuario elige un género, la app le propone un título, y puede seguir sorteando hasta
que algo le convenza. Si le interesa, ve el detalle y lo guarda en su lista de
pendientes. También puede cargar a mano animes que no están en el catálogo, y quitar de
su lista lo que ya no le interesa.

**Alcance:** prototipo sin backend. Los datos provienen de una capa de acceso simulada
con demora artificial. Uso individual, local al dispositivo.

## Glosario de géneros

| Género | Descripción |
|---|---|
| **Isekai** | El protagonista es transportado a otro mundo |
| **Mecha** | Robots gigantes pilotados |
| **Slice of Life** | Situaciones cotidianas, sin conflicto épico |
| **Spokon** | Superación personal a través del deporte |

Son un conjunto **fijo y cerrado**. El usuario no crea, edita ni elimina géneros.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sortear una recomendación (Priority: P1)

El usuario abre la app, elige uno de los cuatro géneros y toca "Recomendame uno". La
app le propone un anime al azar de ese género. Si no le convence, toca "Otro" y recibe
una propuesta distinta, siempre dentro del mismo género.

**Why this priority**: Es la razón de existir de la app. Sin esto no hay producto: las
demás historias son formas de profundizar o de guardar lo que el sorteo produjo. Es
también la primera pantalla que ve el evaluador.

**Independent Test**: Se puede probar sola, sin ninguna otra pantalla implementada:
elegir un género, sortear, verificar que el anime mostrado pertenece a ese género, y
sortear de nuevo verificando que cambió el título.

**Acceptance Scenarios**:

1. **Given** la app se abre por primera vez, **When** el usuario llega a la pantalla
   inicial, **Then** ve el selector de los cuatro géneros, ningún anime sorteado y un
   texto que lo invita a sortear.
2. **Given** que el usuario no eligió ningún género, **When** toca "Recomendame uno",
   **Then** no se sortea nada y se le indica que primero elija un género.
3. **Given** que el usuario eligió un género, **When** toca "Recomendame uno", **Then**
   ve un indicador de carga durante la demora simulada y luego la tarjeta de un anime
   que pertenece a ese género, con título, año, episodios y puntaje.
4. **Given** que ya hay un anime sorteado, **When** el usuario toca "Otro", **Then** se
   muestra otro anime del mismo género, distinto del que acaba de ver, salvo que el
   género tenga un único anime disponible.
5. **Given** que la lectura de datos falla, **When** el usuario intenta sortear,
   **Then** ve un mensaje de error comprensible y un botón para reintentar.

---

### User Story 2 - Ver el detalle y guardarlo en mi lista (Priority: P2)

Desde una recomendación o desde el catálogo, el usuario abre el detalle de un anime,
lee la sinopsis completa y decide si le interesa. Si le interesa, lo agrega a su lista
de pendientes y lo encuentra ahí más tarde, incluso después de cerrar la app.

**Why this priority**: Convierte la recomendación en algo que persiste. Es la historia
que justifica la persistencia local y la que cubre el requisito de "listado desde datos
simulados + pantalla de detalle".

**Independent Test**: Se puede probar abriendo el detalle de un anime, agregándolo,
yendo a Mi Lista y verificando que aparece; luego cerrando y reabriendo la app para
verificar que sigue ahí.

**Acceptance Scenarios**:

1. **Given** un anime existente, **When** el usuario abre su detalle, **Then** ve
   portada, título, género, año, cantidad de episodios, puntaje y sinopsis completa.
2. **Given** un identificador de anime que no existe, **When** se solicita su detalle,
   **Then** se muestra "anime no encontrado" y una forma de volver.
3. **Given** que el anime **no** está en Mi Lista, **When** el usuario ve el detalle,
   **Then** la acción "Agregar a mi lista" está habilitada.
4. **Given** que el anime **ya** está en Mi Lista, **When** el usuario ve el detalle,
   **Then** se le indica visualmente que ya lo guardó y la acción queda deshabilitada.
5. **Given** que el usuario toca "Agregar a mi lista", **When** se ejecuta el guardado,
   **Then** la acción se deshabilita durante la escritura simulada y al terminar se
   confirma el resultado.
6. **Given** que hay items guardados, **When** el usuario abre Mi Lista, **Then** los ve
   ordenados del más reciente al más antiguo, cada uno con título, género, puntaje
   personal y si vino del catálogo o fue cargado a mano.
7. **Given** que Mi Lista está vacía, **When** el usuario la abre, **Then** ve un
   mensaje que explica que todavía no guardó nada y le ofrece ir a Descubrir o cargar
   uno a mano.
8. **Given** que el usuario cierra la app por completo, **When** vuelve a abrirla,
   **Then** Mi Lista conserva todo su contenido.

---

### User Story 3 - Cargar un anime a mano con validación (Priority: P3)

El usuario quiere anotar en su lista un anime que no está en el catálogo. Completa un
formulario con título, género, cantidad de episodios, puntaje personal y un comentario
opcional. Si algo está mal, el formulario se lo indica campo por campo. Al guardar,
vuelve a Mi Lista y ve su ítem nuevo en primer lugar.

**Why this priority**: Es un requisito duro de la consigna (formulario de alta con
validación) y no puede recortarse. Va después de US2 porque necesita que Mi Lista
exista para tener dónde guardar.

**Independent Test**: Se puede probar entrando al formulario, intentando guardar vacío
para ver todos los errores, corrigiendo campo por campo y verificando que el ítem
aparece primero en Mi Lista.

**Acceptance Scenarios**:

1. **Given** el campo título vacío, con menos de 2 caracteres o con más de 80, **When**
   el usuario intenta guardar, **Then** no se guarda y el error se muestra junto al
   campo.
2. **Given** que no se seleccionó ningún género, **When** el usuario intenta guardar,
   **Then** no se guarda y el error se muestra.
3. **Given** una cantidad de episodios no numérica, menor a 1 o mayor a 5000, **When**
   el usuario intenta guardar, **Then** no se guarda y el error se muestra junto al
   campo.
4. **Given** un puntaje personal no numérico o fuera del rango 1 a 10, **When** el
   usuario intenta guardar, **Then** no se guarda y el error se muestra junto al campo.
5. **Given** un comentario de más de 200 caracteres, **When** el usuario intenta
   guardar, **Then** no se guarda y el error se muestra junto al campo. El comentario
   vacío es válido.
6. **Given** que más de un campo es inválido, **When** el usuario intenta guardar,
   **Then** se muestran **todos** los errores a la vez, no de a uno.
7. **Given** que ya existe en Mi Lista un ítem con el mismo título, **When** el usuario
   intenta guardar, **Then** no se guarda y se le avisa que está duplicado.
8. **Given** todos los campos válidos, **When** el usuario guarda, **Then** la acción se
   deshabilita durante la escritura simulada y al terminar vuelve a Mi Lista con el
   ítem nuevo visible en primer lugar.

---

### User Story 4 - Explorar el catálogo de un género (Priority: P4)

El usuario prefiere elegir él mismo en lugar de que el azar elija por él. Abre el
catálogo, selecciona un género y ve todos los animes disponibles de ese género. Toca
cualquiera para ver su detalle.

**Why this priority**: Es la alternativa al sorteo y la que hace que el dataset se vea
completo, pero la app entrega valor sin ella. Es la historia más prescindible si el
tiempo aprieta.

**Independent Test**: Se puede probar eligiendo cada uno de los cuatro géneros y
verificando que el listado cambia y que cada ítem abre el detalle correcto.

**Acceptance Scenarios**:

1. **Given** que el usuario elige un género en el catálogo, **When** se cargan los
   datos, **Then** se listan todos los animes de ese género ordenados por puntaje de
   mayor a menor.
2. **Given** un género sin animes cargados, **When** el usuario lo selecciona, **Then**
   ve un mensaje explicativo, no una lista en blanco.
3. **Given** un listado con datos, **When** el usuario toca un ítem, **Then** se abre el
   detalle de **ese** anime, identificado por su identificador único.
4. **Given** que la lectura falla, **When** el usuario selecciona un género, **Then** ve
   un mensaje de error y una forma de reintentar.

---

### User Story 5 - Quitar un ítem de mi lista (Priority: P5)

El usuario ya vio algo, o dejó de interesarle, y quiere sacarlo de su lista de
pendientes. Lo elimina desde Mi Lista, con una confirmación previa para no borrar por
accidente.

**Why this priority**: Cierra el ciclo de vida de la lista. Es poco alcance adicional,
pero sin las historias anteriores no tiene sentido.

**Independent Test**: Se puede probar eliminando un ítem existente, cancelando la
confirmación una vez y aceptándola la otra, y verificando que el ítem desaparece y no
vuelve al reabrir la app.

**Acceptance Scenarios**:

1. **Given** un ítem en Mi Lista, **When** el usuario pide eliminarlo, **Then** se le
   pide confirmación antes de borrar nada.
2. **Given** la confirmación de borrado, **When** el usuario la acepta, **Then** el ítem
   desaparece de la lista y no vuelve a aparecer al reabrir la app.
3. **Given** la confirmación de borrado, **When** el usuario la cancela, **Then** el
   ítem permanece en la lista.
4. **Given** que se elimina el último ítem de la lista, **When** termina el borrado,
   **Then** se muestra el estado vacío con su mensaje explicativo.

---

### Edge Cases

- **Género con un único anime**: el sorteo no puede garantizar un título distinto al
  anterior. Se acepta repetir y la regla de "no repetir" queda condicionada a que haya
  al menos dos animes en el género.
- **Género sin animes**: el catálogo muestra el estado vacío explicativo; el sorteo
  informa que no hay nada para recomendar en ese género.
- **Identificador de anime inexistente**: el detalle muestra "anime no encontrado" con
  una forma de volver, en lugar de una pantalla en blanco.
- **Título duplicado en Mi Lista**: se rechaza el alta y se avisa, tanto en el alta
  manual como al agregar desde el detalle.
- **Fallo de la capa de datos**: toda pantalla que lee muestra mensaje de error y
  reintento; toda pantalla que escribe informa el fallo sin dejar el botón bloqueado.
- **Portada que no carga**: se muestra un marcador de posición en su lugar; el resto de
  la información del anime se muestra igual.
- **Toques repetidos durante una operación**: mientras hay una lectura o escritura en
  curso, la acción que la disparó queda deshabilitada para evitar operaciones dobles.

## Requirements *(mandatory)*

### Functional Requirements

**Descubrir y sortear**

- **FR-001**: El sistema MUST ofrecer los cuatro géneros del glosario como conjunto
  fijo y cerrado, sin permitir crear, editar ni eliminar géneros.
- **FR-002**: El sistema MUST presentar la pantalla inicial sin ningún anime sorteado y
  con una invitación explícita a sortear.
- **FR-003**: El sistema MUST impedir el sorteo si no hay género seleccionado, e
  indicarle al usuario que elija uno.
- **FR-004**: El sistema MUST sortear un anime **al azar puro** entre los del género
  seleccionado, sin considerar historial, gustos ni puntajes.
- **FR-005**: El sistema MUST evitar que un sorteo consecutivo devuelva el mismo anime
  que el anterior, siempre que el género tenga dos o más animes.
- **FR-006**: Los usuarios MUST poder abrir el detalle del anime sorteado desde su
  tarjeta.

**Catálogo**

- **FR-007**: El sistema MUST listar todos los animes del género seleccionado ordenados
  por puntaje de la comunidad, de mayor a menor.
- **FR-008**: El sistema MUST mostrar un mensaje explicativo cuando el género
  seleccionado no tiene animes, en lugar de una lista vacía sin contexto.
- **FR-009**: Los usuarios MUST poder abrir, desde cualquier ítem del listado, el
  detalle del anime correspondiente identificado por su identificador único.

**Detalle**

- **FR-010**: El sistema MUST mostrar, para un anime existente, portada, título,
  género, año, cantidad de episodios, puntaje de la comunidad y sinopsis completa.
- **FR-011**: El sistema MUST mostrar "anime no encontrado" y una forma de volver
  cuando se solicita un identificador inexistente.
- **FR-012**: Los usuarios MUST poder agregar el anime del detalle a Mi Lista.
- **FR-013**: El sistema MUST indicar visualmente que un anime ya está en Mi Lista y
  deshabilitar la acción de agregarlo, impidiendo duplicados.

**Mi Lista**

- **FR-014**: El sistema MUST listar los items guardados del más reciente al más
  antiguo.
- **FR-015**: El sistema MUST mostrar, por cada ítem, título, género, puntaje personal
  y si fue agregado desde el catálogo o cargado a mano.
- **FR-016**: El sistema MUST mostrar, con la lista vacía, un mensaje que explique que
  no hay nada guardado y ofrezca ir a Descubrir o cargar un anime a mano.
- **FR-017**: Los usuarios MUST poder eliminar un ítem de Mi Lista, con confirmación
  previa.
- **FR-018**: El sistema MUST conservar el contenido de Mi Lista entre cierres y
  aperturas de la aplicación, en el propio dispositivo.
- **FR-019**: Los usuarios MUST poder acceder al formulario de alta desde Mi Lista.

**Formulario de alta**

- **FR-020**: El sistema MUST pedir título, género, cantidad de episodios, puntaje
  personal y comentario opcional.
- **FR-021**: El sistema MUST rechazar un título vacío, de menos de 2 caracteres o de
  más de 80.
- **FR-022**: El sistema MUST rechazar el alta sin género seleccionado.
- **FR-023**: El sistema MUST rechazar una cantidad de episodios no numérica, menor a 1
  o mayor a 5000.
- **FR-024**: El sistema MUST rechazar un puntaje personal no numérico o fuera del
  rango 1 a 10.
- **FR-025**: El sistema MUST aceptar el comentario vacío y rechazarlo si supera los
  200 caracteres.
- **FR-026**: El sistema MUST mostrar **todos** los errores de validación
  simultáneamente, cada uno junto a su campo, y no de a uno por vez.
- **FR-027**: El sistema MUST rechazar el alta si ya existe en Mi Lista un ítem con el
  mismo título.
- **FR-028**: El sistema MUST volver a Mi Lista tras un alta exitosa, con el ítem nuevo
  visible en primer lugar.

**Transversales**

- **FR-029**: Toda lectura y escritura de datos MUST pasar por la capa de acceso
  simulada; ninguna pantalla accede a los datos de origen por su cuenta.
- **FR-030**: Toda lectura y escritura MUST demorar entre 500 y 1000 ms de forma
  artificial, simulando el comportamiento de un servicio remoto.
- **FR-031**: Toda pantalla que lee datos MUST manejar explícitamente los estados de
  carga, error, vacío y con datos.
- **FR-032**: Toda acción que escribe datos MUST quedar deshabilitada mientras la
  escritura está en curso, y confirmar o informar el resultado al terminar.
- **FR-033**: Los estados vacío y de error MUST poder forzarse sin modificar los datos,
  para poder verificarlos y demostrarlos.
- **FR-034**: El sistema MUST mostrar un marcador de posición cuando la portada de un
  anime no puede cargarse, sin afectar el resto de la información.
- **FR-035**: El sistema MUST funcionar sin conexión a internet en todo lo que hace a
  datos y sorteo; la conexión solo afecta la visualización de las portadas.

### Key Entities

- **Anime**: título del catálogo, de solo lectura. Identificador único, título, género
  principal (uno de los cuatro), año de emisión, cantidad de episodios, sinopsis,
  puntaje de la comunidad e imagen de portada. Nunca se modifica desde la app.
- **ItemDeMiLista**: anotación personal del usuario. Identificador único, título,
  género (uno de los cuatro), cantidad de episodios, puntaje personal de 1 a 10,
  comentario opcional, fecha en que se agregó y origen (agregado desde el catálogo o
  cargado a mano). Se crea y se elimina, pero no se edita.

**Por qué son dos entidades distintas**: el catálogo nunca se modifica; la lista
personal sí. Un solo tipo para ambos obligaría a campos opcionales por todos lados y a
explicar por qué un anime del catálogo tiene un "puntaje personal" vacío.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desde que abre la app, el usuario obtiene una recomendación en **2 toques**
  (elegir género, sortear) y en menos de 5 segundos.
- **SC-002**: El 100% de los animes sorteados pertenece al género seleccionado, en 20
  sorteos consecutivos de verificación.
- **SC-003**: En 10 sorteos consecutivos sobre un género con dos o más animes, ninguno
  repite el título inmediatamente anterior.
- **SC-004**: El 100% de las pantallas que leen datos muestran un indicador de carga
  visible mientras dura la demora simulada, sin contenido parcial.
- **SC-005**: Los estados vacío y de error de cualquier pantalla pueden demostrarse en
  menos de 2 minutos y sin modificar los datos.
- **SC-006**: Con los cinco campos del formulario inválidos a la vez, se muestran los
  errores de los 5 campos en un solo intento de guardado.
- **SC-007**: El 100% de los items guardados sigue presente tras cerrar por completo la
  app y volver a abrirla.
- **SC-008**: Ningún título puede quedar duplicado en Mi Lista, ni por alta manual ni
  agregando desde el detalle.
- **SC-009**: Con el dispositivo sin conexión, el sorteo, el catálogo, el detalle y Mi
  Lista siguen funcionando; solo las portadas se reemplazan por su marcador de
  posición.
- **SC-010**: Cualquiera de los dos integrantes puede verificar manualmente todos los
  criterios de una historia en menos de 2 minutos por historia.

## Fuera de Alcance

Ninguna tarea puede implementar esto:

- Backend propio, servidor, base de datos o consumo de servicios remotos en tiempo de
  ejecución.
- Registro, login, cuentas de usuario, sincronización entre dispositivos.
- Búsqueda por texto, filtros combinados, ordenamientos personalizados.
- Editar un ítem ya guardado. Solo alta y baja.
- Marcar episodios vistos, progreso de visionado, estadísticas.
- Recomendaciones basadas en gustos o historial. El sorteo es **aleatorio puro**.
- Géneros adicionales o géneros definidos por el usuario.
- Compartir, exportar, imprimir.
- Tráilers, videos, enlaces externos, información de streaming.
- Notificaciones push, recordatorios.
- Tema oscuro, internacionalización, accesibilidad avanzada.
- Animaciones y transiciones personalizadas.
- Tests automatizados.

## Assumptions

- Un solo usuario por dispositivo, sin autenticación.
- El catálogo tiene entre 10 y 15 animes por género, 40 a 60 en total. No requiere
  paginado ni carga incremental.
- Los datos del catálogo son estáticos: se fijan una vez y no se actualizan durante la
  vida del prototipo.
- La aplicación se verifica en un teléfono físico, no en emulador.
- Las portadas se cargan desde las URLs de imagen provistas en los datos del catálogo.
  Si una imagen falla, se muestra un marcador de posición. Decisión tomada por el
  equipo: se prefiere la portada real con respaldo, porque la app sigue siendo
  utilizable sin conexión y el resultado visual es notoriamente mejor.
- Mi Lista entra con alta y baja. Decisión tomada por el equipo: poder agregar sin poder
  quitar es frustrante, y sin baja el estado vacío no puede demostrarse en vivo.
- El catálogo es una pantalla propia y no se fusiona con Descubrir. Decisión tomada por
  el equipo: cinco pantallas dan un margen sobre el mínimo de cuatro exigido, y evitan
  concentrar dos responsabilidades en la pantalla inicial.
- El puntaje personal y el puntaje de la comunidad son cosas distintas y no se comparan
  ni se combinan.
- La fecha de agregado se toma del reloj del dispositivo.
