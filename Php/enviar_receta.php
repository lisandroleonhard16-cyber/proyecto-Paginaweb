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

require_once __DIR__ . '/auth.php';
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

// Solo usuarios registrados pueden enviar recetas.
$usuario = usuarioActual();
if ($usuario === null) {
    responder(false, 'Debes iniciar sesión o crear una cuenta para enviar una receta.', 401);
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
    'autor'       => $usuario['usuario'],
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
