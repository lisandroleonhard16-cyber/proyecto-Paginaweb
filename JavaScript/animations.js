const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Agregar delay escalonado para múltiples elementos
            const delay = index * 100;
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);


document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach((element, index) => {
        element.classList.add(`revealed-delay-${(index % 4) + 1}`);
        observer.observe(element);
    });
});

// PARTÍCULAS DE FONDO
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Crear partículas al cargar
document.addEventListener('DOMContentLoaded', createParticles);

// ANIMACIÓN DE ENTRADA PARA EL HEADER
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.encabezado');
    if (header) {
        header.classList.add('fade-in-up');
    }
});

// ANIMACIÓN PARA LAS TARJETAS AL HACER HOVER
const cards = document.querySelectorAll('.tarjeta-receta, .tarjeta-destacada, .categoria-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// EFECTO DE TYPING PARA TÍTULOS DESTACADOS
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Aplicar typing effect al título destacado
document.addEventListener('DOMContentLoaded', () => {
    const tituloDestacado = document.getElementById('tituloDestacado');
    if (tituloDestacado) {
        const originalText = tituloDestacado.textContent;
        // typeWriter(tituloDestacado, originalText, 30);
    }
});

// SMOOTH SCROLL PARA ENLACES INTERNOS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ANIMACIÓN DE PROGRESO AL SCROLL
function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    // Puedes crear una barra de progreso si lo deseas
    // const progressBar = document.getElementById('progress-bar');
    // if (progressBar) {
    //     progressBar.style.width = scrollPercent + '%';
    // }
}

window.addEventListener('scroll', updateProgressBar);

// PARALLAX EFFECT PARA EL FONDO - ELIMINADO PORQUE CAUSA FRANJAS NEGRAS
// window.addEventListener('scroll', () => {
//     const scrolled = window.scrollY;
//     const body = document.body;
//     if (body) {
//         body.style.backgroundPositionY = scrolled * 0.5 + 'px';
//     }
// });

// ANIMACIÓN DE CONTADOR (para estadísticas si las agregas)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ANIMACIÓN DE BOUNCE PARA BOTONES DE CTA
const ctaButtons = document.querySelectorAll('.tarjeta-link');
ctaButtons.forEach(button => {
    button.classList.add('bounce-hover');
});

// LAZY LOAD PARA IMÁGENES (ya implementado con loading="lazy", pero como fallback)
if ('loading' in HTMLImageElement.prototype) {
    // El navegador soporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback para navegadores antiguos
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// ANIMACIÓN DE ENTRADA PARA EL FOOTER
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');
    if (footer) {
        footerObserver.observe(footer);
    }
});
