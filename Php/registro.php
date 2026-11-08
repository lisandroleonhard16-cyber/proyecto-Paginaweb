<?php
/**
 * registro.php
 * Crea una cuenta de usuario. Recibe POST con `usuario`, `contrasena`
 * y `confirmar` (formulario urlencoded o JSON). Responde en JSON.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function fallo(string $mensaje, int $codigo = 422): never
{
    http_response_code($codigo);
    echo json_encode(['ok' => false, 'mensaje' => $mensaje], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fallo('Método no permitido.', 405);
}

$entrada = $_POST;
if (empty($entrada)) {
    $cuerpo = json_decode((string) file_get_contents('php://input'), true);
    if (is_array($cuerpo)) {
        $entrada = $cuerpo;
    }
}

$usuario = trim((string) ($entrada['usuario'] ?? ''));
$contrasena = (string) ($entrada['contrasena'] ?? '');
$confirmar = (string) ($entrada['confirmar'] ?? '');

if (!preg_match('/^[a-zA-Z0-9._-]{3,30}$/', $usuario)) {
    fallo('El usuario debe tener entre 3 y 30 caracteres: letras, números, punto, guion o guion bajo.');
}
if (mb_strlen($contrasena) < 6) {
    fallo('La contraseña debe tener al menos 6 caracteres.');
}
if ($contrasena !== $confirmar) {
    fallo('Las contraseñas no coinciden.');
}

$usuarios = cargarUsuarios();
if (isset($usuarios[$usuario])) {
    fallo('Ese nombre de usuario ya está en uso.', 409);
}

$usuarios[$usuario] = [
    'hash' => password_hash($contrasena, PASSWORD_DEFAULT),
    'rol'  => 'usuario',
];

if (!guardarUsuarios($usuarios)) {
    fallo('No se pudo guardar la cuenta. Intenta de nuevo.', 500);
}

// La cuenta queda iniciada automáticamente.
session_regenerate_id(true);
$_SESSION['usuario'] = $usuario;
$_SESSION['rol'] = 'usuario';

echo json_encode([
    'ok'      => true,
    'mensaje' => '¡Cuenta creada! Ya puedes enviar tu receta.',
    'usuario' => $usuario,
    'rol'     => 'usuario',
], JSON_UNESCAPED_UNICODE);
