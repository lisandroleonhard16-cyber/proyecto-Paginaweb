// Lista de recetas destacadas: completá con tus propias recetas y fotos
const recetasDestacadas = [
    {
        titulo: "ESPECIALIDAD DE LA CASA: PIZZA MARGARITA",
        imagen: "imagenes/pizzamargarita.jpg",
        alt: "Pizza Margarita",
        link: "/html/Recetas/especialidad_casa.html"
    },
    {
        titulo: "RECETA DEL DÍA: EMPANADAS SALTEÑAS",
        imagen: "/imagenes/empanadas",
        alt: "Empanadas Salteñas",
        link: "/html/Recetas/carnes.html"
    },
    {
        titulo: "RECOMENDADO: PASTAS CASERAS",
        imagen: "imagenes/pastas.jpg",
        alt: "Pastas Caseras",
        link: "/html/Recetas/pastas.html"
    },
    {
        titulo: "DULCE TENTACIÓN: POSTRE DEL DÍA",
        imagen: "imagenes/postre.jpg",
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
    }, 400); // debe ser un poco menor al tiempo de transición del CSS (600ms)
}

// Arranca el carrusel automático
setInterval(actualizarRecetaDestacada, TIEMPO_ROTACION);