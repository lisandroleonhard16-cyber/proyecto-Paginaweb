<?php
/**
 * logout.php
 * Cierra la sesión actual. Responde en JSON.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

header('Content-Type: application/json; charset=utf-8');

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}
session_destroy();

// Con ?volver=1 redirige al sitio en vez de responder JSON (para enlaces normales).
if (isset($_GET['volver'])) {
    header('Location: ../contacto.html');
    exit;
}

echo json_encode(['ok' => true, 'mensaje' => 'Sesión cerrada.'], JSON_UNESCAPED_UNICODE);
