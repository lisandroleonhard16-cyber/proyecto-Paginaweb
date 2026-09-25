// Lista de recetas destacadas: completá con tus propias recetas y fotos
const recetasDestacadas = [
    {
        titulo: "ESPECIALIDAD DE LA CASA: PIZZA MARGARITA",
<<<<<<< HEAD
        imagen: "imagenes/FotoMedio/pizzamargarita.jpg",  //funciona asi con esta ruta
=======
        imagen: "../imagenes/Recetas/Especialidad de la casa/pizzamargarita.jpg",
>>>>>>> a72f627ecffef48838303e6d73b0e115eedad490
        alt: "Pizza Margarita",
        link: "/html/Recetas/especialidad_casa.html"
    },
    {
        titulo: "RECETA DEL DÍA: EMPANADAS SALTEÑAS",
<<<<<<< HEAD
        imagen: "imagenes/FotoMedio/saltenas-beef-empanadas.jpg",
=======
        imagen: "../imagenes/Recetas/Especialidad de la casa/saltenas-beef-empanadas.jpg",
>>>>>>> a72f627ecffef48838303e6d73b0e115eedad490
        alt: "Empanadas Salteñas",
        link: "/html/Recetas/carnes.html"   
    },
    {
        titulo: "RECOMENDADO: PASTAS CASERAS",
<<<<<<< HEAD
        imagen: "imagenes/FotoMedio/caseros.jfif",
=======
        imagen: "../imagenes/Recetas/Pastas/Fettuccine-Alfredo.jpg",
>>>>>>> a72f627ecffef48838303e6d73b0e115eedad490
        alt: "Pastas Caseras",
        link: ""
    },
    {
        titulo: "DULCE TENTACIÓN: POSTRE DEL DÍA",
<<<<<<< HEAD
        imagen: "imagenes/FotoMedio/postre.jpg",
=======
        imagen: "../imagenes/Recetas/postres/flan con dulce de leche.jfif",
>>>>>>> a72f627ecffef48838303e6d73b0e115eedad490
        alt: "Postre del día",
        link: "/html/Recetas/postres.html"
    }
    // Agregá más recetas acá con la misma estructura
];

let indiceActual = 0;
const TIEMPO_ROTACION = 5000; // 5000 ms = 5 segundos, ajustá a gusto

function actualizarRecetaDestacada() {
    const titulo = document.getElementById("tituloDestacado");
    const link = document.getElementById("linkDestacado");
    const imagen = document.getElementById("imgDestacada");

    if (!titulo || !link || !imagen) return;

    // Fade out
    imagen.style.opacity = "0";

    setTimeout(() => {
        const receta = recetasDestacadas[indiceActual];

        titulo.textContent = receta.titulo;
        link.setAttribute("href", receta.link);
        imagen.setAttribute("src", receta.imagen);
        imagen.setAttribute("alt", receta.alt);

        // Fade in
        imagen.style.opacity = "1";

        // Avanza al siguiente índice, y vuelve a 0 si llega al final
        indiceActual = (indiceActual + 1) % recetasDestacadas.length;
    }, 600); // debe ser un poco menor al tiempo de transición del CSS (600ms)
}

// Ejecuta el cambio inmediatamente al cargar la página (sin esperar los 5 segundos)
document.addEventListener("DOMContentLoaded", () => {
    actualizarRecetaDestacada();
});

// Y después arranca el carrusel automático para los siguientes cambios
setInterval(actualizarRecetaDestacada, TIEMPO_ROTACION);