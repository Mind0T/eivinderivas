document.addEventListener("DOMContentLoaded", function() {
    
    // --- LÓGICA DEL CARRUSEL PRINCIPAL (AUTO-PLAY) ---
    let slideIndex = 1;
    let slideInterval;
    
    const slides = document.getElementsByClassName("carousel-slide");
    
    if (slides.length > 0) {
        showSlides(slideIndex);
        startAutoSlide();
    }

    function startAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(function() {
            plusSlides(1);
        }, 3000);
    }

    window.plusSlides = function(n) {
        clearInterval(slideInterval); 
        showSlides(slideIndex += n);
        startAutoSlide(); 
    };

    function showSlides(n) {
        let i;
        if (n > slides.length) {slideIndex = 1}    
        if (n < 1) {slideIndex = slides.length}
        
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
            slides[i].classList.remove("active");
        }
        
        if (slides[slideIndex-1]) {
            slides[slideIndex-1].style.display = "block";  
            slides[slideIndex-1].classList.add("active");
        }
    }

    // --- LÓGICA CAMBIO DE FONDO ---
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

    // --- LÓGICA MENÚ MÓVIL ---
    const menuToggle = document.getElementById('mobile-menu-btn');
    const closeMenu = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if(menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });
    }

    if(closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    }

    // --- LÓGICA LIGHTBOX (VISOR PANTALLA COMPLETA) ---
    // Esta lógica es independiente. No tiene autoplay.
    let lightboxIndex = 1;

    window.openLightbox = function(n) {
        const lightbox = document.getElementById('myLightbox');
        if(lightbox) {
            lightbox.style.display = "flex"; // Flex para centrar
            lightbox.style.justifyContent = "center";
            lightbox.style.alignItems = "center";
            currentLightboxSlide(n);
        }
    };

    window.closeLightbox = function() {
        const lightbox = document.getElementById('myLightbox');
        if(lightbox) {
            lightbox.style.display = "none";
        }
    };

    window.plusLightboxSlides = function(n) {
        showLightboxSlides(lightboxIndex += n);
    };

    window.currentLightboxSlide = function(n) {
        showLightboxSlides(lightboxIndex = n);
    };

    function showLightboxSlides(n) {
        // Buscamos las imágenes ORIGINALES del carrusel de la página para copiarlas al visor
        // NOTA: Usamos el selector específico del carrusel de proyectos
        const originalImages = document.querySelectorAll('.project-carousel-frame .carousel-slide');
        const lightboxImg = document.getElementById("lightbox-img");

        if (!originalImages.length || !lightboxImg) return;

        if (n > originalImages.length) {lightboxIndex = 1}
        if (n < 1) {lightboxIndex = originalImages.length}

        // Tomamos la fuente (src) de la imagen original correspondiente y la ponemos en el visor
        lightboxImg.src = originalImages[lightboxIndex-1].src;
    }
});