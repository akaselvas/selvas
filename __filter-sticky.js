// filter-sticky.js - Makes the filter bar sticky below the header

const FilterSticky = (function() {
    // Private variables
    let filterBar;
    let header;
    let nextSection; // The section immediately following the filter bar
    let body;
    let headerFinalHeight = 0; // Will store the final height of the fixed header
    let filterBarOffsetTop = 0; // Initial top offset of the filter bar
    let filterBarHeight = 0; // Height of the filter bar
    let isTicking = false;
    let isSticky = false; // Track sticky state

    // Initialize module
    function init() {
        filterBar = document.querySelector('.filter-bar');
        header = document.querySelector('.header');
        // Find the next sibling element section (assuming it's .portfolio)
        nextSection = filterBar ? filterBar.nextElementSibling : null;
        body = document.body;

        if (!filterBar || !header || !nextSection) {
            console.error("FilterSticky: Required elements (.header, .filter-bar, or its next sibling) not found.");
            return false;
        }

        // Get header's final height from CSS variable after a brief delay
        // to allow header-scroll.js potentially calculate/set it.
        setTimeout(calculateDimensionsAndAttachListener, 50); // Small delay

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            // Reset state before recalculating
            removeStickyStyles();
            setTimeout(calculateDimensionsAndAttachListener, 50); // Recalculate after resize
        });

        return true;
    }

    // Calculate dimensions and attach scroll listener
    function calculateDimensionsAndAttachListener() {
        if (!filterBar || !header) return;

        // Ensure header dimensions are calculated (read CSS variable)
        const finalHeightVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height-final');
        headerFinalHeight = parseInt(finalHeightVar, 10) || 60; // Use fallback if var not set

        // Ensure filter bar isn't already sticky for calculations
        filterBar.classList.remove('is-sticky');
        filterBar.style.position = '';
        filterBar.style.top = '';
        filterBar.style.width = '';
        filterBar.style.left = '';
        filterBar.style.zIndex = '';
        nextSection.style.paddingTop = ''; // Reset padding compensation

        // Calculate initial position and height
        filterBarOffsetTop = filterBar.getBoundingClientRect().top + window.scrollY;
        filterBarHeight = filterBar.offsetHeight;

        // Remove previous listener if exists
        window.removeEventListener('scroll', onScroll);
        // Add new listener
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial check
        handleFilterStickiness();

        console.log(`FilterSticky: Header Final Height: ${headerFinalHeight}px`);
        console.log(`FilterSticky: Filter Bar Offset Top: ${filterBarOffsetTop}px`);
        console.log(`FilterSticky: Filter Bar Height: ${filterBarHeight}px`);
    }

    // Handle scroll event
    function handleFilterStickiness() {
        if (!filterBar || !nextSection) return;

        const scrollY = window.scrollY;
        // Trigger point: when scrollY reaches the filter bar's original top position
        // minus the final height of the fixed header.
        const triggerPoint = filterBarOffsetTop - headerFinalHeight;

        if (scrollY >= triggerPoint && !isSticky) {
            // Make sticky
            applyStickyStyles();
            isSticky = true;
        } else if (scrollY < triggerPoint && isSticky) {
            // Make not sticky
            removeStickyStyles();
            isSticky = false;
        }
    }

    // Apply sticky styles and padding compensation
    function applyStickyStyles() {
        if (!filterBar || !nextSection) return;
        console.log("FilterSticky: Applying sticky styles");
        filterBar.classList.add('is-sticky');
        filterBar.style.top = `${headerFinalHeight}px`; // Position below fixed header
        // Add padding to the next section to prevent content jump
        nextSection.style.paddingTop = `${filterBarHeight}px`;
        // Optional: Add a class to body or nextSection if needed for other styles
        body.classList.add('filter-bar-is-sticky');
    }

    // Remove sticky styles and padding compensation
    function removeStickyStyles() {
        if (!filterBar || !nextSection) return;
        console.log("FilterSticky: Removing sticky styles");
        filterBar.classList.remove('is-sticky');
        filterBar.style.top = '';
        nextSection.style.paddingTop = '';
        body.classList.remove('filter-bar-is-sticky');
        // Reset any other inline styles if necessary
        // filterBar.style.position = ''; // Let CSS handle position via class
        // filterBar.style.width = '';
        // filterBar.style.left = '';
        // filterBar.style.zIndex = '';
    }


    // Scroll event listener with throttling
    function onScroll() {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                handleFilterStickiness();
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
export default FilterSticky;