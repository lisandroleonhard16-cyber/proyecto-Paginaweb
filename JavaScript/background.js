/**
 * BACKGROUND.JS
 * Genera la escena de fondo "salsa/crema" de Margarita Cocina:
 * dos haces de hebras de líquido satinado (esquina sup-izq y inf-der)
 * dibujadas como SVG inline con curvas Bézier, gradientes de volumen,
 * reflejo especular y morphing SMIL. Inserta un único
 * <div class="bg-scene" aria-hidden="true"> al inicio del <body>.
 *
 * Ajustes:
 *  - --bg-intensity (CSS): opacidad global de la escena.
 *  - --bg-speed (CSS): se lee aquí para acelerar/frenar las animaciones SMIL.
 *  - prefers-reduced-motion: fondo estático (sin <animate>).
 *  - Móvil (<=700px): 4 hebras por esquina y blur reducido.
 */
(function () {
    'use strict';

    if (document.querySelector('.bg-scene')) return;

    var REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var MOVIL = window.matchMedia('(max-width: 700px)').matches;

    var speed = parseFloat(getComputedStyle(document.documentElement)
        .getPropertyValue('--bg-speed')) || 1;
    if (!isFinite(speed) || speed <= 0) speed = 1;

    /* ===== Utilidades ===== */
    function mulberry(seed) {
        var s = seed >>> 0;
        return function () {
            s = (s + 0x6D2B79F5) >>> 0;
            var t = s;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    var rand = mulberry(20261116);
    var rr = function (a, b) { return a + rand() * (b - a); };

    /* Punto y tangente de una cúbica de Bézier en t */
    function bez(P0, P1, P2, P3, t) {
        var u = 1 - t;
        return {
            x: u * u * u * P0.x + 3 * u * u * t * P1.x + 3 * u * t * t * P2.x + t * t * t * P3.x,
            y: u * u * u * P0.y + 3 * u * u * t * P1.y + 3 * u * t * t * P2.y + t * t * t * P3.y
        };
    }
    function bezDer(P0, P1, P2, P3, t) {
        var u = 1 - t;
        return {
            x: 3 * u * u * (P1.x - P0.x) + 6 * u * t * (P2.x - P1.x) + 3 * t * t * (P3.x - P2.x),
            y: 3 * u * u * (P1.y - P0.y) + 6 * u * t * (P2.y - P1.y) + 3 * t * t * (P3.y - P2.y)
        };
    }

    /* Construye el path de una hebra: centroide cúbico muestreado,
       espesor que afina hasta punta (w0 en raíz → ~0 en la punta).
       Devuelve { main: [d1, d2], spec: [d1, d2] } (dos variantes para morph). */
    var N = 22;
    function hebra(cfg, variante) {
        var P0 = { x: cfg.x0, y: cfg.y0 };
        var P1 = { x: cfg.c1x, y: cfg.c1y };
        var P2 = { x: cfg.c2x, y: cfg.c2y };
        var P3 = { x: cfg.tx, y: cfg.ty };
        var w0 = cfg.w0;
        if (variante === 1 || variante === 2) {
            // Variante "latigazo": la perturbación crece hacia la punta,
            // como un tentáculo que azota — la raíz casi no se mueve.
            var j = function (fuerza) { return rr(-fuerza, fuerza); };
            var f1 = variante === 1 ? 9 : -9;
            var f2 = variante === 1 ? 16 : -16;
            var f3 = variante === 1 ? 26 : -26;
            P1.x += j(6 * (variante === 1 ? 1 : -1)); P1.y += j(6 * (variante === 1 ? 1 : -1));
            P2.x += j(f1); P2.y += j(f1);
            P3.x += j(f2); P3.y += j(f2);
            w0 *= 1 + (variante === 1 ? 0.06 : -0.06);
        }
        var up = [], lo = [];
        for (var i = 0; i <= N; i++) {
            var t = i / N;
            var p = bez(P0, P1, P2, P3, t);
            var d = bezDer(P0, P1, P2, P3, t);
            var len = Math.sqrt(d.x * d.x + d.y * d.y) || 1;
            var nx = -d.y / len, ny = d.x / len;
            var w = w0 * Math.pow(1 - t, 1.55) + 0.6;
            up.push((p.x + nx * w / 2).toFixed(1) + ',' + (p.y + ny * w / 2).toFixed(1));
            lo.push((p.x - nx * w / 2).toFixed(1) + ',' + (p.y - ny * w / 2).toFixed(1));
        }
        function poly(escala) {
            var u = [], l = [];
            // Re-muestreo con espesor escalado para el reflejo especular
            if (escala === 1) { u = up; l = lo; }
            else {
                for (var k = 0; k <= N; k++) {
                    var t2 = k / N;
                    var p2 = bez(P0, P1, P2, P3, t2);
                    var d2 = bezDer(P0, P1, P2, P3, t2);
                    var len2 = Math.sqrt(d2.x * d2.x + d2.y * d2.y) || 1;
                    var nx2 = -d2.y / len2, ny2 = d2.x / len2;
                    var w2 = (w0 * escala) * Math.pow(1 - t2, 1.55) + 0.4;
                    u.push((p2.x + nx2 * w2 / 2).toFixed(1) + ',' + (p2.y + ny2 * w2 / 2).toFixed(1));
                    l.push((p2.x - nx2 * w2 / 2).toFixed(1) + ',' + (p2.y - ny2 * w2 / 2).toFixed(1));
                }
            }
            return 'M' + u.join(' L') + ' L' + l.reverse().join(' L') + ' Z';
        }
        return { main: [poly(1), poly(1)], spec: [poly(0.34), poly(0.34)] };
    }

    /* Ojo: poly(1) con variante genera distinto d pero misma estructura.
       Para el morph necesito d1/d2 de la MISMA hebra: regenero. */
    function hebraPar(cfg) {
        var a = hebra(cfg, 0);
        var b = hebra(cfg, 1);
        var c = hebra(cfg, 2);
        // 3 poses: base → latigazo A → latigazo B → base (onda de tentáculo)
        return { main: [a.main[0], b.main[0], c.main[0], a.main[0]], spec: [a.spec[0], b.spec[0], c.spec[0], a.spec[0]] };
    }

    /* ===== Configuración de las hebras por esquina =====
       viewBox 1440x900. TL entra desde arriba/izquierda y se curva
       hacia el centro; BR desde abajo/derecha. Configs distintas
       (no espejo) para la asimetría. */
    function configsTL() {
        var c = [];
        var n = MOVIL ? 4 : 7;
        for (var i = 0; i < n; i++) {
            var desdeArriba = i % 2 === 0;
            var x0 = desdeArriba ? rr(10, 430) : rr(-15, 55);
            var y0 = desdeArriba ? rr(-15, 45) : rr(10, 400);
            // La punta termina ~55-65% de la pantalla: nunca invade el centro
            var tx = rr(470, 760), ty = rr(330, 580);
            var dx = tx - x0, dy = ty - y0;
            var largo = Math.sqrt(dx * dx + dy * dy);
            // Controles: bow perpendicular alternado → forma de S líquida
            var bow = largo * rr(0.14, 0.24) * (i % 3 === 0 ? -1 : 1);
            var ux = -dy / largo, uy = dx / largo;
            c.push({
                x0: x0, y0: y0, tx: tx, ty: ty,
                c1x: x0 + dx * 0.3 + ux * bow * 0.7, c1y: y0 + dy * 0.3 + uy * bow * 0.7,
                c2x: x0 + dx * 0.7 - ux * bow * 0.5, c2y: y0 + dy * 0.7 - uy * bow * 0.5,
                w0: rr(15, 32) * (MOVIL ? 0.7 : 1) * (desdeArriba ? 1 : 0.8),
                color: i === 2 || i === 5 ? 'magenta' : (i >= n - 2 ? 'gold' : 'peach'),
                dur: rr(13, 24), del: -rr(0, 30), rim: rr(0.25, 0.45)
            });
        }
        return c;
    }
    function configsBR() {
        var c = [];
        var n = MOVIL ? 4 : 6;
        for (var i = 0; i < n; i++) {
            var desdeDer = i % 2 === 0;
            var x0 = desdeDer ? rr(1390, 1455) : rr(980, 1440);
            var y0 = desdeDer ? rr(500, 910) : rr(855, 915);
            var tx = rr(680, 970), ty = rr(320, 570);
            var dx = tx - x0, dy = ty - y0;
            var largo = Math.sqrt(dx * dx + dy * dy);
            var bow = largo * rr(0.13, 0.22) * (i % 3 === 1 ? -1 : 1);
            var ux = -dy / largo, uy = dx / largo;
            c.push({
                x0: x0, y0: y0, tx: tx, ty: ty,
                c1x: x0 + dx * 0.3 + ux * bow * 0.6, c1y: y0 + dy * 0.3 + uy * bow * 0.6,
                c2x: x0 + dx * 0.7 - ux * bow * 0.55, c2y: y0 + dy * 0.7 - uy * bow * 0.55,
                w0: rr(13, 28) * (MOVIL ? 0.7 : 1) * (desdeDer ? 1 : 0.85),
                color: i === 1 || i === 4 ? 'magenta' : (i === n - 1 ? 'gold' : 'peach'),
                dur: rr(14, 25), del: -rr(0, 30), rim: rr(0.25, 0.45)
            });
        }
        return c;
    }

    /* ===== Gradientes de volumen por hebra ===== */
    var FAMILIAS = {
        peach:   ['#c96a3f', '#fff1de', '#ffcf9e', '#e8804f'],
        magenta: ['#8f0b4e', '#ffd9ec', '#ff5cb4', '#d6106f'],
        gold:    ['#8a4d00', '#fff3c4', '#ffd257', '#ff9d00']
    };
    function gradDef(id, cfg) {
        var f = FAMILIAS[cfg.color];
        // userSpaceOnUse raíz→punta: oscuro → casi blanco → saturado
        var x1 = cfg.x0.toFixed(0), y1 = cfg.y0.toFixed(0);
        var x2 = cfg.tx.toFixed(0), y2 = cfg.ty.toFixed(0);
        return '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' +
            '<stop offset="0" stop-color="' + f[0] + '"/>' +
            '<stop offset="0.38" stop-color="' + f[1] + '"/>' +
            '<stop offset="0.72" stop-color="' + f[2] + '"/>' +
            '<stop offset="1" stop-color="' + f[3] + '"/></linearGradient>' +
            '<linearGradient id="' + id + 's" gradientUnits="userSpaceOnUse" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' +
            '<stop offset="0" stop-color="#fff" stop-opacity="0.85"/>' +
            '<stop offset="0.5" stop-color="#fff" stop-opacity="0.55"/>' +
            '<stop offset="1" stop-color="#fff" stop-opacity="0.15"/></linearGradient>';
    }

    function grupoSVG(configs, prefijo) {
        var paths = '';
        configs.forEach(function (cfg, i) {
            var id = prefijo + i;
            var par = hebraPar(cfg);
            var dur = (cfg.dur / speed).toFixed(2) + 's';
            var del = (cfg.del / speed).toFixed(2) + 's';
            var posesM = par.main.join(';');
            var posesS = par.spec.join(';');
            var anim = REDUCIDO ? '' :
                '<animate attributeName="d" values="' + posesM + '" ' +
                'dur="' + dur + '" begin="' + del + '" repeatCount="indefinite" ' +
                'calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"/>';
            var animS = REDUCIDO ? '' :
                '<animate attributeName="d" values="' + posesS + '" ' +
                'dur="' + dur + '" begin="' + del + '" repeatCount="indefinite" ' +
                'calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"/>';
            paths += '<path d="' + par.main[0] + '" fill="url(#' + id + ')" stroke="rgba(255,120,50,' + cfg.rim.toFixed(2) + ')" stroke-width="1.1">' + anim + '</path>';
            // Filamento especular: hebra más fina y casi blanca = satén
            paths += '<path d="' + par.spec[0] + '" fill="url(#' + id + 's)" opacity="0.85">' + animS + '</path>';
        });
        return paths;
    }

    /* ===== Escena ===== */
    var escena = document.createElement('div');
    escena.className = 'bg-scene';
    escena.setAttribute('aria-hidden', 'true');

    var blur = MOVIL ? 7 : 14;
    var tl = configsTL(), br = configsBR();

    function defsDe(configs, pref) {
        return configs.map(function (cfg, i) {
            return gradDef(pref + i, cfg);
        }).join('');
    }

    var svg =
        '<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
            '<filter id="fGlow" x="-30%" y="-30%" width="160%" height="160%">' +
                '<feGaussianBlur stdDeviation="' + blur + '" result="b"/>' +
                '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
            '</filter>' +
            defsDe(tl, 'gt') + defsDe(br, 'gb') +
        '</defs>' +
        '<g class="haz haz-tl" filter="url(#fGlow)">' + grupoSVG(tl, 'gt') + '</g>' +
        '<g class="haz haz-br" filter="url(#fGlow)">' + grupoSVG(br, 'gb') + '</g>' +
        '</svg>';

    escena.innerHTML =
        '<div class="bg-corner tl"></div>' +
        '<div class="bg-corner br"></div>' +
        svg +
        '<div class="bg-dim"></div>' +
        '<div class="grain"></div>';

    document.body.prepend(escena);
})();
