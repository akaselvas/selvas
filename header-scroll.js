// header-scroll.js - Header scroll behavior and animation

// Module Pattern for encapsulation
const HeaderScroll = (function() {
    // Private variables
    let header;
    let body;
    let mainNav;
    let headerContainer;
    let initialHeaderHeight = 0;
    let finalHeaderHeight = 0;
    let shrinkDistance = 0;
    let isTicking = false;

    // Initialize module
    function init() {
        // Select elements
        header = document.querySelector('.header');
        body = document.body;
        mainNav = header ? header.querySelector('.main-nav') : null;
        headerContainer = header ? header.querySelector('.container') : null;

        if (!header) {
            console.error("Header element not found.");
            return false;
        }

        // Calculate dimensions after DOM is loaded
        setTimeout(() => {
            calculateHeaderDimensions();
            handleHeaderScroll(); // Initial check in case page loads scrolled
            window.addEventListener('scroll', onScroll, { passive: true });
        }, 0);

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            calculateHeaderDimensions();
            handleHeaderScroll();
        });

        return true;
    }

    // Calculate header dimensions
    function calculateHeaderDimensions() {
        if (!header) return;

        // Temporarily reset any fixed height to get natural height
        header.style.height = '';
        header.classList.remove('is-fixed', 'is-shrinking');

        initialHeaderHeight = header.offsetHeight;

        // Get final height from CSS variable
        const finalHeightVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height-final');
        finalHeaderHeight = parseInt(finalHeightVar, 10) || 55; // Fallback value

        // Set initial height CSS variable for body padding
        document.documentElement.style.setProperty('--header-height-initial', `${initialHeaderHeight}px`);

        shrinkDistance = initialHeaderHeight - finalHeaderHeight;

        console.log(`Initial Header Height: ${initialHeaderHeight}px`);
        console.log(`Final Header Height: ${finalHeaderHeight}px`);
        console.log(`Shrink Distance: ${shrinkDistance}px`);

        // Re-apply initial height for consistency
        header.style.height = `${initialHeaderHeight}px`;
    }

    // Handle header scroll states
    function handleHeaderScroll() {
        if (!header || !mainNav || !headerContainer) return;
    
        const scrollY = window.scrollY;
    
        // Cap scroll distance to shrinkDistance
        const scrollProgress = Math.min(scrollY, shrinkDistance);
        const scrollRatio = scrollProgress / shrinkDistance;
    
        // Interpolate height
        const currentHeight = initialHeaderHeight - (initialHeaderHeight - finalHeaderHeight) * scrollRatio;
        header.style.height = `${currentHeight}px`;
    
        // Interpolate nav position (from 0 to 10px margin-top)
        const navOffset = 10 * scrollRatio;
        mainNav.style.transform = `translateY(${10 - (10 * scrollRatio)}px)`;
    
        // Align items progressively from center to flex-start
        const alignProgress = scrollRatio < 0.5 ? 'center' : 'flex-start';
        // headerContainer.style.alignItems = alignProgress;
        headerContainer.style.alignItems = 'flex-start'; // Stay consistent
    
        // Optional: remove class toggling completely if it's causing jumps
        header.classList.remove('is-shrinking', 'is-fixed');
        body.classList.add('body-padding-active');
        header.style.position = 'fixed';
        header.style.top = '0';
    }

    // Scroll event listener with throttling
    function onScroll() {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                isTicking = false;
            });
            isTicking = true;
        }
    }

    // Public API
    return {
        init: init
    };
})();

// Export module
export default HeaderScroll;