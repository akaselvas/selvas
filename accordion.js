// accordion.js

const Accordion = {
    init: function() {
        const accordionContainer = document.querySelector('.about-us .about-accordion');
        if (!accordionContainer) return false;

        const accordionItems = accordionContainer.querySelectorAll('.accordion-item');
        if (accordionItems.length === 0) return false;

        // --- Estimate total close animation time ---
        // This should roughly match your CSS:
        // - Content collapse duration (approx 0.5s from your CSS)
        // - Underline delay (0.4s)
        // - Underline fade duration (0.2s)
        // Add a small buffer.
        const closeAnimationDuration = 500 + 400 + 200 + 100; // 1200ms (content + delay + fade + buffer)

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (!header) {
                console.warn("Accordion item missing header:", item);
                return; // Skip this item
            }

            // Clear any lingering closing timeouts if clicked again quickly
            let closeTimeoutId = null;

            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Clear previous timeout if it exists
                if (closeTimeoutId) {
                    clearTimeout(closeTimeoutId);
                    closeTimeoutId = null;
                    // Force remove is-closing if interrupted
                    item.classList.remove('is-closing');
                }

                // --- Optional: Close other active items ---
                /*
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        // If closing others, you might want to add 'is-closing' briefly too
                        // otherItem.classList.add('is-closing');
                        // setTimeout(() => otherItem.classList.remove('is-closing'), closeAnimationDuration);
                    }
                });
                */
                // --- End Optional Block ---

                if (isActive) {
                    // --- Clicking to CLOSE ---
                    item.classList.add('is-closing'); // Add helper class
                    item.classList.remove('active');  // Remove active state

                    // Set timeout to remove the helper class after animations
                    closeTimeoutId = setTimeout(() => {
                        item.classList.remove('is-closing');
                        closeTimeoutId = null; // Clear the stored ID
                    }, closeAnimationDuration); // Use calculated duration

                } else {
                    // --- Clicking to OPEN ---
                    // Ensure is-closing is removed if somehow present
                    item.classList.remove('is-closing');
                    item.classList.add('active'); // Add active state (CSS handles instant hide)
                }
            });
        });

        return true;
    }
};

export default Accordion;