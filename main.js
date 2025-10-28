// main.js - Main entry point that initializes all modules
import './styles.css'; // Import the CSS file

// Import modules
import HeaderScroll from './header-scroll.js';
import FilterMenu from './filter-menu.js';
import IsotopeManager from './isotope-manager.js';
import TextAnimator from './text-animation.js';
import PortfolioLoader from './portfolio-loader.js';
import Accordion from './accordion.js';
import SmoothScroll from './smooth-scroll.js';
import HeroBackgroundManager from './hero-background-manager.js';
import Lightbox from './lightbox.js';
import ContactForm from './contact-form.js';

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - Initializing modules...");

    // Initialize HeroBackgroundManager FIRST if it affects layout early, or among the first
    const heroBgManagerInit = HeroBackgroundManager.init();
    console.log("Hero Background Manager initialized:", heroBgManagerInit);

    // Initialize other modules
    const headerInit = HeaderScroll.init();
    console.log("Header Scroll module initialized:", headerInit);

    const textAnimatorInit = TextAnimator.init();
    console.log("Text Animator module initialized:", textAnimatorInit);

    const isotopeManagerInit = IsotopeManager.init();
    console.log("Isotope Manager module initialized:", isotopeManagerInit);

    // Make FilterMenu accessible globally for cross-module communication
    window.filterMenu = FilterMenu;
    const filterMenuInit = FilterMenu.init(IsotopeManager, TextAnimator);
    console.log("Filter Menu module initialized:", filterMenuInit);

    const accordionInit = Accordion.init();
    console.log("Accordion module initialized:", accordionInit);

    const portfolioLoaderInit = PortfolioLoader.init(IsotopeManager);
    console.log("Portfolio Loader module initialized:", portfolioLoaderInit);

    const smoothScrollInit = SmoothScroll.init();
    console.log("Smooth Scroll module initialized:", smoothScrollInit);

    const lightboxInit = Lightbox.init();
    console.log("Lightbox module initialized:", lightboxInit);

    const contactFormInit = ContactForm.init();
    console.log("Contact Form module initialized:", contactFormInit);

    // Listen for portfolio items loaded event
    window.addEventListener('portfolioItemsLoadedAndLightboxDataReady', function() {
        console.log("Event: portfolioItemsLoadedAndLightboxDataReady received in main.js");
        attachPortfolioClickListeners();
    });

    // --- IMPROVED ROUTING LOGIC ---
    let initialFilterApplied = false; // Flag to prevent this from running multiple times

    function applyInitialFilter() {
        if (initialFilterApplied) return; // Only run once

        const slug = window.location.hash.replace(/^#\/?/, '') || 'everything';
        console.log(`Applying initial filter from URL for slug: ${slug}`);
        FilterMenu.applyFilterFromSlug(slug);
        initialFilterApplied = true;
    }

    // The primary method: Listen for our custom event
    window.addEventListener('isotopeFirstLayoutDone', () => {
        console.log("Event: isotopeFirstLayoutDone received. Applying initial filter.");
        applyInitialFilter();
    });

    // A robust fallback: If the custom event fails, apply the filter on window.load
    window.addEventListener('load', () => {
        console.log("Event: window.load received. Checking if initial filter was applied.");
        setTimeout(() => { // Use a small timeout to ensure other scripts have finished
            if (!initialFilterApplied) {
                console.warn("Fallback: 'isotopeFirstLayoutDone' was not detected. Applying filter on window.load.");
                applyInitialFilter();
            }
        }, 100);
    });

    // Listen for subsequent hash changes (this part is for clicks, back/forward buttons)
    window.addEventListener('hashchange', () => {
        const slug = window.location.hash.replace(/^#\/?/, '') || 'everything';
        console.log(`Hash changed. Applying filter for slug: ${slug}`);
        FilterMenu.applyFilterFromSlug(slug);
    });
    // --- END: IMPROVED ROUTING LOGIC ---

    console.log("All primary modules initialized.");
});



function attachPortfolioClickListeners() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        if (item.dataset.listenerAttached === 'true') return;

        item.addEventListener('click', function(e) {
            if (e.target.closest('.portfolio-info')) {
                return;
            }

            const type = this.dataset.lightboxType;
            const mainImageSrc = this.dataset.imgSrc;
            const lightboxImageSrc = this.dataset.lightboxImageSrc;
            const alt = this.dataset.altText;

            let imageToOpen = '';
            if (type === 'expand') {
                imageToOpen = mainImageSrc;
            } else if (type === 'seemore') {
                imageToOpen = lightboxImageSrc;
            } else {
                imageToOpen = mainImageSrc;
            }

            if (imageToOpen) {
                Lightbox.open(imageToOpen, alt, type);
            } else {
                console.warn("No image source found for lightbox for item:", this);
            }
        });
        item.dataset.listenerAttached = 'true';
    });
    console.log(`Attached click listeners to ${portfolioItems.length} portfolio items for lightbox.`);
}


// Additional event listeners for window load
window.addEventListener('load', function() {
    console.log("Window loaded - Finalizing initialization (if any needed)...");
});