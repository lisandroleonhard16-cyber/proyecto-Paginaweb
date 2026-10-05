// ===== CONFIGURACIÓN =====
const recetasDestacadas = [
    {
        titulo: "ESPECIALIDAD DE LA CASA: PIZZA MARGARITA",
        imagen: "imagenes/FotoMedio/pizzamargarita.jpg",
        alt: "Pizza Margarita",
    },
    {
        titulo: "RECETA DEL DÍA: EMPANADAS SALTEÑAS",
        imagen: "imagenes/FotoMedio/saltenas-beef-empanadas.jpg",
        alt: "Empanadas Salteñas",
    },
    {
        titulo: "RECOMENDADO: PASTAS CASERAS",
        imagen: "imagenes/FotoMedio/caseros.jfif",
        alt: "Pastas Caseras",
    },
    {
        titulo: "DULCE TENTACIÓN: POSTRE DEL DÍA",
        imagen: "imagenes/FotoMedio/flan con dulce de leche.jfif",
        alt: "Postre del día",
    }
];

let indiceActual = 0;
const TIEMPO_ROTACION = 3000;
let intervaloCarrusel = null;
let isTransitioning = false;

// ===== FUNCIONES PRINCIPALES =====
function actualizarRecetaDestacada() {
    const titulo = document.getElementById("tituloDestacado");
    const imagen = document.getElementById("imgDestacada");

    if (!titulo || !imagen || isTransitioning) return;

    isTransitioning = true;

    // Animación de salida
    titulo.style.opacity = "0";
    titulo.style.transform = "translateX(-30px)";
    titulo.style.transition = "all 0.4s ease-out";

    imagen.style.opacity = "0";
    imagen.style.transform = "scale(0.95)";
    imagen.style.transition = "all 0.5s ease-out";

    setTimeout(() => {
        indiceActual = (indiceActual + 1) % recetasDestacadas.length;
        const receta = recetasDestacadas[indiceActual];

        titulo.textContent = receta.titulo;
        imagen.setAttribute("src", receta.imagen);
        imagen.setAttribute("alt", receta.alt);

        // Precargar siguiente imagen
        const siguienteIndice = (indiceActual + 1) % recetasDestacadas.length;
        new Image().src = recetasDestacadas[siguienteIndice].imagen;

        // Animación de entrada
        titulo.style.opacity = "1";
        titulo.style.transform = "translateX(0)";
        imagen.style.opacity = "1";
        imagen.style.transform = "scale(1)";

        setTimeout(() => {
            isTransitioning = false;
            actualizarIndicadorActivo();
        }, 500);
    }, 500);
}

function iniciarCarrusel() {
    if (intervaloCarrusel) clearInterval(intervaloCarrusel);
    intervaloCarrusel = setInterval(actualizarRecetaDestacada, TIEMPO_ROTACION);
}

function detenerCarrusel() {
    if (intervaloCarrusel) {
        clearInterval(intervaloCarrusel);
        intervaloCarrusel = null;
    }
}

// ===== NAVEGACIÓN =====
function recetaAnterior() {
    detenerCarrusel();
    indiceActual = (indiceActual - 2 + recetasDestacadas.length) % recetasDestacadas.length;
    actualizarRecetaDestacada();
    setTimeout(iniciarCarrusel, 3000);
}

function recetaSiguiente() {
    detenerCarrusel();
    actualizarRecetaDestacada();
    setTimeout(iniciarCarrusel, 3000);
}

// ===== INDICADORES =====
function crearIndicadores() {
    const destacadaSection = document.querySelector('.destacada');
    if (!destacadaSection) return;

    const contenedor = document.createElement('div');
    contenedor.className = 'carrusel-indicadores';

    recetasDestacadas.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => {
            detenerCarrusel();
            indiceActual = (index - 1 + recetasDestacadas.length) % recetasDestacadas.length;
            actualizarRecetaDestacada();
            setTimeout(iniciarCarrusel, 3000);
        });
        contenedor.appendChild(dot);
    });

    destacadaSection.appendChild(contenedor);
}

function actualizarIndicadorActivo() {
    const dots = document.querySelectorAll('.dot');
    const indiceMostrado = (indiceActual - 1 + recetasDestacadas.length) % recetasDestacadas.length;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === indiceMostrado);
    });
}

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
    const titulo = document.getElementById("tituloDestacado");
    const imagen = document.getElementById("imgDestacada");

    // Configurar estilos iniciales
    if (titulo) titulo.style.transition = "all 0.4s ease-out";
    if (imagen) imagen.style.transition = "all 0.5s ease-out";

    // Mostrar primera receta
    const primeraReceta = recetasDestacadas[0];
    if (titulo && imagen) {
        titulo.textContent = primeraReceta.titulo;
        imagen.setAttribute("src", primeraReceta.imagen);
        imagen.setAttribute("alt", primeraReceta.alt);
        imagen.style.opacity = "1";
    }

    // Precargar imágenes
    recetasDestacadas.forEach(receta => new Image().src = receta.imagen);

    // Crear indicadores
    crearIndicadores();
    actualizarIndicadorActivo();

    // Event listeners botones
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    if (btnAnterior) btnAnterior.addEventListener('click', recetaAnterior);
    if (btnSiguiente) btnSiguiente.addEventListener('click', recetaSiguiente);

    // Pausar al hover
    const destacadaSection = document.querySelector('.destacada');
    if (destacadaSection) {
        destacadaSection.addEventListener('mouseenter', detenerCarrusel);
        destacadaSection.addEventListener('mouseleave', iniciarCarrusel);
    }

    // Pausar cuando la página no está visible
    document.addEventListener('visibilitychange', () => {
        document.hidden ? detenerCarrusel() : iniciarCarrusel();
    });

    // Iniciar carrusel
    setTimeout(iniciarCarrusel, 1000);
});

