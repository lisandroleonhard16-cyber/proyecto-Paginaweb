// Menú Hamburguesa para Móvil
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const menuToggles = document.querySelectorAll('.menu-toggle');

// Toggle del menú principal
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});

// Toggle de submenús en móvil
menuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const parent = toggle.parentElement;
            parent.classList.toggle('active');
        }
    });
});

// Cerrar menú al hacer click en un enlace
const navLinks = nav.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
});

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    }
});

// Cerrar menú al cambiar tamaño de pantalla
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    }
});
