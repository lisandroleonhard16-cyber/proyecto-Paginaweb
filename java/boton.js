const btnSubir = document.getElementById("btnSubir");
const footer = document.getElementById("miFooter");

window.addEventListener("scroll", () => {
  // Mostrar u ocultar el botón
  if (window.scrollY > 400) {
    btnSubir.style.display = "block";
  } else {
    btnSubir.style.display = "none";
  }

  // Detectar si el footer está a la vista
  const footerRect = footer.getBoundingClientRect();
  if (footerRect.top < window.innerHeight) {
    btnSubir.classList.add("en-footer");
  } else {
    btnSubir.classList.remove("en-footer");
  }
});

btnSubir.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});