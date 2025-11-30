document.addEventListener("DOMContentLoaded", function() {
    
    // Variables globales
    let slideIndex = 1;
    let slideInterval;
    let slides = document.getElementsByClassName("carousel-slide");

    // =========================================================
    //   1. LÓGICA DEL CARRUSEL HOME (MANUAL / ESTÁTICO)
    // =========================================================
    function initHomeCarousel() {
        const container = document.getElementById('home-carousel');
        if (!container) return;

        const prevBtn = container.querySelector('.prev'); 
        const isMobile = window.innerWidth <= 768;
        
        const imgPrefix = isMobile ? 'carrumob' : 'carru';
        const totalImages = 8; 

        for (let i = 1; i <= totalImages; i++) {
            const domImg = document.createElement('img');
            domImg.className = 'carousel-slide'; 
            domImg.src = `assets/img/carruselHOME/${imgPrefix}${i}.jpg`;
            domImg.alt = `Portada Eivind Street ${i}`;
            container.insertBefore(domImg, prevBtn);
        }

        if (totalImages > 0) {
            showSlides(1);
            startAutoSlide();
        }
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
        if (slides.length === 0) return;
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

    initHomeCarousel();

    // =========================================================
    //   2. UTILIDADES
    // =========================================================
    window.changeBackground = function(imageName) {
        const container = document.getElementById('projects-container');
        if(container) container.style.backgroundImage = `url('assets/img/proyectos/general/${imageName}')`;
    };

    window.resetBackground = function() {
        const container = document.getElementById('projects-container');
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
    //   3. LÓGICA LIGHTBOX (SWIPE + BOTÓN ATRÁS)
    // =========================================================
    let lightboxIndex = 1;
    
    window.openLightbox = function(n) {
        const lightbox = document.getElementById('myLightbox');
        if(lightbox) {
            lightbox.style.display = "flex"; 
            lightbox.style.justifyContent = "center"; 
            lightbox.style.alignItems = "center";
            currentLightboxSlide(n);

            // AGREGAR ESTADO AL HISTORIAL (Para que el botón Atrás cierre el modal)
            history.pushState({lightboxOpen: true}, "", "#lightbox");
        }
    };

    window.closeLightbox = function() {
        // Si estamos cerrando con el botón X, simulamos un "Atrás" para limpiar el historial
        // El evento popstate se encargará de ocultar el div
        if (history.state && history.state.lightboxOpen) {
            history.back(); 
        } else {
            // Fallback por si no hay estado
            const lightbox = document.getElementById('myLightbox');
            if(lightbox) lightbox.style.display = "none";
        }
    };

    // ESCUCHAR EL BOTÓN ATRÁS DEL NAVEGADOR/CELULAR
    window.addEventListener('popstate', function(event) {
        const lightbox = document.getElementById('myLightbox');
        if(lightbox && lightbox.style.display === "flex") {
            lightbox.style.display = "none";
        }
    });

    window.plusLightboxSlides = function(n) { showLightboxSlides(lightboxIndex += n); };
    window.currentLightboxSlide = function(n) { showLightboxSlides(lightboxIndex = n); };

    function showLightboxSlides(n) {
        let galleryImages = document.querySelectorAll('.scroll-gallery-container .gallery-item');
        let carrouselImages = document.querySelectorAll('#home-carousel .carousel-slide');
        let originalImages = galleryImages.length > 0 ? galleryImages : carrouselImages;

        const lightboxImg = document.getElementById("lightbox-img");
        if (!originalImages.length || !lightboxImg) return;
        
        if (n > originalImages.length) { lightboxIndex = 1; }
        else if (n < 1) { lightboxIndex = originalImages.length; }
        else { lightboxIndex = n; }

        lightboxImg.src = originalImages[lightboxIndex-1].src;
    }

    // --- LÓGICA DE SWIPE (DESLIZAR) EN MÓVIL ---
    const lightboxElement = document.getElementById('myLightbox');
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightboxElement) {
        lightboxElement.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        lightboxElement.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        const swipeThreshold = 50; // Mínimo de píxeles para considerar un swipe
        if (touchEndX < touchStartX - swipeThreshold) {
            // Deslizamiento a la IZQUIERDA -> Siguiente foto
            window.plusLightboxSlides(1);
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Deslizamiento a la DERECHA -> Foto anterior
            window.plusLightboxSlides(-1);
        }
    }


    // =========================================================
    //   4. GALERÍA SCROLL (MANUAL)
    // =========================================================
    window.initScrollGallery = function(folderPath, imagePrefix, totalImages) {
        const container = document.getElementById('scroll-gallery');
        if (!container) return;

        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        for (let i = 1; i <= totalImages; i++) {
            const domImg = document.createElement('img');
            domImg.src = `${folderPath}/${imagePrefix}${i}.jpg`;
            domImg.alt = `Foto ${i} - Eivind Street`;
            domImg.className = 'gallery-item';
            
            domImg.onclick = function() { openLightbox(i); };

            domImg.onload = function() {
                if (this.naturalHeight > this.naturalWidth) {
                    this.classList.add('is-portrait');
                    const pos = i % 3; 
                    if (pos === 1) this.classList.add('align-left');
                    else if (pos === 2) this.classList.add('align-center');
                    else this.classList.add('align-right');
                } else {
                    this.classList.add('is-landscape');
                    this.classList.add('align-center');
                }
            };

            container.appendChild(domImg);
            observer.observe(domImg);
        }
    };

    // =========================================================
    //   5. BOTÓN BACK TO TOP
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
    //   6. AUTO-PLAY MENÚ MÓVIL
    // =========================================================
    if (window.innerWidth <= 768 && document.getElementById('projects-container')) {
        const projectLinks = document.querySelectorAll('.project-link');
        let currentProjIndex = 0;
        const totalProjects = projectLinks.length;
        
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
        }, 2500);
    }
});