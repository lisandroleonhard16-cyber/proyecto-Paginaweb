// Lista de recetas destacadas: completá con tus propias recetas y fotos
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
    // Agregá más recetas acá con la misma estructura
];

let indiceActual = 0;
const TIEMPO_ROTACION = 4000; // 4000 ms = 4 segundos
let intervaloCarrusel = null;
let isTransitioning = false;

function actualizarRecetaDestacada() {
    const titulo = document.getElementById("tituloDestacado");
    const imagen = document.getElementById("imgDestacada");

    if (!titulo || !imagen || isTransitioning) return;

    isTransitioning = true;

    // Animación de salida del título
    titulo.style.opacity = "0";
    titulo.style.transform = "translateX(-30px)";
    titulo.style.transition = "all 0.4s ease-out";

    // Animación de salida de la imagen
    imagen.style.opacity = "0";
    imagen.style.transform = "scale(0.95)";
    imagen.style.transition = "all 0.5s ease-out";

    setTimeout(() => {
        const receta = recetasDestacadas[indiceActual];

        // Cambiar contenido
        titulo.textContent = receta.titulo;
        imagen.setAttribute("src", receta.imagen);
        imagen.setAttribute("alt", receta.alt);

        // Precargar la siguiente imagen
        const siguienteIndice = (indiceActual + 1) % recetasDestacadas.length;
        const siguienteImagen = new Image();
        siguienteImagen.src = recetasDestacadas[siguienteIndice].imagen;

        // Animación de entrada del título
        titulo.style.opacity = "1";
        titulo.style.transform = "translateX(0)";

        // Animación de entrada de la imagen
        imagen.style.opacity = "1";
        imagen.style.transform = "scale(1)";

        setTimeout(() => {
            isTransitioning = false;
            indiceActual = (indiceActual + 1) % recetasDestacadas.length;
        }, 500);
    }, 500);
}

// Iniciar carrusel automático
function iniciarCarrusel() {
    if (intervaloCarrusel) return;
    intervaloCarrusel = setInterval(actualizarRecetaDestacada, TIEMPO_ROTACION);
}

// Detener carrusel automático
function detenerCarrusel() {
    if (intervaloCarrusel) {
        clearInterval(intervaloCarrusel);
        intervaloCarrusel = null;
    }
}

// Navegación manual con botones (si los agregas en el futuro)
function recetaAnterior() {
    detenerCarrusel();
    indiceActual = (indiceActual - 1 + recetasDestacadas.length) % recetasDestacadas.length;
    actualizarRecetaDestacada();
    setTimeout(iniciarCarrusel, 3000);
}

function recetaSiguiente() {
    detenerCarrusel();
    actualizarRecetaDestacada();
    setTimeout(iniciarCarrusel, 3000);
}

// Pausar carrusel cuando el mouse está sobre la imagen destacada
const destacadaSection = document.querySelector('.destacada');
if (destacadaSection) {
    destacadaSection.addEventListener('mouseenter', detenerCarrusel);
    destacadaSection.addEventListener('mouseleave', iniciarCarrusel);
}

// Pausar cuando la página no está visible (optimización)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        detenerCarrusel();
    } else {
        iniciarCarrusel();
    }
});

// Ejecuta el cambio inmediatamente al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Configurar estilos iniciales para animaciones
    const titulo = document.getElementById("tituloDestacado");
    const imagen = document.getElementById("imgDestacada");

    if (titulo) {
        titulo.style.transition = "all 0.4s ease-out";
    }
    if (imagen) {
        imagen.style.transition = "all 0.5s ease-out";
    }

    // Mostrar la primera receta sin animación de transición
    const primeraReceta = recetasDestacadas[0];
    if (titulo && imagen) {
        titulo.textContent = primeraReceta.titulo;
        imagen.setAttribute("src", primeraReceta.imagen);
        imagen.setAttribute("alt", primeraReceta.alt);
        imagen.style.opacity = "1";
    }

    // Incrementar índice para la siguiente
    indiceActual = 1;

    // Iniciar carrusel automático
    setTimeout(iniciarCarrusel, TIEMPO_ROTACION);
});

// Agregar indicadores de progreso (dots) - opcional
function crearIndicadores() {
    const destacadaSection = document.querySelector('.destacada');
    if (!destacadaSection) return;

    const contenedorIndicadores = document.createElement('div');
    contenedorIndicadores.className = 'carrusel-indicadores';

    recetasDestacadas.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';

        dot.addEventListener('click', () => {
            detenerCarrusel();
            indiceActual = index;
            actualizarRecetaDestacada();
            setTimeout(iniciarCarrusel, 3000);
        });

        contenedorIndicadores.appendChild(dot);
    });

    destacadaSection.appendChild(contenedorIndicadores);
}

// Crear indicadores al cargar
document.addEventListener("DOMContentLoaded", crearIndicadores);

// Actualizar indicador activo
function actualizarIndicadorActivo() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === indiceActual) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Modificar actualizarRecetaDestacada para actualizar indicadores
const originalActualizar = actualizarRecetaDestacada;
actualizarRecetaDestacada = function() {
    originalActualizar();
    setTimeout(actualizarIndicadorActivo, 500);
};
