document.addEventListener('DOMContentLoaded', function() {
    
    // ---- Lógica para el filtro de la galería (sin cambios) ----
    const filtroBotones = document.querySelectorAll('.filtro-btn');
    const galeriaItems = document.querySelectorAll('.galeria-item');
    const galeriaPlaceholder = document.querySelector('.galeria-placeholder');
    let currentCategory = null;
    let currentImages = [];
    let currentImageIndex = 0;

    filtroBotones.forEach(boton => {
        boton.addEventListener('click', () => {
            if (galeriaPlaceholder) {
                galeriaPlaceholder.style.display = 'none';
            }
            filtroBotones.forEach(btn => btn.classList.remove('active'));
            boton.classList.add('active');
            const filtro = boton.getAttribute('data-filter');
            currentCategory = filtro;
            currentImages = [];
            galeriaItems.forEach(item => {
                if (item.getAttribute('data-category') === filtro) {
                    item.style.display = 'grid';
                    if (!item.classList.contains('video-container')) {
                        currentImages.push(item.querySelector('img'));
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ---- Lógica para el Lightbox (sin cambios) ----
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const cerrarBtn = document.querySelector('.lightbox-cerrar');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const imagenesGaleria = document.querySelectorAll('.galeria-item img');

    imagenesGaleria.forEach((img) => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
            currentImageIndex = currentImages.findIndex(item => item.src === img.src);
        });
    });

    function showImage(index) {
        if (currentImages.length === 0) return;
        currentImageIndex = (index + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[currentImageIndex].src;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentImageIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentImageIndex + 1);
        });
    }

    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }


    // ---- LÓGICA ACTUALIZADA PARA CARRUSEL CON FUNDIDO A NEGRO ----
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselImages = document.querySelectorAll('.carousel-image');
    const carouselPrevBtn = document.querySelector('.carousel-control.prev');
    const carouselNextBtn = document.querySelector('.carousel-control.next');
    
    let currentIndex = 0;
    let isTransitioning = false; // Para evitar clics múltiples durante la animación
    let autoSlideInterval;
    const slideDuration = 5000; // 5 segundos por imagen
    const fadeDuration = 800; // 0.8 segundos de duración del fundido (debe coincidir con el CSS)

    function goToSlide(index) {
        // Si ya hay una transición en curso, no hacemos nada
        if (isTransitioning) return;
        isTransitioning = true;

        // 1. Añadimos una clase para desvanecer la imagen activa actual
        carouselContainer.classList.add('transitioning');

        // 2. Esperamos a que termine la animación de desvanecimiento
        setTimeout(() => {
            // 3. Quitamos 'active' de la imagen anterior
            carouselImages[currentIndex].classList.remove('active');

            // 4. Calculamos el nuevo índice
            currentIndex = (index + carouselImages.length) % carouselImages.length;

            // 5. Añadimos 'active' a la nueva imagen (aún está en opacity: 0)
            carouselImages[currentIndex].classList.add('active');

            // 6. Quitamos la clase de transición, lo que hará que la nueva imagen activa se haga visible (opacity: 1)
            carouselContainer.classList.remove('transitioning');
            
            // 7. La transición ha terminado
            isTransitioning = false;
        }, fadeDuration); // La duración debe coincidir con la transición en CSS
        
        resetAutoSlide();
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => goToSlide(currentIndex + 1), slideDuration);
    }

    // Event listeners para los controles
    carouselPrevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    carouselNextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Inicializar el carrusel
    carouselImages[0].classList.add('active'); // Muestra la primera imagen al cargar
    resetAutoSlide();
});