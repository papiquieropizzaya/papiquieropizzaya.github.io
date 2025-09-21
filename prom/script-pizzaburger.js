// Función para el contador
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    // Fecha de finalización: 3 de Octubre del año actual a las 10:30
    const countdownDate = new Date(new Date().getFullYear(), 9, 3, 10, 30, 0).getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            countdownElement.innerHTML = "¡YA ESTÁ AQUÍ!";
            clearInterval(interval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
        document.getElementById('minutes').innerText = minutes;
        document.getElementById('seconds').innerText = seconds;
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown(); 
}

// Iniciar el contador cuando la página cargue
document.addEventListener('DOMContentLoaded', startCountdown);