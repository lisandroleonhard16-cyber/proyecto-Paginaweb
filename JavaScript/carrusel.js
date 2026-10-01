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
const TIEMPO_ROTACION = 3000; // 3000 ms = 3 segundos, ajustá a gusto

function actualizarRecetaDestacada() {
    const titulo = document.getElementById("tituloDestacado");
    const imagen = document.getElementById("imgDestacada");

    if (!titulo || !imagen) return;

    // Fade out
    imagen.style.opacity = "0";

    setTimeout(() => {
        const receta = recetasDestacadas[indiceActual];

        titulo.textContent = receta.titulo;
        imagen.setAttribute("src", receta.imagen);
        imagen.setAttribute("alt", receta.alt);

        // Fade in
        imagen.style.opacity = "1";

        indiceActual = (indiceActual + 1) % recetasDestacadas.length;
    }, 400);
}
// Ejecuta el cambio inmediatamente al cargar la página (sin esperar los 5 segundos)
document.addEventListener("DOMContentLoaded", () => {
    actualizarRecetaDestacada();
});

// Y después arranca el carrusel automático para los siguientes cambios
setInterval(actualizarRecetaDestacada, TIEMPO_ROTACION);