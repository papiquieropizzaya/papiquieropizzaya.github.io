// script.js

// Loader
window.addEventListener("load", function() {
    const loader = document.getElementById("loader");
    const wrapper = document.getElementById("loader-wrapper");
    const warning = document.getElementById("connection-warning");

    // Mostrar advertencia después de 4 segundos si la página sigue cargando
    const warningTimeout = setTimeout(function() {
        warning.style.display = "block";
    }, 4000);

    loader.addEventListener("animationiteration", function() {
        // Una vez que se complete la vuelta actual, realiza la transición hacia arriba
        wrapper.style.transform = "translateY(-100%)"; // Mueve el fondo hacia arriba
        document.getElementById("content").style.display = "block"; // Muestra el contenido
        
        // Cancela el mensaje de advertencia si ya cargó
        clearTimeout(warningTimeout);

        // Espera 1 segundo para que la transición termine antes de ocultar el wrapper
        setTimeout(function() {
            wrapper.style.display = "none";
        }, 1000);
    });

    // Desactiva la animación infinita cuando la página está completamente cargada
    loader.style.animationIterationCount = "1";
});

// Smooth scrolling for navigation links
document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for sticky header height
                behavior: 'smooth'
            });
        }
    });
});

// Hero Slider
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function changeSlide(n) {
    slideIndex = (slideIndex + n + totalSlides) % totalSlides;
    showSlide(slideIndex);
}

// Auto-play slider (optional)
let slideInterval;
function startSlider() {
    stopSlider(); // Clear existing interval
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopSlider() {
    clearInterval(slideInterval);
}

// Initialize slider
if (slides.length > 0) {
    showSlide(slideIndex);
    startSlider(); // Start auto-play

    // Optional: Pause slider on hover
    const heroSlider = document.querySelector('.hero-slider');
    if(heroSlider) {
        heroSlider.addEventListener('mouseenter', stopSlider);
        heroSlider.addEventListener('mouseleave', startSlider);
    }
}

// Puedes agregar más interactividad aquí, como:
// - Un modal para el botón "Haz Tu Pedido Online" si prefieres no enlazar directamente a WhatsApp.
// - Filtros para el menú.
// - Animaciones al hacer scroll.

console.log("Página de Papi Quiero Pizza Ya, cargada");

document.addEventListener("DOMContentLoaded", () => {
    const imageWrappers = document.querySelectorAll(".image-wrapper");
    let selectedIndex = null;

    imageWrappers.forEach((wrapper, index) => {
        const image = wrapper.querySelector(".menu-image");
        const menuContent = wrapper.querySelector(".menu-content");

        image.addEventListener("click", () => {
            if (selectedIndex === index) {
                menuContent.style.display = "none";
                image.classList.remove("selected");
                selectedIndex = null;
            } else {
                document.querySelectorAll(".menu-content").forEach(content => {
                    content.style.display = "none";
                });
                document.querySelectorAll(".menu-image").forEach(img => {
                    img.classList.remove("selected");
                });

                menuContent.style.display = "block";
                menuContent.classList.add("fade-in");
                image.classList.add("selected");
                selectedIndex = index;
            }
        });
    });
});




document.getElementById('productsBtn').addEventListener('click', function() {
document.getElementById('productsModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
document.getElementById('productsModal').style.display = 'none';
});

window.onclick = function(event) {
if (event.target == document.getElementById('productsModal')) {
  document.getElementById('productsModal').style.display = 'none';
}
};

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

window.addEventListener('scroll', throttle(() => {
  console.log('Scroll optimizado');
}, 100));
