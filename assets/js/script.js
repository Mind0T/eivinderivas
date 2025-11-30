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
        
        // RESTAURADO A 768px
        const isMobile = window.innerWidth <= 768;
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
        // RESTAURADO A 768px
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
    //   3. LÓGICA LIGHTBOX (HÍBRIDO + FULLSCREEN + INSTANT JUMP + ZOOM)
    // =========================================================
    let lightboxIndex = 1;
    
    window.openLightbox = function(n) {
        const lightbox = document.getElementById('myLightbox');
        if(!lightbox) return;

        lightbox.style.display = "flex"; 
        
        // Ocultar BackToTop
        const backToTop = document.getElementById("backToTop");
        if(backToTop) backToTop.style.display = "none";

        // RESTAURADO A 768px
        if (window.innerWidth <= 768) {
            // 1. Activar Pantalla Completa
            toggleFullScreen(lightbox);
            
            // 2. Construir galería y saltar instantáneamente
            buildMobileGallery(n);
        } else {
            // --- MODO ESCRITORIO ---
            lightbox.style.justifyContent = "center"; 
            lightbox.style.alignItems = "center";
            currentLightboxSlide(n);
        }

        history.pushState({lightboxOpen: true}, "", "#lightbox");
    };

    window.closeLightbox = function() {
        exitFullScreen();

        if (history.state && history.state.lightboxOpen) {
            history.back(); 
        } else {
            closeLightboxLogic();
        }
    };

    function closeLightboxLogic() {
        const lightbox = document.getElementById('myLightbox');
        if(lightbox) lightbox.style.display = "none";
        
        const snapWrapper = document.getElementById('mobileSnapWrapper');
        if(snapWrapper) snapWrapper.innerHTML = ''; 
        
        const backToTop = document.getElementById("backToTop");
        if(backToTop && window.scrollY > 400) backToTop.style.display = "flex";
    }

    window.addEventListener('popstate', function(event) {
        exitFullScreen(); 
        const lightbox = document.getElementById('myLightbox');
        if(lightbox && lightbox.style.display === "flex") {
            closeLightboxLogic();
        }
    });

    // --- FUNCIONES FULLSCREEN ---
    function toggleFullScreen(elem) {
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => console.log(err));
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
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

    // --- LÓGICA MÓVIL (ZOOM + PAN + SIN BARRIDO) ---
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
            
            // ACTIVAR ZOOM EN ESTA IMAGEN
            enableZoom(itemDiv, newImg);

            itemDiv.appendChild(newImg);
            snapWrapper.appendChild(itemDiv);
        });

        // SALTO INSTANTÁNEO (EVITAR BARRIDO)
        snapWrapper.style.scrollSnapType = 'none';
        snapWrapper.style.scrollBehavior = 'auto';

        const width = window.innerWidth;
        const targetPos = (startIndex - 1) * width;
        snapWrapper.scrollLeft = targetPos;

        requestAnimationFrame(() => {
            setTimeout(() => {
                snapWrapper.style.scrollSnapType = 'x mandatory';
                snapWrapper.style.scrollBehavior = 'smooth';
            }, 50); 
        });
    }

    // === LÓGICA DE ZOOM (DOBLE TAP + PINCH + PAN) ===
    function enableZoom(container, img) {
        let currentScale = 1;
        let lastTap = 0;
        let isPinching = false;
        let startDist = 0;
        let startScale = 1;
        
        // Variables para Pan
        let startX = 0, startY = 0;
        let moveX = 0, moveY = 0;
        let initialMoveX = 0, initialMoveY = 0;

        // DOBLE TAP
        container.addEventListener('touchstart', function(e) {
            const now = new Date().getTime();
            const tapGap = now - lastTap;
            
            // Detección Doble Tap
            if (tapGap < 300 && tapGap > 0 && e.touches.length === 1) {
                e.preventDefault(); // Evitar zoom nativo del navegador
                if (currentScale > 1) {
                    resetZoom();
                } else {
                    zoomIn();
                }
            }
            lastTap = now;

            // Detección Inicio Pinch
            if (e.touches.length === 2) {
                isPinching = true;
                startDist = getDistance(e.touches);
                startScale = currentScale;
                img.style.transition = 'none'; // Quitar transición para respuesta inmediata
            }

            // Detección Inicio Pan (Solo si hay zoom)
            if (e.touches.length === 1 && currentScale > 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                initialMoveX = moveX;
                initialMoveY = moveY;
            }
        });

        container.addEventListener('touchmove', function(e) {
            // Lógica Pinch
            if (isPinching && e.touches.length === 2) {
                e.preventDefault(); // Evitar scroll de la página
                e.stopPropagation(); // Evitar scroll del carrusel
                
                const dist = getDistance(e.touches);
                const scaleChange = dist / startDist;
                currentScale = Math.min(Math.max(1, startScale * scaleChange), 4); // Min 1x, Max 4x
                updateTransform();
            }

            // Lógica Pan
            if (!isPinching && e.touches.length === 1 && currentScale > 1) {
                e.preventDefault(); // Evitar scroll nativo
                e.stopPropagation(); // CRÍTICO: Evitar que el carrusel se mueva
                
                const deltaX = e.touches[0].clientX - startX;
                const deltaY = e.touches[0].clientY - startY;
                
                moveX = initialMoveX + deltaX;
                moveY = initialMoveY + deltaY;
                
                // Limitar Pan para no salir de la imagen (Opcional, pero recomendado)
                // updateTransform maneja la aplicación
                updateTransform(); 
            }
        });

        container.addEventListener('touchend', function(e) {
            if (isPinching && e.touches.length < 2) {
                isPinching = false;
                img.style.transition = 'transform 0.3s ease-out'; // Restaurar suavidad
                if (currentScale < 1.1) resetZoom(); // Si soltó cerca de 1, resetear
            }
        });

        function zoomIn() {
            currentScale = 2.5;
            moveX = 0; moveY = 0;
            img.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            updateTransform();
        }

        function resetZoom() {
            currentScale = 1;
            moveX = 0; moveY = 0;
            img.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            updateTransform();
        }

        function updateTransform() {
            img.style.transform = `scale(${currentScale}) translate(${moveX / currentScale}px, ${moveY / currentScale}px)`;
        }

        function getDistance(touches) {
            return Math.hypot(
                touches[0].clientX - touches[1].clientX,
                touches[0].clientY - touches[1].clientY
            );
        }
    }


    // =========================================================
    //   4. GALERÍA SCROLL (MANUAL) - [CORRECCIÓN ANIMACIÓN DESKTOP]
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
            
            // CORRECCIÓN: SE ELIMINÓ loading="lazy" PARA QUE LA ANIMACIÓN
            // DE ENTRADA FUNCIONE CORRECTAMENTE EN ESCRITORIO
            
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
    // RESTAURADO A 768px
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