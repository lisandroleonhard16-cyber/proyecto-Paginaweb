/**
 * RECETAS_APROBADAS.JS
 * Muestra en la página actual las recetas aprobadas por el administrador
 * que corresponden a esa categoría o dieta. Solo actúa en las páginas de
 * html/Recetas/ y html/Dietas espaciales/; en cualquier otra no hace nada.
 *
 * - Categoría: compara el campo "categoria" de la receta con el slug de la página.
 * - Dieta:     compara que "tipos" contenga el slug de la página.
 *
 * Si el fetch falla o no hay recetas para la página, no se muestra nada.
 * Usa textContent / createElement, nunca innerHTML con datos de usuarios.
 */
(function () {
    const lista = document.querySelector('.lista-recetas');
    if (!lista) return;

    // Raíz del sitio a partir de la URL de este script (igual que cuenta.js).
    const script = document.currentScript;
    const raiz = script
        ? script.src.replace(/\/JavaScript\/recetas_aprobadas\.js.*$/, '/')
        : './';

    // Página actual -> qué filtro aplicar.
    //   categoria: el campo "categoria" debe ser igual al valor.
    //   tipos:     el array "tipos" debe contener el valor.
    const PAGINAS = {
        'especialidad_casa':    { modo: 'categoria', valor: 'especialidad-casa' },
        'pastas':               { modo: 'categoria', valor: 'pastas' },
        'carnes':               { modo: 'categoria', valor: 'carnes' },
        'ensaladas':            { modo: 'categoria', valor: 'ensaladas' },
        'postres':              { modo: 'categoria', valor: 'postres' },
        'tragos':               { modo: 'categoria', valor: 'tragos' },
        'vegetarianas':         { modo: 'tipos',     valor: 'vegetariana' },
        'veganas':              { modo: 'tipos',     valor: 'vegana' },
        'sintacc':              { modo: 'tipos',     valor: 'sintacc' },
        'sinlactosa':           { modo: 'tipos',     valor: 'sinlactosa' },
        'sinazucar':            { modo: 'tipos',     valor: 'sinazucar' },
        'altasproteinas':       { modo: 'tipos',     valor: 'altasproteinas' }
    };

    const archivo = decodeURIComponent(window.location.pathname.split('/').pop() || '');
    const nombre = archivo.replace(/\.html?$/i, '');
    const pagina = PAGINAS[nombre];
    if (!pagina) return;

    function corresponde(r) {
        if (pagina.modo === 'categoria') {
            return r.categoria === pagina.valor;
        }
        return Array.isArray(r.tipos) && r.tipos.indexOf(pagina.valor) !== -1;
    }

    function crearTarjeta(r) {
        const det = document.createElement('details');
        det.className = 'receta';
        det.id = 'comunidad-' + r.id;

        const summary = document.createElement('summary');
        const img = document.createElement('img');
        img.src = raiz + r.imagen;
        img.alt = r.nombre;
        const h2 = document.createElement('h2');
        h2.textContent = r.nombre;
        summary.appendChild(img);
        summary.appendChild(h2);

        const seccion = document.createElement('section');
        seccion.className = 'contenido_receta';

        if (r.descripcion) {
            const p = document.createElement('p');
            p.textContent = r.descripcion;
            seccion.appendChild(p);
        }

        const autor = document.createElement('p');
        autor.className = 'receta-autor';
        autor.textContent = 'Receta enviada por ' + (r.autor || 'un usuario');
        seccion.appendChild(autor);

        det.appendChild(summary);
        det.appendChild(seccion);
        return det;
    }

    fetch(raiz + 'php/recetas_aprobadas.php', { cache: 'no-store' })
        .then(function (res) { return res.ok ? res.json() : []; })
        .then(function (datos) {
            if (!Array.isArray(datos)) return;
            datos.filter(corresponde).forEach(function (r) {
                lista.appendChild(crearTarjeta(r));
            });
        })
        .catch(function () { /* sin conexión o error: no se muestra nada */ });
})();
