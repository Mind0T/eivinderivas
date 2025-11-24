document.addEventListener("DOMContentLoaded", function() {
    
    // --- LÓGICA DEL CARRUSEL ---
    let slideIndex = 1;
    let slideInterval;
    
    // Verificamos si hay diapositivas en la página actual
    const slides = document.getElementsByClassName("carousel-slide");
    
    if (slides.length > 0) {
        // Aseguramos que la primera imagen tenga la clase active por si acaso
        showSlides(slideIndex);
        // Iniciamos el timer
        startAutoSlide();
    }

    function startAutoSlide() {
        // Limpiamos cualquier intervalo previo para evitar duplicados
        if (slideInterval) clearInterval(slideInterval);
        
        slideInterval = setInterval(function() {
            plusSlides(1);
        }, 3000); // 3000ms = 3 segundos
    }

    // Función global para ser llamada desde el HTML (botones prev/next)
    window.plusSlides = function(n) {
        clearInterval(slideInterval); // Detenemos el timer al hacer clic manual
        showSlides(slideIndex += n);
        startAutoSlide(); // Reiniciamos el timer
    };

    function showSlides(n) {
        let i;
        if (n > slides.length) {slideIndex = 1}    
        if (n < 1) {slideIndex = slides.length}
        
        // Ocultar todas
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
            slides[i].classList.remove("active");
        }
        
        // Mostrar la actual
        if (slides[slideIndex-1]) {
            slides[slideIndex-1].style.display = "block";  
            slides[slideIndex-1].classList.add("active");
        }
    }

    // --- LÓGICA CAMBIO DE FONDO (Proyectos Personales) ---
    // Hacemos las funciones globales (window.) para que funcionen con onmouseover en HTML
    window.changeBackground = function(imageName) {
        const container = document.getElementById('projects-container');
        if(container) {
            container.style.backgroundImage = `url('assets/img/proyectos/general/${imageName}')`;
        }
    };

    window.resetBackground = function() {
        const container = document.getElementById('projects-container');
        if(container) {
            container.style.backgroundImage = "url('assets/img/proyectos/general/fondoProy.jpg')";
        }
    };
});