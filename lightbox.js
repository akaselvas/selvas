// lightbox.js
const Lightbox = (() => {
    let lightboxElement;
    let lightboxImage;
    let lightboxContent; // Keep a reference to the content wrapper
    let closeButton;
    let isVisible = false;
    let pageContentWrapper; 

    function createLightboxDOM() {
        if (document.getElementById('portfolio-lightbox')) return;

        lightboxElement = document.createElement('div');
        lightboxElement.id = 'portfolio-lightbox';
        lightboxElement.className = 'lightbox';
        // lightboxElement.style.display = 'none'; // Handled by CSS now

        lightboxContent = document.createElement('div'); // Store reference
        lightboxContent.className = 'lightbox-content';

        closeButton = document.createElement('button');
        closeButton.className = 'lightbox-close';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close lightbox');

        lightboxImage = document.createElement('img');
        lightboxImage.className = 'lightbox-image';
        lightboxImage.alt = "Lightbox image";


        lightboxContent.appendChild(lightboxImage);
        lightboxElement.appendChild(lightboxContent);
        lightboxElement.appendChild(closeButton); 

        // lightboxContent.appendChild(closeButton);
        // lightboxContent.appendChild(lightboxImage);
        // lightboxElement.appendChild(lightboxContent);

        document.body.appendChild(lightboxElement);

        pageContentWrapper = document.getElementById('page-content-wrapper');
        if (!pageContentWrapper) {
            console.warn('Lightbox: Element with ID "page-content-wrapper" not found. Background blur effect will not be applied.');
        }

        closeButton.addEventListener('click', close);
        lightboxElement.addEventListener('click', (e) => {
            if (e.target === lightboxElement) {
                close();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isVisible) {
                close();
            }
        });
    }

    // Modified open function to accept lightboxType
    function open(imageSrc, altText, lightboxType = 'expand') { // Default to 'expand'
        if (!lightboxElement) createLightboxDOM();

        // Reset styles first
        lightboxImage.style.maxWidth = '';
        lightboxImage.style.maxHeight = '';
        lightboxImage.style.width = '';
        lightboxImage.style.height = '';
        lightboxContent.classList.remove('lightbox-content-scrollable');
        lightboxElement.classList.remove('lightbox-scrollable-wrapper');


        lightboxImage.src = imageSrc;
        lightboxImage.alt = altText || "Portfolio image detail";

        if (lightboxType === 'seemore') {
            lightboxContent.classList.add('lightbox-content-scrollable');
            lightboxElement.classList.add('lightbox-scrollable-wrapper');
        }

        document.body.classList.add('lightbox-open'); // Handles body overflow
        if (pageContentWrapper) {
            pageContentWrapper.classList.add('blurred'); // Add blur class
        }
        isVisible = true;

        // Optional: Scroll to top of lightbox content if it's scrollable
        if (lightboxType === 'seemore') {
            const scrollableArea = lightboxElement.classList.contains('lightbox-scrollable-wrapper') ? lightboxElement : lightboxContent;
            scrollableArea.scrollTop = 0;
            scrollableArea.scrollLeft = 0;
        }
    }

    function close() {
        if (!lightboxElement || !isVisible) return;

        if (lightboxContent) { // Check if lightboxContent is defined
            lightboxContent.classList.remove('lightbox-content-scrollable');
        }

        lightboxElement.classList.remove('lightbox-scrollable-wrapper');

        document.body.classList.remove('lightbox-open'); // This triggers opacity/visibility transitions
        if (pageContentWrapper) {
            pageContentWrapper.classList.remove('blurred');
        }
        isVisible = false;
    }

    function init() {
        if (!lightboxElement) {
             createLightboxDOM();
        }
        console.log("Lightbox initialized.");
        return true;
    }

    return {
        init,
        open,
        close
    };
})();

export default Lightbox;