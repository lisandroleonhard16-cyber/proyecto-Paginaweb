# CONTEXTO Y TAREA PARA DEVIN — Formulario "Envía tu receta" (PHP) en Margarita Cocina

> Documento de traspaso. Léelo completo antes de tocar nada. Contiene: contexto del proyecto, estado actual (qué ya funciona y qué no está probado), la tarea exacta, el código completo de los archivos a crear y los criterios para dar la tarea por terminada.

---

## 0. Prompt para pegar en Devin

> Adjunto `CONTEXTO_PARA_DEVIN.md`. Lee el documento completo y ejecuta la **Tarea** de la sección 5 en mi proyecto web `proyecto-Paginaweb`: agregar un formulario para enviar recetas (con PHP) a `contacto.html`. Respeta todas las reglas de la sección 2 (especialmente: no modificar CSS existentes ni cambiar colores). Crea los archivos con el código exacto del Anexo, modifica `contacto.html` como se indica, y al final verifica con la lista de la sección 7 y dime qué pasó en cada punto. Si algo del entorno no coincide con lo descrito, dímelo antes de improvisar.

---

## 1. Sobre el proyecto

- **Nombre:** Margarita Cocina (sitio de recetas).
- **Origen:** proyecto escolar del **Colegio Parroquial Juan XXIII**, materia **Laboratorio de Aplicaciones**. Autores: **Valentín Gómez** y **Lisandro Leonhard**. Surgió de la cocina de la abuela de Valentín, que siempre compartió sus recetas con la familia y los amigos.
- **Tecnología:** sitio estático en **HTML + CSS + JavaScript puro** (sin frameworks, sin npm, sin build). Ahora se suma **PHP** solo para el formulario.
- **Idioma:** todo en **español**. Los textos visibles usan trato neutro de "tú" ("Contáctanos", "Síguenos", "Envía tu receta").
- **Estilo visual:** fondo oscuro con imagen fija, dorado `rgb(212, 175, 55)` como color principal, tarjetas `rgb(25, 25, 25)` / `rgba(30, 30, 30, 0.95)`, texto blanco / `#ddd` / `#ccc`, títulos en `Georgia`, y rojo oscuro `rgb(152, 9, 9)` solo en sombras. Bordes dorados de 2px y esquinas redondeadas.

### 1.1 Estructura de carpetas del proyecto

Raíz del proyecto: `proyecto-Paginaweb/`

```
proyecto-Paginaweb/
├── index.html
├── nosotros.html
├── contacto.html                 ← SE MODIFICA en esta tarea
├── css/
│   ├── estilos.css               ← base (NO tocar)
│   ├── home.css                  ← (NO tocar)
│   ├── receta_tradicional.css    ← (NO tocar)
│   ├── contenido_receta.css      ← (NO tocar)
│   ├── footer.css                ← (NO tocar)
│   ├── aviso.css                 ← (NO tocar)
│   ├── layout_recetas.css        ← ya hecho antes (ver 3)
│   ├── nosotros.css              ← ya hecho antes (ver 3)
│   └── formulario_receta.css     ← CREAR (Anexo B)
├── JavaScript/
│   ├── boton.js, carrusel.js, menu.js, animations.js   ← existentes (NO tocar)
│   ├── recetas_layout.js         ← ya hecho antes (ver 3)
│   └── formulario_receta.js      ← CREAR (Anexo C)
├── php/
│   └── enviar_receta.php         ← CREAR (Anexo A)
├── data/                         ← CREAR carpeta + .htaccess (Anexo D). El PHP crea dentro recetas_pendientes.json
├── uploads/
│   └── pendientes/               ← CREAR carpeta + .htaccess (Anexo E). Aquí se guardan las imágenes enviadas
├── imagenes/                     ← existente (instagramlogo.png, gmail.png, Recetas/...)
└── html/
    ├── Recetas/                  ← carnes.html, pastas.html, ensaladas.html, postres.html, tragos.html, especialidad_casa.html
    └── Dietas espaciales/        ← (sí, "espaciales", con ese error de tipeo; NO corregirlo, hay enlaces que dependen de él)
```

`contacto.html` está en la raíz, por eso sus rutas son relativas sin `../` (`css/...`, `JavaScript/...`, `php/...`).

---

## 2. Reglas obligatorias

**Hacer:**
- Crear archivos nuevos en lugar de editar los existentes. La **única** edición a un archivo existente es en `contacto.html` (sección 5, paso 4).
- Usar exactamente el código del Anexo (ya fue revisado). Si encuentras un error real, corrígelo y **avísame qué cambiaste y por qué**.
- Mantener los colores y el estilo del sitio (ver 1). El formulario debe verse como parte de la página.
- Dejar todo funcionando con **XAMPP/Apache** (ver 4).

**No hacer:**
- No modificar `estilos.css`, `home.css`, `receta_tradicional.css`, `contenido_receta.css`, `footer.css`, `aviso.css`, ni los JS existentes.
- No cambiar el fondo, header, nav, footer, preloader ni partículas de `contacto.html`.
- No agregar frameworks, librerías, CDNs, composer ni base de datos. Solo PHP puro y archivos.
- No implementar login, panel de administración ni aprobación de recetas (ver sección 6: es un plan futuro).
- No renombrar `contacto.html` a `.php` (rompería los enlaces del sitio).
- No corregir el nombre de la carpeta `Dietas espaciales`.

---

## 3. Qué ya está hecho en el proyecto (contexto)

Estos trabajos **ya existen y el usuario los aprobó visualmente**. No los rehagas; solo ten en cuenta que existen:

| Trabajo | Archivos | Estado |
|---|---|---|
| **Layout de recetas** (banner "Receta estrella de la semana" + grilla de tarjetas horizontales; al hacer clic la receta sube al lugar del banner y se abre) aplicado a `carnes.html` | `css/layout_recetas.css`, `JavaScript/recetas_layout.js`, cambios en `html/Recetas/carnes.html` | ✅ Aprobado por el usuario. Documentado en `GUIA_LAYOUT_RECETAS.md` y automatizable con `aplicar_layout.py` |
| **Página "Nosotros"** ampliada (historia, línea de tiempo, cifras, valores, equipo, proyecto escolar) | `nosotros.html`, `css/nosotros.css` | ✅ Entregada. Usa `.scroll-reveal` (animación al hacer scroll, ya existente en `animations.js`) |
| **Entorno XAMPP** | Apache funcionando | ✅ Ver sección 4 |
| **Formulario "Envía tu receta"** | Esta tarea | ⚠️ **Escrito pero NO probado en ejecución** (ver 3.1) |

### 3.1 Qué NO está verificado (importante)

El código PHP/JS/CSS del Anexo fue escrito **sin poder ejecutar PHP** (el entorno donde se redactó no tenía PHP). Solo se verificó la sintaxis del JavaScript. Por eso:
- Es posible que haya errores que solo aparezcan al ejecutarlo. **Pruébalo de verdad** (sección 7) y corrige lo que falle.
- El usuario aún **no confirmó** que el formulario envíe correctamente.

---

## 4. Entorno de ejecución (confirmado por capturas del usuario)

- Sistema: **Windows**, XAMPP **8.3.36** (PHP 8.3), Apache 2.4.
- XAMPP instalado en: `E:\Valen cole\cole\XAMPP\` ← **la ruta tiene espacios**. XAMPP lo advierte, pero con la configuración actual funciona.
- Proyecto en: `E:\Valen cole\cole\XAMPP\htdocs\proyecto-Paginaweb\`
- URL del sitio: **`http://localhost/proyecto-Paginaweb/`** (Apache usa los puertos 80 y 443; MySQL, FileZilla y Tomcat no se usan).
- Formulario: **`http://localhost/proyecto-Paginaweb/contacto.html`**
- **Historia del arranque de Apache:** al principio Apache se apagaba solo. `httpd.exe -t` mostró `ServerRoot must be a valid directory` (el XAMPP se había movido de carpeta y su configuración apuntaba a otra ruta). Se resolvió ejecutando `setup_xampp.bat` y abriendo el panel **como administrador**. Si Apache vuelve a fallar con ese error, repetir eso. Si todo falla, alternativa: mover XAMPP a `C:\xampp`.
- **No usar Live Server de VS Code** (`127.0.0.1:5500`): no ejecuta PHP, y el formulario no funcionaría ahí. El JavaScript detecta este caso y muestra un aviso al usuario.
- Los archivos `.htaccess` los lee Apache de XAMPP (por defecto `AllowOverride All`). Están ocultos en Windows ("Elementos ocultos" en la pestaña Vista del Explorador).

---

## 5. TAREA: agregar el formulario "Envía tu receta"

### 5.1 Qué debe hacer (requisitos funcionales)

En `contacto.html`, **debajo** de la sección de contacto existente, agregar un formulario para que cualquier visitante envíe una receta con:

1. **Nombre de la receta** (obligatorio, 3–80 caracteres).
2. **Categoría** (obligatoria, lista): Especialidad de la casa, Pastas, Carnes, Ensaladas, Postres, Tragos.
3. **Tipo de receta** (casillas, opcional, varias): Vegetariana, Vegana, Sin TACC, Sin lactosa, Sin azúcar, Altas en proteínas. Ninguna marcada = receta común/tradicional. *(Se interpretó "tipo de receta" como tipo de dieta, porque el menú ya tiene "Dietas Especiales".)*
4. **Imagen** (obligatoria): JPG, PNG o WEBP, máximo 5 MB, con vista previa en el navegador.
5. **Descripción** (opcional, máx. 500 caracteres) con contador. *(Campo agregado como extra; se puede quitar si el usuario lo pide.)*

Comportamiento:
- Se envía por `fetch` (sin recargar) a `php/enviar_receta.php`, que **siempre responde JSON** `{ok, mensaje}`.
- El PHP **valida todo en el servidor** (no confiar en el navegador): textos, listas blancas de categorías y tipos, el contenido real de la imagen (con `finfo`, no por extensión), tamaño y dimensiones.
- La imagen se guarda en `uploads/pendientes/` con **nombre aleatorio**.
- Los datos se guardan en `data/recetas_pendientes.json` con `flock` y **`"estado": "pendiente"`**. **Nada se publica automáticamente.**
- Protecciones: campo trampa anti-bots (`sitio_web`), espera mínima de 30 s entre envíos por sesión, `.htaccess` que impide leer `data/` y ejecutar código en `uploads/pendientes/`.
- Mensajes de éxito/error en pantalla, botón deshabilitado mientras envía.

### 5.2 Pasos

**Paso 1 — Crear carpetas** en la raíz del proyecto: `php/`, `data/`, `uploads/pendientes/` (si no existen).

**Paso 2 — Crear los archivos** con el contenido exacto de los anexos:

| Archivo a crear | Contenido |
|---|---|
| `php/enviar_receta.php` | Anexo A |
| `css/formulario_receta.css` | Anexo B |
| `JavaScript/formulario_receta.js` | Anexo C |
| `data/.htaccess` | Anexo D |
| `uploads/pendientes/.htaccess` | Anexo E |

> Los archivos `.htaccess` empiezan con punto y no tienen nombre antes del punto. Verifica que se llamen exactamente `.htaccess` (no `.htaccess.txt`).

**Paso 3 — Conectar CSS y JS en `contacto.html`** (única edición de un archivo existente, en 2 lugares):

a) En el `<head>`, **justo después** de esta línea:
```html
<link rel="stylesheet" href="css/footer.css">
```
agregar:
```html
<link rel="stylesheet" href="css/formulario_receta.css">
```

b) Al final del `<body>`, **justo después** de esta línea:
```html
<script src="JavaScript/animations.js"></script>
```
agregar:
```html
<script src="JavaScript/formulario_receta.js"></script>
```

**Paso 4 — Insertar el formulario en `contacto.html`.** Dentro de `<main>`, **después** del cierre `</section>` de la sección `id="contacto"` y **antes** de `</main>`, pegar el bloque del Anexo F (`<section class="form-receta-section ...">`). No modificar nada de la sección de contacto existente (Instagram y correos).

**Paso 5 — Probar** siguiendo la sección 7 y corregir lo que falle.

---

## 6. Plan futuro (SOLO CONTEXTO — NO IMPLEMENTAR)

El usuario explicó que quiere, más adelante, agregar a todo el sitio una sección de **inicio de sesión**, para que él, como **administrador**, pueda elegir qué fotos/recetas enviadas se publican y cuáles no.

Por eso el formulario guarda todo con `"estado": "pendiente"` y la imagen en una carpeta `pendientes/`. Mantén esa estructura tal cual para que el futuro panel solo tenga que leer `data/recetas_pendientes.json` y cambiar el estado a `"aprobada"` o `"rechazada"` (y mover la imagen). **No agregues login, usuarios, sesiones de administrador ni paneles ahora.**

---

## 7. Verificación (criterios de aceptación)

Probar en el navegador con Apache encendido, en `http://localhost/proyecto-Paginaweb/contacto.html`:

**Aspecto**
- [ ] Debajo de la sección "Contáctanos" aparece "Envía tu receta" con el mismo estilo del sitio (panel oscuro, borde dorado).
- [ ] No se alteró el header, la sección de contacto ni el footer.
- [ ] Se ve bien en pantalla ancha y en móvil (≤ 768 px: una columna).

**Envío correcto**
- [ ] Completar nombre, categoría, imagen (JPG/PNG/WEBP < 5 MB) y enviar → aparece mensaje de éxito y el formulario se limpia (incluida la vista previa).
- [ ] En `uploads/pendientes/` aparece la imagen con nombre aleatorio.
- [ ] En `data/recetas_pendientes.json` aparece el registro con `nombre`, `categoria` (como slug, ej. `carnes`), `tipos` (lista), `descripcion`, `imagen`, `estado: "pendiente"` y `fecha`.
- [ ] Marcar varias casillas de tipo se guarda como lista; ninguna marcada guarda lista vacía.

**Errores esperados**
- [ ] Enviar sin imagen → mensaje de error (no se guarda nada).
- [ ] Subir un `.txt` o `.pdf` renombrado a `.jpg` → rechazado ("el archivo no es una imagen válida" o formato no permitido).
- [ ] Subir una imagen de más de 5 MB → mensaje de error de peso.
- [ ] Enviar dos veces seguidas en menos de 30 s → la segunda se rechaza con el mensaje de espera.
- [ ] Abrir la página con Live Server (`127.0.0.1:5500`) y enviar → aparece el aviso de que se necesita un servidor con PHP.

**Seguridad (`.htaccess`)**
- [ ] `http://localhost/proyecto-Paginaweb/data/recetas_pendientes.json` → **403 Forbidden**.
- [ ] `http://localhost/proyecto-Paginaweb/uploads/pendientes/` → no lista los archivos (403 o página vacía).
- [ ] La imagen subida sí se ve al abrir su URL directa (`.../uploads/pendientes/<nombre>.jpg`).

**Consola**
- [ ] Sin errores en la consola del navegador (F12) ni en `xampp/apache/logs/error.log` relacionados con estos archivos.

Al terminar, **informa punto por punto** qué pasó (✅/❌) y qué corregiste.

---

## 8. Problemas conocidos y cómo resolverlos

| Síntoma | Causa probable | Solución |
|---|---|---|
| "El servidor no pudo procesar el envío…" | Página abierta fuera de Apache (Live Server o doble clic) | Abrir por `http://localhost/proyecto-Paginaweb/contacto.html` |
| "La imagen es demasiado pesada" con foto chica | `upload_max_filesize` / `post_max_size` bajos en `php.ini` (XAMPP → Config → PHP (php.ini)) | Subirlos a `8M` y reiniciar Apache |
| Error 500 al abrir páginas de las carpetas con `.htaccess` | `AllowOverride` no permite alguna directiva | Revisar `xampp/apache/logs/error.log`; simplificar el `.htaccess` afectado |
| No se crean `data/` o `uploads/pendientes/` | Permisos de escritura | Crear las carpetas a mano; verificar que Apache pueda escribir |
| Apache se apaga solo | Ruta de XAMPP movida / puerto ocupado / sin administrador | Ver sección 4 (`setup_xampp.bat`, ejecutar como administrador, cambiar puertos a 8080/4433) |
| Si se usa puerto 8080 | — | La URL pasa a `http://localhost:8080/proyecto-Paginaweb/contacto.html` |

---

## 9. Archivos de referencia que el usuario puede adjuntar (opcionales)

Para que Devin vea el resto del trabajo ya hecho (no son necesarios para esta tarea):
`GUIA_LAYOUT_RECETAS.md`, `carnes.html`, `css/layout_recetas.css`, `JavaScript/recetas_layout.js`, `aplicar_layout.py`, `nosotros.html`, `css/nosotros.css`.
Y, para esta tarea, el `contacto.html` **original** del usuario (el que está hoy en su carpeta).

---

# ANEXOS — CÓDIGO COMPLETO

## Anexo A — `php/enviar_receta.php`

```php
<?php
/**
 * enviar_receta.php
 * Recibe el formulario de "Envía tu receta" (contacto.html).
 *
 * - Valida todos los campos en el servidor.
 * - Guarda la imagen en  uploads/pendientes/
 * - Guarda los datos en  data/recetas_pendientes.json  con estado "pendiente"
 *   (nada se publica solo: queda a la espera de una futura revisión del administrador).
 * - Responde siempre en JSON.
 */
declare(strict_types=1);

session_start();
date_default_timezone_set('America/Argentina/Buenos_Aires');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/* ===== CONFIGURACIÓN ===== */
const MAX_BYTES        = 5 * 1024 * 1024;   // 5 MB por imagen
const MAX_LADO_PX      = 8000;              // alto/ancho máximo permitido
const SEGUNDOS_ESPERA  = 30;                // tiempo mínimo entre envíos de una misma persona

const CATEGORIAS = [
    'especialidad-casa' => 'Especialidad de la casa',
    'pastas'            => 'Pastas',
    'carnes'            => 'Carnes',
    'ensaladas'         => 'Ensaladas',
    'postres'           => 'Postres',
    'tragos'            => 'Tragos',
];

const TIPOS = [
    'vegetariana'    => 'Vegetariana',
    'vegana'         => 'Vegana',
    'sintacc'        => 'Sin TACC',
    'sinlactosa'     => 'Sin lactosa',
    'sinazucar'      => 'Sin azúcar',
    'altasproteinas' => 'Altas en proteínas',
];

const FORMATOS_IMAGEN = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
];

$raiz         = dirname(__DIR__);
$dirImagenes  = $raiz . '/uploads/pendientes';
$dirDatos     = $raiz . '/data';
$archivoJson  = $dirDatos . '/recetas_pendientes.json';

/* ===== UTILIDADES ===== */
function responder(bool $ok, string $mensaje, int $codigoHttp = 200): never
{
    http_response_code($codigoHttp);
    echo json_encode(['ok' => $ok, 'mensaje' => $mensaje], JSON_UNESCAPED_UNICODE);
    exit;
}

function limpiarTexto(string $texto): string
{
    $texto = preg_replace('/[^\P{C}\n]+/u', '', $texto) ?? '';   // quita caracteres de control (deja saltos de línea)
    return trim($texto);
}

/* ===== VALIDACIONES GENERALES ===== */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método no permitido.', 405);
}

// Campo trampa para bots: las personas no lo ven ni lo completan.
if (!empty($_POST['sitio_web'] ?? '')) {
    responder(true, '¡Gracias! Recibimos tu receta.');
}

// Espera mínima entre envíos
$ahora = time();
if (isset($_SESSION['ultimo_envio']) && ($ahora - (int) $_SESSION['ultimo_envio']) < SEGUNDOS_ESPERA) {
    responder(false, 'Espera unos segundos antes de enviar otra receta.', 429);
}

/* ===== CAMPOS DE TEXTO ===== */
$nombre = limpiarTexto((string) ($_POST['nombre'] ?? ''));
if (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 80) {
    responder(false, 'El nombre de la receta debe tener entre 3 y 80 caracteres.', 422);
}

$categoria = (string) ($_POST['categoria'] ?? '');
if (!array_key_exists($categoria, CATEGORIAS)) {
    responder(false, 'Elige una categoría válida.', 422);
}

$tiposRecibidos = $_POST['tipos'] ?? [];
if (!is_array($tiposRecibidos)) {
    $tiposRecibidos = [];
}
$tipos = [];
foreach ($tiposRecibidos as $tipo) {
    if (is_string($tipo) && array_key_exists($tipo, TIPOS)) {
        $tipos[$tipo] = true;
    }
}
$tipos = array_keys($tipos);   // sin repetidos; vacío = receta tradicional

$descripcion = limpiarTexto((string) ($_POST['descripcion'] ?? ''));
if (mb_strlen($descripcion) > 500) {
    responder(false, 'La descripción no puede superar los 500 caracteres.', 422);
}

/* ===== IMAGEN ===== */
if (!isset($_FILES['imagen']) || !is_array($_FILES['imagen'])) {
    responder(false, 'Debes adjuntar una imagen de la receta.', 422);
}

$archivo = $_FILES['imagen'];

switch ($archivo['error']) {
    case UPLOAD_ERR_OK:
        break;
    case UPLOAD_ERR_NO_FILE:
        responder(false, 'Debes adjuntar una imagen de la receta.', 422);
    case UPLOAD_ERR_INI_SIZE:
    case UPLOAD_ERR_FORM_SIZE:
        responder(false, 'La imagen es demasiado pesada (máximo 5 MB).', 413);
    default:
        responder(false, 'No se pudo subir la imagen. Intenta de nuevo.', 400);
}

if ($archivo['size'] > MAX_BYTES) {
    responder(false, 'La imagen es demasiado pesada (máximo 5 MB).', 413);
}

if (!is_uploaded_file($archivo['tmp_name'])) {
    responder(false, 'Archivo no válido.', 400);
}

// El tipo se comprueba por el CONTENIDO real del archivo, no por su nombre.
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = (string) $finfo->file($archivo['tmp_name']);
if (!array_key_exists($mime, FORMATOS_IMAGEN)) {
    responder(false, 'Formato no permitido. Usa JPG, PNG o WEBP.', 415);
}

$medidas = @getimagesize($archivo['tmp_name']);
if ($medidas === false) {
    responder(false, 'El archivo no es una imagen válida.', 415);
}
if ($medidas[0] > MAX_LADO_PX || $medidas[1] > MAX_LADO_PX) {
    responder(false, 'La imagen es demasiado grande en píxeles (máximo 8000 × 8000).', 422);
}

/* ===== GUARDAR ARCHIVOS ===== */
foreach ([$dirImagenes, $dirDatos] as $carpeta) {
    if (!is_dir($carpeta) && !mkdir($carpeta, 0755, true) && !is_dir($carpeta)) {
        responder(false, 'No se pudo preparar el almacenamiento en el servidor.', 500);
    }
}

// Nombre aleatorio: evita colisiones y que alguien elija el nombre del archivo.
$nombreArchivo = bin2hex(random_bytes(12)) . '.' . FORMATOS_IMAGEN[$mime];
$rutaDestino   = $dirImagenes . '/' . $nombreArchivo;

if (!move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
    responder(false, 'No se pudo guardar la imagen en el servidor.', 500);
}

$registro = [
    'id'          => bin2hex(random_bytes(8)),
    'nombre'      => $nombre,
    'categoria'   => $categoria,
    'tipos'       => $tipos,
    'descripcion' => $descripcion,
    'imagen'      => 'uploads/pendientes/' . $nombreArchivo,
    'estado'      => 'pendiente',   // futuro administrador: "aprobada" / "rechazada"
    'fecha'       => date('c'),
];

$gestor = fopen($archivoJson, 'c+');
if ($gestor === false || !flock($gestor, LOCK_EX)) {
    @unlink($rutaDestino);
    responder(false, 'No se pudo guardar la receta. Intenta de nuevo.', 500);
}

$lista = json_decode((string) stream_get_contents($gestor), true);
if (!is_array($lista)) {
    $lista = [];
}
$lista[] = $registro;

ftruncate($gestor, 0);
rewind($gestor);
$escrito = fwrite($gestor, json_encode($lista, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
fflush($gestor);
flock($gestor, LOCK_UN);
fclose($gestor);

if ($escrito === false) {
    @unlink($rutaDestino);
    responder(false, 'No se pudo guardar la receta. Intenta de nuevo.', 500);
}

$_SESSION['ultimo_envio'] = $ahora;
responder(true, '¡Gracias! Recibimos tu receta y la revisaremos antes de publicarla.');
```

## Anexo B — `css/formulario_receta.css`

```css
/**
 * FORMULARIO_RECETA.CSS
 * Estilos del formulario "Envía tu receta" de contacto.html.
 * Usa solo la paleta del sitio (dorado, grises oscuros, blanco y el rojo oscuro ya usado en sombras).
 * Cargar después de estilos.css, home.css y footer.css.
 */

.form-receta-section {
    width: 90%;
    max-width: 900px;
    margin: 50px auto;
    padding: 40px;
    background-color: rgba(30, 30, 30, 0.95);
    border: 2px solid rgb(212, 175, 55);
    border-radius: 20px;
    box-shadow: 0px 6px 20px rgba(212, 175, 55, 0.2);
}

.form-receta-section > h2 {
    text-align: center;
    font-family: "Georgia", serif;
    font-size: 32px;
    margin: 0 0 12px;
}

.form-receta-intro {
    text-align: center;
    color: #ddd;
    font-size: 16px;
    line-height: 1.6;
    max-width: 650px;
    margin: 0 auto 32px;
}

/* ===== CAMPOS ===== */
.form-receta {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-fila {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

.form-campo {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: none;
    padding: 0;
    margin: 0;
    min-width: 0;
}

.form-campo > label,
.form-campo > legend {
    color: rgb(212, 175, 55);
    font-family: "Georgia", serif;
    font-size: 17px;
    font-weight: bold;
    padding: 0;
}

.form-ayuda {
    color: #ccc;
    font-size: 13px;
    margin: 0;
}

.form-receta input[type="text"],
.form-receta select,
.form-receta textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    background-color: rgb(20, 20, 20);
    border: 2px solid rgba(212, 175, 55, 0.5);
    border-radius: 10px;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 15px;
    color-scheme: dark;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-receta textarea {
    resize: vertical;
    min-height: 110px;
}

.form-receta input[type="text"]:focus,
.form-receta select:focus,
.form-receta textarea:focus {
    outline: none;
    border-color: rgb(212, 175, 55);
    box-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
}

.form-contador {
    align-self: flex-end;
    color: #888;
    font-size: 12px;
}

/* ===== TIPOS DE RECETA (chips) ===== */
.form-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.form-chip {
    position: relative;
    cursor: pointer;
}

.form-chip input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.form-chip span {
    display: inline-block;
    padding: 8px 18px;
    border: 1px solid rgb(212, 175, 55);
    border-radius: 20px;
    background-color: rgba(212, 175, 55, 0.1);
    color: rgb(212, 175, 55);
    font-size: 14px;
    font-weight: bold;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
}

.form-chip:hover span {
    transform: translateY(-2px);
}

.form-chip input:checked + span {
    background-color: rgb(212, 175, 55);
    color: black;
}

.form-chip input:focus-visible + span {
    outline: 2px solid white;
    outline-offset: 2px;
}

/* ===== IMAGEN ===== */
.form-imagen {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
    padding: 18px;
    background-color: rgb(20, 20, 20);
    border: 2px dashed rgba(212, 175, 55, 0.6);
    border-radius: 12px;
}

.form-imagen input[type="file"] {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    overflow: hidden;
}

.form-imagen-boton {
    display: inline-block;
    padding: 10px 22px;
    border: 2px solid rgb(212, 175, 55);
    border-radius: 10px;
    color: rgb(212, 175, 55);
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.form-imagen-boton:hover,
.form-imagen:focus-within .form-imagen-boton {
    background-color: rgb(212, 175, 55);
    color: black;
}

.form-imagen-nombre {
    flex: 1;
    min-width: 150px;
    color: #ccc;
    font-size: 14px;
    word-break: break-all;
}

.form-vista-previa {
    width: 100%;
    max-height: 260px;
    object-fit: cover;
    border: 2px solid rgb(212, 175, 55);
    border-radius: 12px;
}

/* ===== BOTÓN Y MENSAJES ===== */
.form-boton {
    align-self: center;
    padding: 13px 40px;
    border: 2px solid rgb(212, 175, 55);
    border-radius: 10px;
    background-color: rgb(212, 175, 55);
    color: black;
    font-family: "Georgia", serif;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
}

.form-boton:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(212, 175, 55, 0.4);
}

.form-boton:disabled {
    opacity: 0.6;
    cursor: wait;
}

.form-mensaje {
    padding: 14px 18px;
    border-radius: 10px;
    font-size: 15px;
    line-height: 1.5;
    text-align: center;
}

.form-mensaje.ok {
    background-color: rgba(212, 175, 55, 0.15);
    border: 2px solid rgb(212, 175, 55);
    color: white;
}

.form-mensaje.error {
    background-color: rgb(152, 9, 9);
    border: 2px solid rgb(152, 9, 9);
    color: white;
}

/* Campo trampa anti-bots: invisible para las personas */
.form-trampa {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
    .form-receta-section {
        padding: 28px 20px;
    }

    .form-fila {
        grid-template-columns: 1fr;
    }
}
```

## Anexo C — `JavaScript/formulario_receta.js`

```javascript
/**
 * FORMULARIO_RECETA.JS
 * Formulario "Envía tu receta" (contacto.html):
 *  - vista previa de la imagen elegida
 *  - validación de tipo y peso antes de enviar
 *  - envío con fetch (sin recargar la página) a php/enviar_receta.php
 *  - mensajes de éxito / error
 */
(function () {
    const form = document.getElementById('formReceta');
    if (!form) return;

    const MAX_BYTES = 5 * 1024 * 1024;
    const FORMATOS = ['image/jpeg', 'image/png', 'image/webp'];

    const inputImagen = document.getElementById('imagen');
    const vistaPrevia = document.getElementById('vistaPrevia');
    const nombreArchivo = document.getElementById('nombreArchivo');
    const mensaje = document.getElementById('formMensaje');
    const boton = document.getElementById('formBoton');
    const descripcion = document.getElementById('descripcion');
    const contador = document.getElementById('contadorDescripcion');

    let urlPrevia = null;

    function mostrarMensaje(texto, esExito) {
        mensaje.textContent = texto;
        mensaje.className = 'form-mensaje ' + (esExito ? 'ok' : 'error');
        mensaje.hidden = false;
        mensaje.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function ocultarMensaje() {
        mensaje.hidden = true;
        mensaje.textContent = '';
    }

    function limpiarVistaPrevia() {
        if (urlPrevia) {
            URL.revokeObjectURL(urlPrevia);
            urlPrevia = null;
        }
        vistaPrevia.hidden = true;
        vistaPrevia.removeAttribute('src');
        nombreArchivo.textContent = 'Ningún archivo seleccionado';
    }

    // Vista previa y validación de la imagen
    inputImagen.addEventListener('change', function () {
        ocultarMensaje();
        limpiarVistaPrevia();

        const archivo = inputImagen.files[0];
        if (!archivo) return;

        if (!FORMATOS.includes(archivo.type)) {
            inputImagen.value = '';
            mostrarMensaje('Formato no permitido. Usa una imagen JPG, PNG o WEBP.', false);
            return;
        }
        if (archivo.size > MAX_BYTES) {
            inputImagen.value = '';
            mostrarMensaje('La imagen es demasiado pesada (máximo 5 MB).', false);
            return;
        }

        urlPrevia = URL.createObjectURL(archivo);
        vistaPrevia.src = urlPrevia;
        vistaPrevia.hidden = false;
        nombreArchivo.textContent = archivo.name;
    });

    // Contador de caracteres de la descripción
    function actualizarContador() {
        contador.textContent = descripcion.value.length + ' / ' + descripcion.maxLength;
    }
    descripcion.addEventListener('input', actualizarContador);
    actualizarContador();

    // Envío
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        ocultarMensaje();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        boton.disabled = true;
        const textoOriginal = boton.textContent;
        boton.textContent = 'Enviando…';

        try {
            const respuesta = await fetch(form.getAttribute('action'), {
                method: 'POST',
                body: new FormData(form)
            });

            const texto = await respuesta.text();
            let datos = null;
            try {
                datos = JSON.parse(texto);
            } catch (_) { /* la respuesta no era JSON */ }

            if (!datos) {
                mostrarMensaje(
                    'El servidor no pudo procesar el envío. Verifica que la página se esté abriendo desde un servidor con PHP (por ejemplo XAMPP).',
                    false
                );
            } else if (datos.ok) {
                mostrarMensaje(datos.mensaje, true);
                form.reset();
                limpiarVistaPrevia();
                actualizarContador();
            } else {
                mostrarMensaje(datos.mensaje || 'No se pudo enviar la receta.', false);
            }
        } catch (error) {
            mostrarMensaje('No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.', false);
        } finally {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    });
})();
```

## Anexo D — `data/.htaccess`

```apache
# Los datos de las recetas no deben ser accesibles desde el navegador.
Require all denied
```

## Anexo E — `uploads/pendientes/.htaccess`

```apache
# Las imágenes subidas nunca deben ejecutarse como código ni listarse.
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|phar|pl|py|cgi)$">
    Require all denied
</FilesMatch>
```

## Anexo F — Bloque HTML a insertar en `contacto.html` (Paso 4)

```html
        <!-- ===== FORMULARIO: ENVÍA TU RECETA ===== -->
        <section class="form-receta-section scroll-reveal" id="enviar-receta">
            <h2>Envía tu receta</h2>
            <p class="form-receta-intro">
                ¿Tienes una receta que quieras compartir? Cuéntanos de qué se trata y súbenos una foto.
                La revisaremos antes de publicarla en el sitio.
            </p>

            <form id="formReceta" class="form-receta" action="php/enviar_receta.php" method="post" enctype="multipart/form-data">

                <div class="form-fila">
                    <div class="form-campo">
                        <label for="nombre">Nombre de la receta</label>
                        <input type="text" id="nombre" name="nombre" required minlength="3" maxlength="80" placeholder="Ej.: Ñoquis de la abuela" autocomplete="off">
                    </div>

                    <div class="form-campo">
                        <label for="categoria">Categoría</label>
                        <select id="categoria" name="categoria" required>
                            <option value="" disabled selected>Elige una categoría</option>
                            <option value="especialidad-casa">Especialidad de la casa</option>
                            <option value="pastas">Pastas</option>
                            <option value="carnes">Carnes</option>
                            <option value="ensaladas">Ensaladas</option>
                            <option value="postres">Postres</option>
                            <option value="tragos">Tragos</option>
                        </select>
                    </div>
                </div>

                <fieldset class="form-campo">
                    <legend>Tipo de receta</legend>
                    <p class="form-ayuda">Marca las que correspondan. Si es una receta común, no marques ninguna.</p>
                    <div class="form-chips">
                        <label class="form-chip"><input type="checkbox" name="tipos[]" value="vegetariana"><span>Vegetariana</span></label>
                        <label class="form-chip"><input type="checkbox" name="tipos[]" value="vegana"><span>Vegana</span></label>
                        <label class="form-chip"><input type="checkbox" name="tipos[]" value="sintacc"><span>Sin TACC</span></label>
                        <label class="form-chip"><input type="checkbox" name="tipos[]" value="sinlactosa"><span>Sin lactosa</span></label>
                        <label class="form-chip"><input type="checkbox" name="tipos[]" value="sinazucar"><span>Sin azúcar</span></label>
                        <label class="form-chip"><input type="checkbox" name="tipos[]" value="altasproteinas"><span>Altas en proteínas</span></label>
                    </div>
                </fieldset>

                <div class="form-campo">
                    <label for="imagen">Imagen de la receta</label>
                    <div class="form-imagen">
                        <input type="file" id="imagen" name="imagen" accept="image/jpeg,image/png,image/webp" required>
                        <label for="imagen" class="form-imagen-boton">Elegir imagen</label>
                        <span class="form-imagen-nombre" id="nombreArchivo">Ningún archivo seleccionado</span>
                        <img id="vistaPrevia" class="form-vista-previa" alt="Vista previa de la imagen elegida" hidden>
                    </div>
                    <p class="form-ayuda">Formatos JPG, PNG o WEBP. Máximo 5 MB.</p>
                </div>

                <div class="form-campo">
                    <label for="descripcion">Descripción (opcional)</label>
                    <textarea id="descripcion" name="descripcion" maxlength="500" placeholder="Cuéntanos un poco sobre la receta: ingredientes principales, de dónde viene, para qué ocasión es…"></textarea>
                    <span class="form-contador" id="contadorDescripcion">0 / 500</span>
                </div>

                <!-- Campo trampa para bots: dejar vacío -->
                <div class="form-trampa" aria-hidden="true">
                    <label for="sitio_web">No completar este campo</label>
                    <input type="text" id="sitio_web" name="sitio_web" tabindex="-1" autocomplete="off">
                </div>

                <div class="form-mensaje" id="formMensaje" role="status" aria-live="polite" hidden></div>

                <button type="submit" class="form-boton" id="formBoton">Enviar receta</button>
            </form>
        </section>
```
