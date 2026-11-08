<?php
/**
 * auth.php
 * Sesiones y usuarios del sitio. Los usuarios se guardan en
 * data/usuarios.json (protegido por data/.htaccess) con la contraseña hasheada.
 */
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function rutaUsuarios(): string
{
    return dirname(__DIR__) . '/data/usuarios.json';
}

function cargarUsuarios(): array
{
    $archivo = rutaUsuarios();

    if (!is_file($archivo)) {
        // Primera ejecución: se crea el usuario administrador inicial.
        $usuarios = [
            'admin' => [
                'hash' => password_hash('admin', PASSWORD_DEFAULT),
                'rol'  => 'admin',
            ],
        ];
        guardarUsuarios($usuarios);
        return $usuarios;
    }

    $datos = json_decode((string) file_get_contents($archivo), true);
    return is_array($datos) ? $datos : [];
}

function guardarUsuarios(array $usuarios): bool
{
    $archivo = rutaUsuarios();
    $dir     = dirname($archivo);

    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        return false;
    }

    $gestor = fopen($archivo, 'c+');
    if ($gestor === false || !flock($gestor, LOCK_EX)) {
        return false;
    }

    ftruncate($gestor, 0);
    rewind($gestor);
    $ok = fwrite($gestor, json_encode($usuarios, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;

    fflush($gestor);
    flock($gestor, LOCK_UN);
    fclose($gestor);
    return $ok;
}

/** Usuario logueado: ['usuario' => nombre, 'rol' => 'usuario'|'admin'] o null. */
function usuarioActual(): ?array
{
    if (empty($_SESSION['usuario']) || empty($_SESSION['rol'])) {
        return null;
    }
    return ['usuario' => (string) $_SESSION['usuario'], 'rol' => (string) $_SESSION['rol']];
}

function esAdmin(): bool
{
    $u = usuarioActual();
    return $u !== null && $u['rol'] === 'admin';
}
