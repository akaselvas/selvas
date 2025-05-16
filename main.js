// main.js - Main entry point that initializes all modules
import './styles.css'; // Import the CSS file

// Import modules
import HeaderScroll from './header-scroll.js';
import FilterMenu from './filter-menu.js';
// import FilterSticky from './filter-sticky.js'; // Assuming this might be added later or removed
import IsotopeManager from './isotope-manager.js';
import TextAnimator from './text-animation.js';
import PortfolioLoader from './portfolio-loader.js';
import Accordion from './accordion.js';
import SmoothScroll from './smooth-scroll.js';
import HeroBackgroundManager from './hero-background-manager.js'; // <-- IMPORT THE NEW MODULE
import Lightbox from './lightbox.js'; // <-- IMPORT LIGHTBOX
import ContactForm from './contact-form.js';

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - Initializing modules...");

    // Initialize HeroBackgroundManager FIRST if it affects layout early, or among the first
    const heroBgManagerInit = HeroBackgroundManager.init(); // <-- INITIALIZE THE MODULE
    console.log("Hero Background Manager initialized:", heroBgManagerInit);

    // Initialize other modules
    const headerInit = HeaderScroll.init();
    console.log("Header Scroll module initialized:", headerInit);

    // const filterStickyInit = FilterSticky.init(); // If you use this, initialize it here
    // console.log("Filter Sticky module initialized:", filterStickyInit);

    const textAnimatorInit = TextAnimator.init();
    console.log("Text Animator module initialized:", textAnimatorInit);

    const isotopeManagerInit = IsotopeManager.init();
    console.log("Isotope Manager module initialized:", isotopeManagerInit);

    // Make FilterMenu accessible globally for cross-module communication (if needed by IsotopeManager)
    window.filterMenu = FilterMenu;
    const filterMenuInit = FilterMenu.init(IsotopeManager, TextAnimator);
    console.log("Filter Menu module initialized:", filterMenuInit);

    const accordionInit = Accordion.init();
    console.log("Accordion module initialized:", accordionInit);

    const portfolioLoaderInit = PortfolioLoader.init(IsotopeManager);
    console.log("Portfolio Loader module initialized:", portfolioLoaderInit);

    const smoothScrollInit = SmoothScroll.init();
    console.log("Smooth Scroll module initialized:", smoothScrollInit);


    const lightboxInit = Lightbox.init(); // <-- INITIALIZE LIGHTBOX
    console.log("Lightbox module initialized:", lightboxInit);

    const contactFormInit = ContactForm.init(); // <<<<<< INITIALIZE THE CONTACT FORM MODULE
    console.log("Contact Form module initialized:", contactFormInit);


    // Listen for portfolio items loaded event
    // Listen for when portfolio items are loaded AND lightbox data is ready
    window.addEventListener('portfolioItemsLoadedAndLightboxDataReady', function() {
        console.log("Event: portfolioItemsLoadedAndLightboxDataReady received in main.js");
        attachPortfolioClickListeners();
    });

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

            const type = this.dataset.lightboxType; // Get the type
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
                // Pass the 'type' to Lightbox.open
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