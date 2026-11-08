<?php
/**
 * admin.php
 * Panel del administrador: revisar las recetas enviadas por los usuarios,
 * aprobarlas, rechazarlas o eliminarlas. Solo accesible con la cuenta "admin".
 *
 * - Pestañas por estado (pendiente / aprobada / rechazada) con contadores
 *   y paginación de 20, de la más reciente a la más antigua.
 * - Todas las acciones son POST con token CSRF.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

$raiz        = dirname(__DIR__);
$archivoJson = $raiz . '/data/recetas_pendientes.json';

if (!esAdmin()) {
    http_response_code(403);
    exit('Acceso denegado. Inicia sesión como administrador.');
}

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

const POR_PAGINA = 20;
const ESTADOS    = ['pendiente', 'aprobada', 'rechazada'];

function leerRecetas(string $archivo): array
{
    if (!is_file($archivo)) {
        return [];
    }
    $datos = json_decode((string) file_get_contents($archivo), true);
    return is_array($datos) ? $datos : [];
}

function escribirRecetas(string $archivo, array $lista): bool
{
    $gestor = fopen($archivo, 'c+');
    if ($gestor === false || !flock($gestor, LOCK_EX)) {
        return false;
    }
    ftruncate($gestor, 0);
    rewind($gestor);
    $ok = fwrite($gestor, json_encode($lista, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) !== false;
    fflush($gestor);
    flock($gestor, LOCK_UN);
    fclose($gestor);
    return $ok;
}

/**
 * Borra la imagen de una receta de forma segura: solo rutas
 * uploads/pendientes/ o uploads/aprobadas/, sin subcarpetas ni traversal.
 */
function borrarImagenReceta(string $raiz, string $rel): void
{
    $rel = str_replace('\\', '/', $rel);
    // Tras normalizar '\' a '/', basta con exigir que no haya más '/'.
    if (!preg_match('#^uploads/(pendientes|aprobadas)/[^/]+$#', $rel)) {
        return;
    }
    $abs = $raiz . '/' . $rel;
    if (is_file($abs)) {
        @unlink($abs);
    }
}

function e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}

/* ===== TOKEN CSRF ===== */
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrf = $_SESSION['csrf_token'];

/* ===== ACCIONES (solo POST + CSRF) ===== */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = (string) ($_POST['accion'] ?? '');
    $volver  = 'admin.php?estado=' . preg_replace('/[^a-z]/', '', (string) ($_POST['volver_estado'] ?? 'pendiente'));

    $csrfOk = isset($_POST['csrf']) && is_string($_POST['csrf'])
        && hash_equals($csrf, $_POST['csrf']);
    if (!$csrfOk) {
        http_response_code(403);
        exit('Solicitud no válida (CSRF).');
    }

    $lista = leerRecetas($archivoJson);

    if ($accion === 'vaciar_rechazadas') {
        $quedan   = [];
        $borradas = 0;
        foreach ($lista as $r) {
            if (($r['estado'] ?? '') === 'rechazada') {
                borrarImagenReceta($raiz, (string) ($r['imagen'] ?? ''));
                $borradas++;
            } else {
                $quedan[] = $r;
            }
        }
        escribirRecetas($archivoJson, $quedan);
        $_SESSION['admin_msg'] = "Se eliminaron $borradas recetas rechazadas.";
        header('Location: admin.php?estado=rechazada');
        exit;
    }

    $id     = (string) ($_POST['id'] ?? '');
    $indice = null;
    foreach ($lista as $i => $r) {
        if (($r['id'] ?? '') === $id) {
            $indice = $i;
            break;
        }
    }

    if ($indice === null) {
        $_SESSION['admin_msg'] = 'Receta no encontrada.';
    } elseif ($accion === 'aprobar' && ($lista[$indice]['estado'] ?? '') === 'pendiente') {
        // La imagen pasa de uploads/pendientes/ a uploads/aprobadas/.
        $rel = (string) ($lista[$indice]['imagen'] ?? '');
        if (str_starts_with($rel, 'uploads/pendientes/')) {
            $nombreArchivo = basename($rel);
            $dirAprobadas  = $raiz . '/uploads/aprobadas';
            if (!is_dir($dirAprobadas)) {
                mkdir($dirAprobadas, 0755, true);
            }
            $origen  = $raiz . '/' . $rel;
            $destino = $dirAprobadas . '/' . $nombreArchivo;
            if (is_file($origen) && @rename($origen, $destino)) {
                $lista[$indice]['imagen'] = 'uploads/aprobadas/' . $nombreArchivo;
            }
        }
        $lista[$indice]['estado'] = 'aprobada';
        $lista[$indice]['revisada_por'] = $_SESSION['usuario'];
        $lista[$indice]['fecha_revision'] = date('c');
        escribirRecetas($archivoJson, $lista);
        $_SESSION['admin_msg'] = 'Receta aprobada.';
        $volver = 'admin.php?estado=aprobada';
    } elseif ($accion === 'rechazar' && ($lista[$indice]['estado'] ?? '') === 'pendiente') {
        // La imagen se conserva: se borra recién al eliminar la receta.
        $lista[$indice]['estado'] = 'rechazada';
        $lista[$indice]['revisada_por'] = $_SESSION['usuario'];
        $lista[$indice]['fecha_revision'] = date('c');
        escribirRecetas($archivoJson, $lista);
        $_SESSION['admin_msg'] = 'Receta rechazada.';
        $volver = 'admin.php?estado=rechazada';
    } elseif ($accion === 'eliminar') {
        $estado = (string) ($lista[$indice]['estado'] ?? '');
        borrarImagenReceta($raiz, (string) ($lista[$indice]['imagen'] ?? ''));
        array_splice($lista, $indice, 1);
        escribirRecetas($archivoJson, $lista);
        $_SESSION['admin_msg'] = 'Receta eliminada.';
        $volver = 'admin.php?estado=' . (in_array($estado, ESTADOS, true) ? $estado : 'pendiente');
    } else {
        $_SESSION['admin_msg'] = 'Acción no válida.';
    }

    header('Location: ' . $volver);
    exit;
}

// Mensaje flash tras redirigir.
$mensaje = (string) ($_SESSION['admin_msg'] ?? '');
unset($_SESSION['admin_msg']);

/* ===== DATOS PARA LAS PESTAÑAS ===== */
$lista = leerRecetas($archivoJson);

$estadoActual = (string) ($_GET['estado'] ?? 'pendiente');
if (!in_array($estadoActual, ESTADOS, true)) {
    $estadoActual = 'pendiente';
}

$porEstado = ['pendiente' => [], 'aprobada' => [], 'rechazada' => []];
foreach ($lista as $r) {
    $est = (string) ($r['estado'] ?? 'pendiente');
    if (isset($porEstado[$est])) {
        $porEstado[$est][] = $r;
    }
}

// Dentro de cada pestaña: más reciente primero.
usort($porEstado['pendiente'], fn($a, $b) => strcmp((string) ($b['fecha'] ?? ''), (string) ($a['fecha'] ?? '')));
usort($porEstado['aprobada'],    fn($a, $b) => strcmp((string) ($b['fecha'] ?? ''), (string) ($a['fecha'] ?? '')));
usort($porEstado['rechazada'],  fn($a, $b) => strcmp((string) ($b['fecha'] ?? ''), (string) ($a['fecha'] ?? '')));

$totalEstado = count($porEstado[$estadoActual]);
$paginas     = max(1, (int) ceil($totalEstado / POR_PAGINA));
$pagina      = max(1, min((int) ($_GET['pagina'] ?? 1), $paginas));
$recetas     = array_slice($porEstado[$estadoActual], ($pagina - 1) * POR_PAGINA, POR_PAGINA);

$estadoClass = ['pendiente' => 'pendiente', 'aprobada' => 'aprobada', 'rechazada' => 'rechazada'];
$estadoTexto = ['pendiente' => 'Pendiente', 'aprobada' => 'Aprobada', 'rechazada' => 'Rechazada'];
$estadoPlural = ['pendiente' => 'pendientes', 'aprobada' => 'aprobadas', 'rechazada' => 'rechazadas'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de administración - Margarita Cocina</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: Arial, sans-serif;
            background-color: #141414;
            color: #eee;
            min-height: 100vh;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 30px;
            border-bottom: 2px solid rgb(212, 175, 55);
        }
        header h1 { font-family: Georgia, serif; color: rgb(212, 175, 55); font-size: 24px; }
        header a { color: #ccc; text-decoration: none; font-size: 14px; }
        header a:hover { color: rgb(212, 175, 55); }
        main { max-width: 1100px; margin: 0 auto; padding: 30px 20px 60px; }
        h2 { font-family: Georgia, serif; color: rgb(212, 175, 55); margin-bottom: 20px; }
        .mensaje {
            padding: 12px 16px;
            margin-bottom: 20px;
            border-radius: 10px;
            background: rgba(212, 175, 55, 0.15);
            border: 2px solid rgb(212, 175, 55);
        }
        .vacio { color: #aaa; text-align: center; padding: 40px 0; }

        /* ===== PESTAÑAS ===== */
        .pestanas {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 24px;
            align-items: center;
        }
        .pestana {
            padding: 10px 22px;
            border: 2px solid rgba(212, 175, 55, 0.5);
            border-radius: 25px;
            background: rgba(30, 30, 30, 0.95);
            color: #ccc;
            font-weight: bold;
            font-size: 14px;
            text-decoration: none;
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        .pestana:hover { border-color: rgb(212, 175, 55); color: white; }
        .pestana.activa {
            background-color: rgb(212, 175, 55);
            border-color: rgb(212, 175, 55);
            color: black;
        }
        .pestana .contador {
            display: inline-block;
            margin-left: 6px;
            padding: 1px 9px;
            border-radius: 12px;
            background: rgba(212, 175, 55, 0.2);
            color: rgb(212, 175, 55);
            font-size: 12px;
        }
        .pestana.activa .contador {
            background: rgba(0, 0, 0, 0.25);
            color: black;
        }
        .vaciar {
            margin-left: auto;
            padding: 8px 16px;
            border: 2px solid #c0392b;
            border-radius: 10px;
            background: transparent;
            color: #ff9d9d;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
        }
        .vaciar:hover { background: rgba(192, 57, 43, 0.2); }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px;
        }
        .tarjeta {
            background: rgba(30, 30, 30, 0.95);
            border: 2px solid rgba(212, 175, 55, 0.5);
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .tarjeta img { width: 100%; height: 200px; object-fit: cover; display: block; background: #1c1c1c; }
        .tarjeta-cuerpo { padding: 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .tarjeta h3 { font-family: Georgia, serif; color: white; font-size: 20px; }
        .meta { font-size: 13px; color: #bbb; }
        .meta strong { color: rgb(212, 175, 55); }
        .estado {
            align-self: flex-start;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .estado.pendiente { background: rgba(212, 175, 55, 0.2); color: rgb(212, 175, 55); border: 1px solid rgb(212, 175, 55); }
        .estado.aprobada { background: rgba(60, 160, 80, 0.25); color: #7fd08a; border: 1px solid #4caf50; }
        .estado.rechazada { background: rgba(180, 40, 40, 0.25); color: #ff9d9d; border: 1px solid #c0392b; }
        .descripcion { font-size: 14px; color: #ccc; line-height: 1.5; flex: 1; }
        .acciones { display: flex; gap: 10px; padding: 0 18px 18px; }
        .acciones form { flex: 1; }
        .acciones button {
            width: 100%;
            padding: 10px;
            border-radius: 10px;
            border: 2px solid rgb(212, 175, 55);
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
        }
        .btn-aprobar { background: rgb(212, 175, 55); color: black; }
        .btn-rechazar { background: transparent; color: #ff9d9d; border-color: #c0392b; }
        .btn-rechazar:hover { background: rgba(192, 57, 43, 0.2); }
        .btn-eliminar { background: rgb(152, 9, 9); border-color: rgb(152, 9, 9); color: white; }
        .btn-eliminar:hover { background: #a50c0c; }

        /* ===== PAGINACIÓN ===== */
        .paginacion {
            display: flex;
            gap: 8px;
            justify-content: center;
            align-items: center;
            margin-top: 32px;
            flex-wrap: wrap;
        }
        .paginacion a, .paginacion span {
            padding: 8px 14px;
            border: 2px solid rgba(212, 175, 55, 0.5);
            border-radius: 10px;
            color: #ccc;
            text-decoration: none;
            font-size: 14px;
            font-weight: bold;
        }
        .paginacion a:hover { border-color: rgb(212, 175, 55); color: white; }
        .paginacion .actual {
            background-color: rgb(212, 175, 55);
            border-color: rgb(212, 175, 55);
            color: black;
        }
        .paginacion .info { border: none; color: #888; }
    </style>
</head>
<body>
    <header>
        <h1>Panel de administración</h1>
        <div>
            <a href="../contacto.html">← Volver al sitio</a>
            &nbsp;|&nbsp;
            <a href="logout.php?volver=1">Cerrar sesión</a>
        </div>
    </header>

    <main>
        <h2>Recetas enviadas (<?= count($lista) ?>)</h2>

        <?php if ($mensaje !== ''): ?>
            <p class="mensaje"><?= e($mensaje) ?></p>
        <?php endif; ?>

        <nav class="pestanas">
            <?php foreach (ESTADOS as $est): ?>
                <a class="pestana <?= $est === $estadoActual ? 'activa' : '' ?>"
                   href="admin.php?estado=<?= $est ?>">
                    <?= e(ucfirst($estadoTexto[$est])) ?>s
                    <span class="contador"><?= count($porEstado[$est]) ?></span>
                </a>
            <?php endforeach; ?>

            <?php if ($estadoActual === 'rechazada' && count($porEstado['rechazada']) > 0): ?>
                <form method="post" class="vaciar-form"
                      onsubmit="return confirm('¿Eliminar TODAS las recetas rechazadas? Se borrarán también sus imágenes.');">
                    <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
                    <input type="hidden" name="accion" value="vaciar_rechazadas">
                    <button type="submit" class="vaciar">Vaciar rechazadas</button>
                </form>
            <?php endif; ?>
        </nav>

        <?php if (empty($recetas)): ?>
            <p class="vacio">No hay recetas <?= e($estadoPlural[$estadoActual]) ?>.</p>
        <?php else: ?>
            <div class="grid">
                <?php foreach ($recetas as $r): ?>
                    <?php
                    $id = (string) ($r['id'] ?? '');
                    $estado = (string) ($r['estado'] ?? 'pendiente');
                    $tipos = array_map(
                        fn($t) => TIPOS[$t] ?? $t,
                        array_values((array) ($r['tipos'] ?? []))
                    );
                    $imgRel = (string) ($r['imagen'] ?? '');
                    $imgOk  = $imgRel !== '' && is_file($raiz . '/' . $imgRel);
                    ?>
                    <article class="tarjeta">
                        <?php if ($imgOk): ?>
                            <img src="../<?= e($imgRel) ?>" alt="<?= e($r['nombre'] ?? '') ?>">
                        <?php endif; ?>
                        <div class="tarjeta-cuerpo">
                            <h3><?= e($r['nombre'] ?? '') ?></h3>
                            <span class="estado <?= e($estadoClass[$estado] ?? 'pendiente') ?>">
                                <?= e($estadoTexto[$estado] ?? $estado) ?>
                            </span>
                            <p class="meta">
                                <strong><?= e(CATEGORIAS[$r['categoria'] ?? ''] ?? ($r['categoria'] ?? '')) ?></strong>
                                · Enviada por <strong><?= e($r['autor'] ?? 'desconocido') ?></strong>
                                · <?= e(date('d/m/Y H:i', strtotime((string) ($r['fecha'] ?? 'now')))) ?>
                            </p>
                            <?php if (!empty($tipos)): ?>
                                <p class="meta">Tipos: <?= e(implode(', ', $tipos)) ?></p>
                            <?php endif; ?>
                            <?php if (!empty($r['descripcion'])): ?>
                                <p class="descripcion"><?= e($r['descripcion']) ?></p>
                            <?php endif; ?>
                            <?php if (!empty($r['revisada_por'])): ?>
                                <p class="meta">Revisada por <?= e($r['revisada_por']) ?> el <?= e(date('d/m/Y H:i', strtotime((string) ($r['fecha_revision'] ?? 'now')))) ?></p>
                            <?php endif; ?>
                        </div>
                        <div class="acciones">
                            <?php if ($estado === 'pendiente'): ?>
                                <form method="post">
                                    <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
                                    <input type="hidden" name="volver_estado" value="<?= e($estadoActual) ?>">
                                    <input type="hidden" name="id" value="<?= e($id) ?>">
                                    <input type="hidden" name="accion" value="aprobar">
                                    <button type="submit" class="btn-aprobar">Aprobar</button>
                                </form>
                                <form method="post" onsubmit="return confirm('¿Rechazar esta receta?');">
                                    <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
                                    <input type="hidden" name="volver_estado" value="<?= e($estadoActual) ?>">
                                    <input type="hidden" name="id" value="<?= e($id) ?>">
                                    <input type="hidden" name="accion" value="rechazar">
                                    <button type="submit" class="btn-rechazar">Rechazar</button>
                                </form>
                            <?php endif; ?>
                            <form method="post"
                                  onsubmit="return confirm('<?= $estado === 'aprobada' ? '¿Eliminar esta receta? Dejará de verse en el sitio.' : '¿Eliminar esta receta?' ?>');">
                                <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
                                <input type="hidden" name="volver_estado" value="<?= e($estadoActual) ?>">
                                <input type="hidden" name="id" value="<?= e($id) ?>">
                                <input type="hidden" name="accion" value="eliminar">
                                <button type="submit" class="btn-eliminar">Eliminar</button>
                            </form>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>

            <?php if ($paginas > 1): ?>
                <nav class="paginacion">
                    <?php if ($pagina > 1): ?>
                        <a href="admin.php?estado=<?= e($estadoActual) ?>&pagina=<?= $pagina - 1 ?>">← Anterior</a>
                    <?php endif; ?>
                    <span class="info">Página <?= $pagina ?> de <?= $paginas ?></span>
                    <?php if ($pagina < $paginas): ?>
                        <a href="admin.php?estado=<?= e($estadoActual) ?>&pagina=<?= $pagina + 1 ?>">Siguiente →</a>
                    <?php endif; ?>
                </nav>
            <?php endif; ?>
        <?php endif; ?>
    </main>
</body>
</html>
