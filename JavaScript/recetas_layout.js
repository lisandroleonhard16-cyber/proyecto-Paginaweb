/**
 * RECETAS_LAYOUT.JS
 * Intercambia la receta clickeada con el banner "Receta estrella de la semana".
 *  - Al hacer clic en una tarjeta: sube al lugar del banner y recién ahí se abre.
 *  - Al hacer clic en su cabecera de nuevo: se cierra pero QUEDA ARRIBA
 *    (el banner no vuelve a aparecer).
 *  - Al hacer clic en otra tarjeta: la anterior vuelve a su lugar en la grilla
 *    y la nueva toma su lugar arriba.
 * Requiere en el HTML: .hero-receta, #receta-activa y .lista-recetas
 */
(function () {
    const hero = document.querySelector('.hero-receta');
    const slot = document.getElementById('receta-activa');
    const lista = document.querySelector('.lista-recetas');
    if (!slot || !lista) return;

    let activa = null;     // <details> que está arriba ahora
    let marcador = null;   // lugar original de esa receta en la grilla

    function devolver() {
        if (!activa) return;
        activa.open = false;
        marcador.parentNode.insertBefore(activa, marcador);
        marcador.remove();
        activa = null;
        marcador = null;
    }

    function activar(det) {
        if (!det || activa === det) return;
        devolver();
        marcador = document.createComment('lugar de la receta');
        det.parentNode.insertBefore(marcador, det);
        slot.appendChild(det);
        activa = det;
        if (hero) hero.hidden = true;
        det.open = true;
        slot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Clic en la cabecera de cualquier receta
    document.addEventListener('click', function (e) {
        const resumen = e.target.closest('details.receta > summary');
        if (!resumen) return;
        e.preventDefault(); // evita que se abra en su lugar dentro de la grilla
        const det = resumen.parentElement;
        if (det === activa) {
            det.open = !det.open; // abre/cierra sin moverla de arriba
        } else {
            activar(det);
        }
    });

    // Clic en el banner: abre la receta destacada
    if (hero) {
        const enlace = hero.querySelector('a[href^="#"]');
        if (enlace) {
            enlace.addEventListener('click', function (e) {
                e.preventDefault();
                activar(document.getElementById(enlace.getAttribute('href').slice(1)));
            });
        }
    }

    // Enlaces externos con #hash (ej.: desde el index o el buscador)
    function abrirDesdeHash() {
        const id = window.location.hash.substring(1);
        if (!id) return;
        const el = document.getElementById(id);
        if (el && el.tagName === 'DETAILS') activar(el);
    }
    window.addEventListener('DOMContentLoaded', abrirDesdeHash);
    window.addEventListener('hashchange', abrirDesdeHash);
})();
