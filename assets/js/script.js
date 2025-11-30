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
        
        // 768px para proteger visualización Desktop
        const isMobile = window.innerWidth <= 768;
        const imgPrefix = isMobile ? 'carrumob' : 'carru';
        const totalImages = 8; 

        for (let i = 1; i <= totalImages; i++) {
            const domImg = document.createElement('img');
            domImg.className = 'carousel-slide'; 
            domImg.src = `assets/img/carruselHOME/${imgPrefix}${i}.jpg`;
            domImg.alt = `Portada Eivind Street ${i}`;
            // Lazy loading aquí está bien (no afecta animación de entrada)
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
    //   3. LÓGICA LIGHTBOX (FULLSCREEN REAL + ZOOM)
    // =========================================================
    let lightboxIndex = 1;
    
    window.openLightbox = function(n) {
        const lightbox = document.getElementById('myLightbox');
        if(!lightbox) return;

        lightbox.style.display = "flex"; 
        
        const backToTop = document.getElementById("backToTop");
        if(backToTop) backToTop.style.display = "none";

        // LÓGICA MÓVIL (<= 768px)
        if (window.innerWidth <= 768) {
            toggleFullScreen(lightbox); 
            buildMobileGallery(n);
        } else {
            // LÓGICA ESCRITORIO
            lightbox.style.justifyContent = "center"; 
            lightbox.style.alignItems = "center";
            currentLightboxSlide(n);
        }

        // Empujar estado para botón atrás
        history.pushState({lightboxOpen: true}, "", "#lightbox");
    };

    window.closeLightbox = function() {
        // Intentar salir de fullscreen primero
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            exitFullScreen();
        } else {
            performClose();
            if (history.state && history.state.lightboxOpen) {
                history.back();
            }
        }
    };

    // Función interna para limpiar el DOM
    function performClose() {
        const lightbox = document.getElementById('myLightbox');
        if(lightbox) lightbox.style.display = "none";
        
        const snapWrapper = document.getElementById('mobileSnapWrapper');
        if(snapWrapper) snapWrapper.innerHTML = ''; 
        
        const backToTop = document.getElementById("backToTop");
        if(backToTop && window.scrollY > 400) backToTop.style.display = "flex";
    }

    // DETECTAR SALIDA DE FULLSCREEN (Para cerrar galería al dar Atrás en Android)
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            performClose();
            if (history.state && history.state.lightboxOpen) history.back();
        }
    });
    document.addEventListener('webkitfullscreenchange', () => {
        if (!document.webkitFullscreenElement) performClose();
    });

    window.addEventListener('popstate', function(event) {
        if (document.fullscreenElement) exitFullScreen();
        performClose();
    });

    // --- FUNCIONES FULLSCREEN ---
    function toggleFullScreen(elem) {
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => console.log(err));
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        }
    }

    function exitFullScreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.log(err));
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
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

    // --- LÓGICA MÓVIL (ZOOM + BARRIDO CORREGIDO) ---
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

        originalImages.forEach((img) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'mobile-snap-item';
            const newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.alt = img.alt;
            newImg.loading = "eager"; 
            
            enableZoom(itemDiv, newImg);
            itemDiv.appendChild(newImg);
            snapWrapper.appendChild(itemDiv);
        });

        snapWrapper.style.scrollSnapType = 'none';
        snapWrapper.style.scrollBehavior = 'auto';
        
        const width = window.innerWidth;
        snapWrapper.scrollLeft = (startIndex - 1) * width;

        requestAnimationFrame(() => {
            setTimeout(() => {
                snapWrapper.style.scrollSnapType = 'x mandatory';
                snapWrapper.style.scrollBehavior = 'smooth';
            }, 50); 
        });
    }

    // === LÓGICA DE ZOOM (DOBLE TAP + PINCH) ===
    function enableZoom(container, img) {
        let currentScale = 1;
        let lastTap = 0;
        let isPinching = false;
        let startDist = 0;
        let startScale = 1;
        let startX = 0, startY = 0;
        let moveX = 0, moveY = 0;
        let initialMoveX = 0, initialMoveY = 0;

        container.addEventListener('touchstart', function(e) {
            const now = new Date().getTime();
            const tapGap = now - lastTap;
            
            if (tapGap < 300 && tapGap > 0 && e.touches.length === 1) {
                e.preventDefault(); 
                if (currentScale > 1) resetZoom();
                else zoomIn();
            }
            lastTap = now;

            if (e.touches.length === 2) {
                isPinching = true;
                startDist = getDistance(e.touches);
                startScale = currentScale;
                img.style.transition = 'none';
            }

            if (e.touches.length === 1 && currentScale > 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                initialMoveX = moveX;
                initialMoveY = moveY;
            }
        });

        container.addEventListener('touchmove', function(e) {
            if (isPinching && e.touches.length === 2) {
                e.preventDefault(); e.stopPropagation();
                const dist = getDistance(e.touches);
                currentScale = Math.min(Math.max(1, startScale * (dist / startDist)), 4);
                updateTransform();
            }

            if (!isPinching && e.touches.length === 1 && currentScale > 1) {
                e.preventDefault(); e.stopPropagation();
                const deltaX = e.touches[0].clientX - startX;
                const deltaY = e.touches[0].clientY - startY;
                moveX = initialMoveX + deltaX;
                moveY = initialMoveY + deltaY;
                updateTransform(); 
            }
        });

        container.addEventListener('touchend', function(e) {
            if (isPinching && e.touches.length < 2) {
                isPinching = false;
                img.style.transition = 'transform 0.3s ease-out';
                if (currentScale < 1.1) resetZoom();
            }
        });

        function zoomIn() {
            currentScale = 2.5; moveX = 0; moveY = 0;
            img.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            updateTransform();
        }

        function resetZoom() {
            currentScale = 1; moveX = 0; moveY = 0;
            img.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            updateTransform();
        }

        function updateTransform() {
            img.style.transform = `scale(${currentScale}) translate(${moveX / currentScale}px, ${moveY / currentScale}px)`;
        }

        function getDistance(touches) {
            return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
        }
    }


    // =========================================================
    //   4. GALERÍA SCROLL (ANIMACIÓN CORREGIDA + ANTI-BUG CARGA)
    // =========================================================
    window.initScrollGallery = function(folderPath, imagePrefix, totalImages) {
        const container = document.getElementById('scroll-gallery');
        if (!container) return;

        // Margen -50px asegura que la animación inicie al entrar un poco en pantalla
        const observerOptions = { 
            root: null, 
            rootMargin: '0px 0px -50px 0px', 
            threshold: 0.15 
        };
        
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
            
            // NO USAR LAZY LOAD AQUÍ (Para que funcione la animación)
            
            domImg.onclick = function() { openLightbox(i); };

            // Lógica para detectar orientación y asignar tamaño
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

            // ¡¡CORRECCIÓN CRÍTICA!! 
            // Si la imagen ya está en caché, onload no dispara.
            // Forzamos la comprobación.
            if (domImg.complete) {
                domImg.onload();
            }

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