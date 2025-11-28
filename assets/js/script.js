document.addEventListener("DOMContentLoaded", function() {
    
    // =========================================================
    //   LÓGICA DEL CARRUSEL PRINCIPAL (HOME)
    // =========================================================
    let slideIndex = 1;
    let slideInterval;
    const slides = document.getElementsByClassName("carousel-slide");
    
    if (slides.length > 0 && document.getElementById('home-carousel')) {
        showSlides(slideIndex);
        startAutoSlide();
    }

    function startAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(function() { plusSlides(1); }, 3000);
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

    // =========================================================
    //   UTILIDADES (Fondos, Menú Móvil)
    // =========================================================
    window.changeBackground = function(imageName) {
        const container = document.getElementById('projects-container');
        if(container) container.style.backgroundImage = `url('assets/img/proyectos/general/${imageName}')`;
    };

    window.resetBackground = function() {
        const container = document.getElementById('projects-container');
        // En desktop regresamos al fondo default. En móvil no, para evitar parpadeos.
        if(window.innerWidth > 768 && container) {
            container.style.backgroundImage = "url('assets/img/proyectos/general/fondoProy.jpg')";
        }
    };

    const menuToggle = document.getElementById('mobile-menu-btn');
    const closeMenu = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if(menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() { mobileMenu.classList.add('active'); });
    }
    if(closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', function() { mobileMenu.classList.remove('active'); });
    }

    // =========================================================
    //   LÓGICA LIGHTBOX (VISOR DE IMÁGENES)
    // =========================================================
    let lightboxIndex = 1;
    
    window.openLightbox = function(n) {
        const lightbox = document.getElementById('myLightbox');
        if(lightbox) {
            lightbox.style.display = "flex"; 
            lightbox.style.justifyContent = "center"; 
            lightbox.style.alignItems = "center";
            currentLightboxSlide(n);
        }
    };

    window.closeLightbox = function() {
        const lightbox = document.getElementById('myLightbox');
        if(lightbox) lightbox.style.display = "none";
    };

    window.plusLightboxSlides = function(n) { showLightboxSlides(lightboxIndex += n); };
    window.currentLightboxSlide = function(n) { showLightboxSlides(lightboxIndex = n); };

    function showLightboxSlides(n) {
        // Detectamos cuántas imágenes hay actualmente en la galería (dinámico)
        let galleryImages = document.querySelectorAll('.scroll-gallery-container .gallery-item');
        let carrouselImages = document.querySelectorAll('.project-carousel-frame .carousel-slide');
        
        let originalImages = galleryImages.length > 0 ? galleryImages : carrouselImages;

        const lightboxImg = document.getElementById("lightbox-img");
        if (!originalImages.length || !lightboxImg) return;
        
        // Navegación circular
        if (n > originalImages.length) { lightboxIndex = 1; }
        else if (n < 1) { lightboxIndex = originalImages.length; }
        else { lightboxIndex = n; }

        // Actualizamos la fuente del lightbox con la imagen correspondiente
        lightboxImg.src = originalImages[lightboxIndex-1].src;
    }

    // =========================================================
    //   GALERÍA INTELIGENTE (AUTO-DETECCIÓN DE IMÁGENES)
    // =========================================================
    window.initScrollGallery = function(folderPath, imagePrefix) {
        const container = document.getElementById('scroll-gallery');
        if (!container) return;

        // Configuración para la animación de entrada (fade-in)
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Función recursiva que intenta cargar imagen por imagen
        function tryLoadImage(index) {
            const imgObj = new Image(); 
            const src = `${folderPath}/${imagePrefix}${index}.jpg`;
            
            imgObj.src = src;

            // CASO 1: La imagen EXISTE
            imgObj.onload = function() {
                // Creamos el elemento HTML real
                const domImg = document.createElement('img');
                domImg.src = src;
                domImg.alt = `Foto ${index} - Eivind Street`;
                domImg.className = 'gallery-item';
                
                // Asignamos el click para abrir el Lightbox en el índice correcto
                domImg.onclick = function() { openLightbox(index); };

                // Detectamos si es Vertical u Horizontal para el estilo
                if (this.naturalHeight > this.naturalWidth) {
                    domImg.classList.add('is-portrait');
                    // Patrón de alineación estética: Izquierda, Centro, Derecha
                    const pos = index % 3; 
                    if (pos === 1) domImg.classList.add('align-left');
                    else if (pos === 2) domImg.classList.add('align-center');
                    else domImg.classList.add('align-right');
                } else {
                    domImg.classList.add('is-landscape');
                    domImg.classList.add('align-center');
                }

                // Insertamos en el DOM
                container.appendChild(domImg);
                observer.observe(domImg);

                // ¡IMPORTANTE! Intentamos cargar la siguiente imagen (n+1)
                tryLoadImage(index + 1);
            };

            // CASO 2: La imagen NO EXISTE (Error 404) -> Fin del bucle
            imgObj.onerror = function() {
                // Se detiene silenciosamente, ya no busca más fotos.
                console.log(`Galería cargada completamente. Total: ${index - 1} imágenes.`);
            };
        }

        // Iniciamos el proceso con la imagen número 1
        tryLoadImage(1);
    };

    // =========================================================
    //   BOTÓN BACK TO TOP
    // =========================================================
    const backToTopBtn = document.getElementById("backToTop");
    if(backToTopBtn) {
        window.addEventListener("scroll", function() {
            if (window.scrollY > 400) { backToTopBtn.classList.add("show"); } 
            else { backToTopBtn.classList.remove("show"); }
        });
        backToTopBtn.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // =========================================================
    //   AUTO-PLAY EN MENÚ PROYECTOS (MÓVIL)
    // =========================================================
    if (window.innerWidth <= 768 && document.getElementById('projects-container')) {
        const projectLinks = document.querySelectorAll('.project-link');
        let currentProjIndex = 0;
        const totalProjects = projectLinks.length;
        const cycleTime = 2500;

        function activateProject(index) {
            projectLinks.forEach(link => link.classList.remove('active-project'));
            if(projectLinks[index]) {
                const activeLink = projectLinks[index];
                activeLink.classList.add('active-project');
                const bgImage = activeLink.getAttribute('data-bg');
                if (bgImage) changeBackground(bgImage);
            }
        }
        activateProject(0);
        setInterval(() => {
            currentProjIndex++;
            if (currentProjIndex >= totalProjects) currentProjIndex = 0;
            activateProject(currentProjIndex);
        }, cycleTime);
    }
});