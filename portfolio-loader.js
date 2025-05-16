// portfolio-loader.js - Loading portfolio items from JSON

const PortfolioLoader = (function() {
    // Private variables
    let portfolioGrid;
    let loadingIndicator;

    // Initialize module
    function init(isotopeManager) {
        portfolioGrid = document.querySelector('.portfolio-grid');
        loadingIndicator = portfolioGrid ? portfolioGrid.querySelector('.loading-indicator') : null;
        
        if (!portfolioGrid) {
            console.error("Portfolio grid container not found.");
            return false;
        }
        
        // Load portfolio items
        loadPortfolioItems(isotopeManager);
        return true;
    }

    // Load portfolio items from JSON
    async function loadPortfolioItems(isotopeManager) {
        if (!portfolioGrid) {
            console.error("Portfolio grid container not found.");
            return;
        }

        const baseUrl = import.meta.env.BASE_URL; 

        try {
            const response = await fetch(`${baseUrl}portfolio-data.json`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            let portfolioData = await response.json();

            // ---- NEW: Adjust image paths in the fetched data ----
            portfolioData = portfolioData.map(item => {
                // Only prepend if imgSrc is not empty and doesn't already start with http (external)
                if (item.imgSrc && !item.imgSrc.startsWith('http') && !item.imgSrc.startsWith(baseUrl)) {
                    item.imgSrc = `${baseUrl}${item.imgSrc.startsWith('/') ? '' : '/'}${item.imgSrc}`;
                }
                if (item.lightboxImageSrc && !item.lightboxImageSrc.startsWith('http') && !item.lightboxImageSrc.startsWith(baseUrl)) {
                    item.lightboxImageSrc = `${baseUrl}${item.lightboxImageSrc.startsWith('/') ? '' : '/'}${item.lightboxImageSrc}`;
                }
                return item;
            });
            // ---- END NEW ----

            // Clear loading indicator if it exists
            if (loadingIndicator) {
                loadingIndicator.remove();
            }

            // Generate HTML for each item
            portfolioData.forEach(item => {
                const portfolioItemDiv = document.createElement('div');
                portfolioItemDiv.className = `portfolio-item isotope-item ${item.categorySlug}`;
                 // Store lightbox data on the element
                portfolioItemDiv.dataset.lightboxType = item.lightboxType || 'expand'; // Default to expand
                portfolioItemDiv.dataset.imgSrc = item.imgSrc; // Main image
                portfolioItemDiv.dataset.lightboxImageSrc = item.lightboxImageSrc || item.imgSrc; // Lightbox image
                portfolioItemDiv.dataset.altText = item.altText || item.title;

                const portfolioImageContainer = document.createElement('div'); // New container for image and overlays
                portfolioImageContainer.className = 'portfolio-image-container';

                const portfolioImageDiv = document.createElement('div');
                portfolioImageDiv.className = 'portfolio-image';

                // Check if imgSrc exists and is not empty
                if (item.imgSrc && item.imgSrc.trim() !== '') {
                    const img = document.createElement('img');
                    img.src = item.imgSrc;
                    img.alt = item.altText || item.title;
                    img.loading = 'lazy'; // Add lazy loading
                    portfolioImageDiv.appendChild(img);
                } else {
                    const placeholderDiv = document.createElement('div');
                    placeholderDiv.style.backgroundColor = item.bgColor || '#cccccc';
                    placeholderDiv.style.width = '100%';
                    placeholderDiv.style.aspectRatio = '16 / 9';
                    placeholderDiv.style.display = 'block';
                    portfolioImageDiv.appendChild(placeholderDiv);
                }

                // const portfolioOverlayDiv = document.createElement('div');
                // portfolioOverlayDiv.className = 'portfolio-overlay';

                const overlayContainer = document.createElement('div');
                overlayContainer.className = 'portfolio-item-overlays';

                const overlayExpand = document.createElement('div');
                overlayExpand.className = 'portfolio-item-overlay overlay-expand';
                overlayExpand.textContent = 'Zoom';

                const overlaySeeMore = document.createElement('div');
                overlaySeeMore.className = 'portfolio-item-overlay overlay-see-more';
                overlaySeeMore.textContent = 'See More';

                // Show the correct overlay based on lightboxType
                if (item.lightboxType === 'seemore') {
                    overlayExpand.style.display = 'none';
                } else {
                    overlaySeeMore.style.display = 'none';
                }

                overlayContainer.appendChild(overlayExpand);
                overlayContainer.appendChild(overlaySeeMore);

                portfolioImageContainer.appendChild(portfolioImageDiv);
                portfolioImageContainer.appendChild(overlayContainer); 
    
                // Create a new div to hold the title and category below the image

                const h3 = document.createElement('h3');
                h3.textContent = item.title;

                const p = document.createElement('p');
                p.textContent = item.category;

                const portfolioInfoDiv = document.createElement('div');
                portfolioInfoDiv.className = 'portfolio-info'; // <-- Give it a new class

                // Append the h3 and p to the new info div
                portfolioInfoDiv.appendChild(h3);
                portfolioInfoDiv.appendChild(p);
                
                
                portfolioItemDiv.appendChild(portfolioImageContainer);
                // portfolioItemDiv.appendChild(portfolioImageDiv);
                // portfolioItemDiv.appendChild(portfolioOverlayDiv);
                portfolioItemDiv.appendChild(portfolioInfoDiv); 

                portfolioGrid.appendChild(portfolioItemDiv);
            });

            console.log("PortfolioLoader: Portfolio items appended to DOM."); // Add log
            
            window.dispatchEvent(new Event('portfolioItemsLoadedAndLightboxDataReady'));
            
            // Initialize Isotope after items are loaded
            if (isotopeManager) {
                window.dispatchEvent(new Event('portfolioItemsLoaded'));
            }

        } catch (error) {
            console.error("PortfolioLoader: Could not load portfolio data or process items:", error);

            // Re-select loading indicator in case it was removed by successful fetch but error happened later
            const currentLoadingIndicator = portfolioGrid.querySelector('.loading-indicator');
            if (currentLoadingIndicator) {
                currentLoadingIndicator.textContent = "Error loading portfolio items.";
            } else {
                 // If loading indicator was already removed (e.g., successful fetch but loop error),
                 // add a new error message if the grid is empty (only grid-sizer might be there).
                 // Check if there are actual portfolio items or just the sizer/old content
                 if (portfolioGrid.querySelectorAll('.isotope-item').length === 0) {
                     const errorDiv = document.createElement('div');
                     errorDiv.style.color = 'red';
                     errorDiv.style.textAlign = 'center';
                     errorDiv.style.width = '100%';
                     errorDiv.style.padding = '40px';
                     errorDiv.textContent = "Error loading portfolio items.";
                     portfolioGrid.appendChild(errorDiv);
                 }
            }
        }
    }

    // Public API
    return {
        init: init
    };
})();

// Export module
export default PortfolioLoader;
