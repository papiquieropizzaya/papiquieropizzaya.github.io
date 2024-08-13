window.addEventListener("load", function() {
    // Ocultar el loader después de 4 segundos
    setTimeout(function() {
        document.getElementById("loader-wrapper").style.display = "none";
        document.getElementById("content").style.display = "block";
    }, 4000);
});
