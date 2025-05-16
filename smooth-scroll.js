// smooth-scroll.js (or add to main.js)

const SmoothScroll = (function() {

    function init() {
        const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
        const header = document.querySelector('.header'); // Needed for height calculation

        if (!header) {
            console.error("Smooth scroll init: Header element not found.");
            return false;
        }
        if (navLinks.length === 0) {
            console.warn("Smooth scroll init: No navigation links starting with '#' found.");
            return false;
        }

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default anchor jump

                const targetId = this.getAttribute('href'); // e.g., "#work"
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    scrollToTarget(targetElement, header);
                } else {
                    console.warn(`Smooth scroll: Target element "${targetId}" not found.`);
                }
            });
        });
        console.log("Smooth scrolling initialized for nav links.");
        return true;
    }

    function scrollToTarget(targetElement, header) {
        // Get the final fixed header height from CSS variable
        const headerHeightStyle = getComputedStyle(document.documentElement).getPropertyValue('--header-height-final');
        // Parse the height, remove 'px', default to 60 if variable missing/invalid
        const headerHeight = parseFloat(headerHeightStyle) || 60;

        // Calculate position: target's top offset from document top minus header height
        // Add a small pixel buffer for visual spacing if desired (optional)
        const buffer = -1; // Adjust as needed
        const targetPosition = targetElement.offsetTop - headerHeight - buffer;

        // Perform smooth scroll
        window.scrollTo({
            top: targetPosition < 0 ? 0 : targetPosition, // Ensure top isn't negative
            behavior: 'smooth'
        });

        // Optional: Update active class on nav links after scroll (more complex)
        // updateActiveClass(targetElement.id);
    }

    // Optional function placeholder for active link styling
    // function updateActiveClass(targetId) {
    //     const currentActive = document.querySelector('.main-nav a.active');
    //     if (currentActive) {
    //         currentActive.classList.remove('active');
    //     }
    //     const newActive = document.querySelector(`.main-nav a[href="#${targetId}"]`);
    //     if (newActive) {
    //         newActive.classList.add('active');
    //     }
    // }

    // Public API
    return {
        init: init,
        scrollToTarget: scrollToTarget // Expose if needed elsewhere
    };

})();

export default SmoothScroll;