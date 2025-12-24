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