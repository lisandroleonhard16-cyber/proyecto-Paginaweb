<?php
/**
 * sesion.php
 * Devuelve el usuario con sesión iniciada (o null). GET en JSON.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$u = usuarioActual();

echo json_encode([
    'ok'      => true,
    'usuario' => $u ? ['nombre' => $u['usuario'], 'rol' => $u['rol']] : null,
], JSON_UNESCAPED_UNICODE);
