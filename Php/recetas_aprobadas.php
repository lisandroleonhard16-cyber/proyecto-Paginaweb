<?php
/**
 * recetas_aprobadas.php
 * Endpoint público de solo lectura: devuelve en JSON las recetas
 * aprobadas por el administrador, solo con los campos necesarios
 * para mostrarlas en el sitio. Nada de fechas internas ni datos
 * de usuarios más allá del autor público.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$archivo = dirname(__DIR__) . '/data/recetas_pendientes.json';

$lista = [];
if (is_file($archivo)) {
    $datos = json_decode((string) file_get_contents($archivo), true);
    if (is_array($datos)) {
        $lista = $datos;
    }
}

$publicas = [];
foreach ($lista as $r) {
    if (($r['estado'] ?? '') !== 'aprobada') {
        continue;
    }
    $publicas[] = [
        'id'          => (string) ($r['id'] ?? ''),
        'nombre'      => (string) ($r['nombre'] ?? ''),
        'categoria'   => (string) ($r['categoria'] ?? ''),
        'tipos'       => array_values(array_map('strval', (array) ($r['tipos'] ?? []))),
        'descripcion' => (string) ($r['descripcion'] ?? ''),
        'imagen'      => (string) ($r['imagen'] ?? ''),
        'autor'       => (string) ($r['autor'] ?? ''),
    ];
}

echo json_encode($publicas, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
