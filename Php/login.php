<?php
/**
 * login.php
 * Inicia sesión. Recibe POST con `usuario` y `contrasena`
 * (formulario urlencoded o JSON). Responde en JSON.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'mensaje' => 'Método no permitido.']);
    exit;
}

// Límite de intentos fallidos por sesión (fuerza bruta básica).
$intentos = (int) ($_SESSION['intentos_login'] ?? 0);
if ($intentos >= 5) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'mensaje' => 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.']);
    exit;
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

$usuarios = cargarUsuarios();

if (!isset($usuarios[$usuario]) || !password_verify($contrasena, $usuarios[$usuario]['hash'])) {
    $_SESSION['intentos_login'] = $intentos + 1;
    http_response_code(401);
    echo json_encode(['ok' => false, 'mensaje' => 'Usuario o contraseña incorrectos.']);
    exit;
}

session_regenerate_id(true);
$_SESSION['usuario'] = $usuario;
$_SESSION['rol'] = $usuarios[$usuario]['rol'];
unset($_SESSION['intentos_login']);

echo json_encode([
    'ok'      => true,
    'mensaje' => 'Sesión iniciada.',
    'usuario' => $usuario,
    'rol'     => $usuarios[$usuario]['rol'],
], JSON_UNESCAPED_UNICODE);
