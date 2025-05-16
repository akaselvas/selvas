// isotope-manager.js - Isotope initialization and portfolio grid management

const IsotopeManager = (function() {
    // Private variables
    let portfolioGrid;
    let iso; // Isotope instance
    let allItems = []; // All portfolio items
    let loadMoreBtn;
    let itemsPerPage = 9;
    let currentlyShownItems = 0;
    let isInitialized = false;

    // Initialize module
    function init() {
        portfolioGrid = document.querySelector('.portfolio-grid');
        
        if (!portfolioGrid) {
            console.error("Portfolio grid container not found.");
            return false;
        }

        if (typeof Isotope !== 'function') {
            console.error("Isotope library not loaded or not a function.");
            return false;
        }

        // Find or create loadMoreBtn in window.load event
        // window.addEventListener('load', setupIsotope);
        window.addEventListener('portfolioItemsLoaded', setupIsotope);
        console.log("IsotopeManager: Initialized and waiting for 'portfolioItemsLoaded' event."); // Add log

        return true;
    }

    // Set up Isotope after all items are loaded
    function setupIsotope() {
        // Check if already initialized to prevent running twice if event fires multiple times somehow
        if (isInitialized) {
            console.log("IsotopeManager: Setup already run.");
            return;
        }
        console.log("IsotopeManager: 'portfolioItemsLoaded' event received, running setup."); // Add log


        if (!portfolioGrid || typeof Isotope !== 'function') {
            console.error("Isotope cannot initialize. Grid or Isotope library missing.");
            return;
        }

        allItems = Array.from(portfolioGrid.querySelectorAll('.isotope-item'));
        const totalItems = allItems.length;
        console.log(`IsotopeManager: Found ${totalItems} isotope items dynamically.`); // Now should be > 0

        if (totalItems === 0) {
            console.warn("No portfolio items found to initialize Isotope with.");
            return;
        }

        // Initial hide/show based on pagination
        allItems.forEach((item, index) => {
            if (index >= itemsPerPage) item.classList.add('hidden');
            else item.classList.remove('hidden');
        });
        currentlyShownItems = Math.min(itemsPerPage, totalItems);

        // Initialize Isotope with animation options
        iso = new Isotope(portfolioGrid, {
            itemSelector: '.isotope-item',
            layoutMode: 'masonry',
            percentPosition: true,
            masonry: {
                columnWidth: '.grid-sizer', // <-- CHANGE TO THIS
                gutter: 0 // <-- ADD THIS LINE (using 24px from --spacing-xl)
            },
            transitionDuration: '0.6s',
            visibleStyle: { opacity: 1, transform: 'scale(1)' },
            hiddenStyle: { opacity: 0, transform: 'scale(0.001)' },
            filter: (itemElem) => !itemElem.classList.contains('hidden')
        });

        // Use imagesLoaded to ensure layout is correct after images load
        // This is crucial for masonry with variable height images
        imagesLoaded(portfolioGrid).on('always', function() { // Use 'always'
            // This 'always' callback might fire multiple times if imagesLoaded is triggered again
            // (e.g. by loadMore). The 'isInitialized' flag here ensures we only do the
            // *initial* setup and event dispatch once.
            if (!isInitialized) {
                iso.layout(); // Perform initial layout
                console.log("IsotopeManager: Initial layout complete and images loaded/failed for the first batch.");

                // *** NEW: Dispatch custom event indicating Isotope is ready ***
                window.dispatchEvent(new CustomEvent('isotopeFirstLayoutDone'));
                console.log("IsotopeManager: 'isotopeFirstLayoutDone' event dispatched.");

                isInitialized = true; // Mark as initialized (IMPORTANT: do this *inside* the if block)
                
                // MOVED HERE: Create button and update visibility *after* initial layout and event dispatch
                createLoadMoreButton();
                updateLoadMoreButtonVisibility();
                
                console.log("IsotopeManager: Isotope fully initialized and ready signal sent.");
            } else {
                // If imagesLoaded fires again (e.g., after 'Load More'), just relayout.
                iso.layout();
                console.log("IsotopeManager: imagesLoaded 'always' fired again, relayout performed.");
            }
        });
        
        console.log("IsotopeManager: Isotope initialized successfully.");
        isInitialized = true; // Mark as initialized

        // Create or find Load More button
        createLoadMoreButton();
        updateLoadMoreButtonVisibility();

        // Initial layout
        // iso.layout();
    }

    // Create Load More button
    function createLoadMoreButton() {
        const existingLoadMoreContainer = document.querySelector('.load-more-container');

        if (!existingLoadMoreContainer && portfolioGrid.parentNode) {
            const loadMoreContainer = document.createElement('div');
            loadMoreContainer.className = 'load-more-container';

            loadMoreBtn = document.createElement('button');
            // --- MODIFICATION START ---
            // Add 'filter-btn' class for base styling
            loadMoreBtn.className = 'load-more-btn filter-btn btn-icon-underline';
            // Set innerHTML to include text and the icon structure
            loadMoreBtn.innerHTML = `
                LOAD  MORE
                <span class="plus" aria-hidden="true">
                    <svg viewBox="0 0 24 24" class="plus-icon" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </span>
            `;
            // --- MODIFICATION END ---
            loadMoreBtn.addEventListener('click', handleLoadMore);
            loadMoreBtn.setAttribute('data-listener-attached', 'true');

            loadMoreContainer.appendChild(loadMoreBtn);
            // Insert container AFTER the portfolio section, not just the grid
            const portfolioSection = portfolioGrid.closest('.portfolio');
            if (portfolioSection && portfolioSection.parentNode) {
                 portfolioSection.parentNode.insertBefore(loadMoreContainer, portfolioSection.nextSibling);
            } else {
                 portfolioGrid.parentNode.insertBefore(loadMoreContainer, portfolioGrid.nextSibling);
                 console.warn("Could not find .portfolio section, inserting load more button relative to grid parent.");
            }

            console.log("Load More button created.");
        } else if (existingLoadMoreContainer) {
            loadMoreBtn = existingLoadMoreContainer.querySelector('.load-more-btn');

            // Ensure listener is attached if button already exists but script re-runs
            if (loadMoreBtn && !loadMoreBtn.hasAttribute('data-listener-attached')) {
                loadMoreBtn.addEventListener('click', handleLoadMore);
                loadMoreBtn.setAttribute('data-listener-attached', 'true');
                 // --- MODIFICATION START ---
                 // Ensure classes and innerHTML are correct if button existed previously
                if (!loadMoreBtn.classList.contains('filter-btn')) {
                    loadMoreBtn.classList.add('filter-btn');
                }
                if (!loadMoreBtn.classList.contains('btn-icon-underline')) { // Check for new class
                    loadMoreBtn.classList.add('btn-icon-underline');      // Add new class
                }
                 if (!loadMoreBtn.querySelector('.plus')) { // Check structure
                     loadMoreBtn.innerHTML = `
                        LOAD MORE
                        <span class="plus" aria-hidden="true">
                            <svg viewBox="0 0 24 24" class="plus-icon" xmlns="http://www.w3.org/2000/svg">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </span>
                    `;
                 }
                 // --- MODIFICATION END ---
            }

            console.log("Load More button found.");
        } else {
            console.error("Could not find parent node for portfolio grid/section to attach Load More button.");
        }
    }

    // Handle Load More button click
    function handleLoadMore() {
        if (!iso) return;
        console.log("Load More clicked.");
        
        const filterModule = window.filterMenu; // Reference to FilterMenu module
        const currentFilter = filterModule ? filterModule.getActiveFilter() : '*';
        let newlyShownCount = 0;

        const potentialItemsToShow = allItems.filter(item =>
            (currentFilter === '*' || item.matches(currentFilter)) && item.classList.contains('hidden')
        );

        potentialItemsToShow.slice(0, itemsPerPage).forEach(item => {
            item.classList.remove('hidden');
            newlyShownCount++;
        });

        console.log(`Showing ${newlyShownCount} more items.`);
        
        if (newlyShownCount > 0) {
            iso.arrange({ filter: (itemElem) => !itemElem.classList.contains('hidden') });
                // Trigger layout after newly loaded images are ready
            imagesLoaded(portfolioGrid).on('progress', function () {
                iso.layout();
            });
        }

        // Update counter
        currentlyShownItems = allItems.filter(item =>
            (currentFilter === '*' || item.matches(currentFilter)) && !item.classList.contains('hidden')
        ).length;

        updateLoadMoreButtonVisibility();
    }

    // Update Load More button visibility
    function updateLoadMoreButtonVisibility() {
        if (!loadMoreBtn || !iso) return;
        
        const filterModule = window.filterMenu; // Reference to FilterMenu module
        const currentFilter = filterModule ? filterModule.getActiveFilter() : '*';

        const totalPotentialItems = allItems.filter(item => 
            currentFilter === '*' || item.matches(currentFilter)
        ).length;
        
        const currentlyVisibleFilteredItems = allItems.filter(item =>
            (currentFilter === '*' || item.matches(currentFilter)) && !item.classList.contains('hidden')
        ).length;

        if (currentlyVisibleFilteredItems >= totalPotentialItems) {
            loadMoreBtn.style.display = 'none';
            console.log("Hiding Load More button.");
        } else {
            loadMoreBtn.style.display = 'inline-block';
            console.log("Showing Load More button.");
        }
    }

    // Apply filter from outside the module
    function applyFilter(filterValue) {
        if (!iso) {
            console.warn("Isotope not ready, cannot apply filter.");
            return;
        }

        console.log(`Arranging Isotope for filter: ${filterValue}`);
        
        // Reset visibility
        allItems.forEach(item => item.classList.add('hidden'));
        
        // Show filtered items up to itemsPerPage
        const filteredItems = allItems.filter(item => 
            filterValue === '*' || item.matches(filterValue)
        );
        
        filteredItems.slice(0, itemsPerPage).forEach(itemToShow => 
            itemToShow.classList.remove('hidden')
        );
        
        currentlyShownItems = filteredItems.slice(0, itemsPerPage).length;

        // Apply filter to isotope
        iso.arrange({ filter: (itemElem) => !itemElem.classList.contains('hidden') });
        
        // Update load more button
        updateLoadMoreButtonVisibility();
    }
 
    // Public API
    return {
        init: init,
        applyFilter: applyFilter,
        isInitialized: function() {
            return isInitialized && iso !== undefined;
        },
        getIsotope: function() {
            return iso;
        },
        refreshLayout: function() {
            if (iso) iso.layout();
        }
    };
})();

// Export module
export default IsotopeManager;