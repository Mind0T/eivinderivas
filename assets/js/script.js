document.addEventListener("DOMContentLoaded", function() {
    
    // Variables globales
    let slideIndex = 1;
    let slideInterval;
    let slides = document.getElementsByClassName("carousel-slide");

    // =========================================================
    //   1. LÓGICA DEL CARRUSEL HOME
    // =========================================================
    function initHomeCarousel() {
        const container = document.getElementById('home-carousel');
        if (!container) return;

        const prevBtn = container.querySelector('.prev'); 
        
        // Límite 1024px para cubrir Tablets y Móviles apaisados
        const isMobile = window.innerWidth <= 1024;
        const imgPrefix = isMobile ? 'carrumob' : 'carru';
        const totalImages = 8; 

        for (let i = 1; i <= totalImages; i++) {
            const domImg = document.createElement('img');
            domImg.className = 'carousel-slide'; 
            domImg.src = `assets/img/carruselHOME/${imgPrefix}${i}.jpg`;
            domImg.alt = `Portada Eivind Street ${i}`;
            if (i > 1) domImg.loading = "lazy";
            
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
        if(window.innerWidth > 1024 && container) {
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
    //   3. LÓGICA LIGHTBOX (HÍBRIDO + FULLSCREEN + INSTANT JUMP)
    // =========================================================
    let lightboxIndex = 1;
    
    window.openLightbox = function(n) {
        const lightbox = document.getElementById('myLightbox');
        if(!lightbox) return;

        lightbox.style.display = "flex"; 
        
        // Ocultar BackToTop
        const backToTop = document.getElementById("backToTop");
        if(backToTop) backToTop.style.display = "none";

        // --- MODO MÓVIL / TABLET (<= 1024px) ---
        if (window.innerWidth <= 1024) {
            // 1. Activar Pantalla Completa (Fullscreen API)
            toggleFullScreen(lightbox);
            
            // 2. Construir galería y saltar instantáneamente
            buildMobileGallery(n);
        } else {
            // --- MODO ESCRITORIO ---
            lightbox.style.justifyContent = "center"; 
            lightbox.style.alignItems = "center";
            currentLightboxSlide(n);
        }

        // Guardar estado en historial
        history.pushState({lightboxOpen: true}, "", "#lightbox");
    };

    window.closeLightbox = function() {
        // Salir de Fullscreen si está activo
        exitFullScreen();

        if (history.state && history.state.lightboxOpen) {
            history.back(); 
        } else {
            closeLightboxLogic();
        }
    };

    // Lógica interna para cerrar visualmente
    function closeLightboxLogic() {
        const lightbox = document.getElementById('myLightbox');
        if(lightbox) lightbox.style.display = "none";
        
        const snapWrapper = document.getElementById('mobileSnapWrapper');
        if(snapWrapper) snapWrapper.innerHTML = ''; 
        
        const backToTop = document.getElementById("backToTop");
        if(backToTop && window.scrollY > 400) backToTop.style.display = "flex";
    }

    // Manejar botón "Atrás" del celular
    window.addEventListener('popstate', function(event) {
        exitFullScreen(); // Asegurar salir de fullscreen al dar atrás
        
        const lightbox = document.getElementById('myLightbox');
        if(lightbox && lightbox.style.display === "flex") {
            closeLightboxLogic();
        }
    });

    // --- FUNCIONES FULLSCREEN ---
    function toggleFullScreen(elem) {
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => {
                    console.log(`Error al intentar pantalla completa: ${err.message}`);
                });
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        }
    }

    function exitFullScreen() {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(err => console.log(err));
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }


    // --- LÓGICA ESCRITORIO ---
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

    // --- LÓGICA MÓVIL OPTIMIZADA (SIN BARRIDO / SWEEP) ---
    function buildMobileGallery(startIndex) {
        const lightbox = document.getElementById('myLightbox');
        let snapWrapper = document.getElementById('mobileSnapWrapper');
        
        if (!snapWrapper) {
            snapWrapper = document.createElement('div');
            snapWrapper.id = 'mobileSnapWrapper';
            snapWrapper.className = 'mobile-snap-wrapper';
            lightbox.appendChild(snapWrapper);
        }
        
        snapWrapper.innerHTML = '';

        let galleryImages = document.querySelectorAll('.scroll-gallery-container .gallery-item');
        let carrouselImages = document.querySelectorAll('#home-carousel .carousel-slide');
        let originalImages = galleryImages.length > 0 ? galleryImages : carrouselImages;

        // Construir DOM
        originalImages.forEach((img) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'mobile-snap-item';
            const newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.alt = img.alt;
            newImg.loading = "lazy"; 
            itemDiv.appendChild(newImg);
            snapWrapper.appendChild(itemDiv);
        });

        // === MAGIA PARA EVITAR EL BARRIDO (SWEEP) ===
        // 1. Desactivamos el "imán" y el scroll suave temporalmente
        snapWrapper.style.scrollSnapType = 'none';
        snapWrapper.style.scrollBehavior = 'auto';

        // 2. Calculamos la posición exacta
        const width = window.innerWidth;
        const targetPos = (startIndex - 1) * width;

        // 3. Saltamos inmediatamente (Teletransportación)
        snapWrapper.scrollLeft = targetPos;

        // 4. Reactivamos el "imán" después de un frame para que el usuario pueda deslizar
        requestAnimationFrame(() => {
            setTimeout(() => {
                snapWrapper.style.scrollSnapType = 'x mandatory';
                snapWrapper.style.scrollBehavior = 'smooth';
            }, 50); // Pequeño delay para asegurar que el navegador ya renderizó el salto
        });
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
            domImg.loading = "lazy";
            
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
            const lightbox = document.getElementById('myLightbox');
            // Verificación extra segura
            const isLightboxOpen = lightbox && (lightbox.style.display === 'flex' || lightbox.style.display === 'block');

            if (window.scrollY > 400 && !isLightboxOpen) { 
                backToTopBtn.classList.add("show"); 
                backToTopBtn.style.display = "flex"; 
            } else { 
                backToTopBtn.classList.remove("show"); 
            }
        });
        backToTopBtn.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // =========================================================
    //   6. AUTO-PLAY MENÚ MÓVIL
    // =========================================================
    if (window.innerWidth <= 1024 && document.getElementById('projects-container')) {
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