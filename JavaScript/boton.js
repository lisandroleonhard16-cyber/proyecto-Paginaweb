document.addEventListener("DOMContentLoaded", function() {
  const btnSubir = document.getElementById("btnSubir");
  const header = document.querySelector(".encabezado");

  if (!btnSubir) return;

  function updateButtonVisibility() {
    // Calcular la altura del encabezado
    const headerHeight = header ? header.offsetHeight : 100;

    // Mostrar el botón cuando el usuario baja un poco más del encabezado
    if (window.scrollY > headerHeight + 50) {
      btnSubir.classList.add("visible");
    } else {
      btnSubir.classList.remove("visible");
    }
  }

  // Event listener para scroll
  window.addEventListener("scroll", updateButtonVisibility);

  // Verificar al cargar la página
  updateButtonVisibility();

  btnSubir.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});