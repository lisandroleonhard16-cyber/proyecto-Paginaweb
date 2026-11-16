/**
 * EMOJI-GLOW.JS
 * Envuelve los emojis presentes en nodos de texto con
 * <span class="emoji-glow"> para aplicarles el brillo dorado
 * definido en theme.css (.emoji-glow).
 *
 * - Ignora <script>, <style>, <noscript>, <textarea>, <input>,
 *   <select>, <option>, <svg> y nodos ya procesados.
 * - Observa el DOM con MutationObserver para cubrir contenido
 *   cargado dinámicamente (p. ej. recetas aprobadas por JS).
 * No modifica lógica existente: solo transforma nodos de texto.
 */
(function () {
    'use strict';

    // Secuencias de emoji: pictograma + variation selector / ZWJ encadenados.
    var RE_EMOJI = /(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)/gu;

    var SELECTOR_SKIP = 'script,style,noscript,textarea,input,select,option,svg,.emoji-glow';

    function esSaltable(nodo) {
        var el = nodo.parentElement;
        return !el || el.closest(SELECTOR_SKIP) !== null;
    }

    function envolverEmojis(nodoTexto) {
        var texto = nodoTexto.nodeValue;
        if (!texto || !RE_EMOJI.test(texto)) {
            RE_EMOJI.lastIndex = 0;
            return;
        }
        RE_EMOJI.lastIndex = 0;

        var frag = document.createDocumentFragment();
        var ultimo = 0;
        var m;
        while ((m = RE_EMOJI.exec(texto)) !== null) {
            if (m.index > ultimo) {
                frag.appendChild(document.createTextNode(texto.slice(ultimo, m.index)));
            }
            var span = document.createElement('span');
            span.className = 'emoji-glow';
            span.textContent = m[0];
            frag.appendChild(span);
            ultimo = m.index + m[0].length;
        }
        if (ultimo < texto.length) {
            frag.appendChild(document.createTextNode(texto.slice(ultimo)));
        }
        nodoTexto.parentNode.replaceChild(frag, nodoTexto);
    }

    function procesar(root) {
        if (!root || root.nodeType !== 1) return;
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                return esSaltable(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
        });
        // Recolectar primero: replaceChild invalida el walker en vivo.
        var nodos = [];
        while (walker.nextNode()) nodos.push(walker.currentNode);
        nodos.forEach(envolverEmojis);
    }

    function iniciar() {
        procesar(document.body);

        var observador = new MutationObserver(function (mutaciones) {
            mutaciones.forEach(function (mut) {
                mut.addedNodes.forEach(function (n) {
                    if (n.nodeType === 1) procesar(n);
                });
            });
        });
        observador.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
