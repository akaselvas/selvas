// text-animation.js - Text splitting and animation effects

const TextAnimator = (function() {
    // Initialize module
    function init() {
        const heroText = document.querySelector('.hero-text');
        const heroLightText = heroText ? heroText.querySelector('.light-text') : null;
        const heroBoldText = heroText ? heroText.querySelector('.bold-text') : null;
        
        if (!heroText) {
            console.warn("Hero text elements not found for text animation.");
            return false;
        }
        
        // Initial text split
        if (heroLightText) splitText(heroLightText);
        if (heroBoldText) splitText(heroBoldText);
        console.log("Initial hero text split.");
        
        return true;
    }

    // Split text into spans for animation
    function splitText(element) {
        if (!element) return;
        
        const text = element.textContent;
        const words = text.split(' ').filter(word => word.length > 0); // Filter empty strings
        
        element.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.className = 'split';
            span.textContent = word;
            element.appendChild(span);
            
            if (index < words.length - 1) {
                element.appendChild(document.createTextNode(' ')); // Add space node
            }
        });
    }

    // Animate text transition
    function animateTextChange(heroText, heroLightText, heroBoldText, newLightText, newBoldText) {
        if (!heroText || !heroLightText || !heroBoldText) return;
        
        heroText.classList.add('animate-out');
        
        setTimeout(() => {
            heroLightText.textContent = newLightText;
            heroBoldText.textContent = newBoldText;
            
            splitText(heroLightText);
            splitText(heroBoldText);
            
            heroText.classList.remove('animate-out');
            heroText.classList.add('animate-in');
            
            setTimeout(() => heroText.classList.remove('animate-in'), 1500);
        }, 750);
    }

    // Public API
    return {
        init: init,
        splitText: splitText,
        animateTextChange: animateTextChange
    };
})();

// Export module
export default TextAnimator;