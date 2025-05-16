//hero-background-manager.js
const HeroBackgroundManager = (() => {
    const MOBILE_BREAKPOINT = 576; // px, should match your CSS media query
    let threeJsScriptsLoaded = false;
    let carouselInterval;

    const baseUrl = import.meta.env.BASE_URL;
    const threeJsScriptSources = [
        'https://cdnjs.cloudflare.com/ajax/libs/three.js/r77/three.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.4/TweenMax.min.js',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/bas.js',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/OrbitControls-2.js',
        `${baseUrl}script.js` // Your local Three.js animation script
    ];

    function loadScript(src, container) {
        return new Promise((resolve, reject) => {
            // Check if script already exists to prevent duplicate loading
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            // script.async = true; // Can be true for libraries
            // For your custom script.js, ensure dependencies are loaded first.
            // The sequential loading loop handles this.
            script.onload = () => {
                console.log(`Script loaded: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Error loading script: ${src}`);
                reject(new Error(`Failed to load script: ${src}`));
            };
            container.appendChild(script);
        });
    }

    async function initThreeJs() {
        if (threeJsScriptsLoaded) return;

        const threeJsContainer = document.getElementById('threejs-container');
        if (!threeJsContainer) {
            console.error("Three.js container not found.");
            return;
        }

        console.log("Loading Three.js scripts for desktop...");
        try {
            for (const src of threeJsScriptSources) {
                await loadScript(src, threeJsContainer);
            }
            threeJsScriptsLoaded = true;
            console.log("All Three.js scripts loaded and initialized.");
            // If your script.js needs an explicit init call after being loaded, do it here.
            // e.g., if (typeof window.initMyThreeJSAnimation === 'function') window.initMyThreeJSAnimation();
        } catch (error) {
            console.error("Failed to load one or more Three.js scripts:", error);
        }
    }

    function initCarousel() {
        const carouselContainer = document.getElementById('mobile-carousel-container');
        if (!carouselContainer) return;

        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        slides.forEach(slide => slide.classList.remove('active')); // Ensure clean state
        slides[currentSlide].classList.add('active');

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        if (carouselInterval) clearInterval(carouselInterval); // Clear previous interval
        carouselInterval = setInterval(nextSlide, 20000); // Change slide every 4 seconds
        console.log("Mobile carousel initialized.");
    }

    function updateHeroBackground() {
        const threeJsContainer = document.getElementById('threejs-container');
        const mobileCarouselContainer = document.getElementById('mobile-carousel-container');
        const scrollPrompt = document.querySelector('.hero .scroll-prompt');

        if (!threeJsContainer || !mobileCarouselContainer) {
            console.error("Hero background component containers not found.");
            return;
        }

        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            // Mobile view
            console.log("Switching to mobile hero background (carousel).");
            threeJsContainer.style.display = 'none';
            mobileCarouselContainer.style.display = 'block';
            if (scrollPrompt) scrollPrompt.style.display = 'none';
            initCarousel();
        } else {
            // Desktop view
            console.log("Switching to desktop hero background (Three.js).");
            mobileCarouselContainer.style.display = 'none';
            if (carouselInterval) clearInterval(carouselInterval);
            threeJsContainer.style.display = 'block';
            if (scrollPrompt) scrollPrompt.style.display = 'block';
            if (!threeJsScriptsLoaded) {
                initThreeJs();
            }
        }
    }

    function init() {
        // Initial setup based on current window size
        updateHeroBackground();

        // Listen for window resize to switch modes (debounced)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateHeroBackground, 250);
        });

        console.log("HeroBackgroundManager initialized.");
        return true; // Indicates successful initialization
    }

    return {
        init
    };
})();

export default HeroBackgroundManager;