// filter-menu.js - Filter menu functionality and category selection

const FilterMenu = (function() {
    // Private variables
    let filterBar;
    let typeOfWorkBtn;
    let plus;
    let filterTrigger;
    let heroText;
    let heroLightText;
    let heroBoldText;
    let expandedMenu;
    let heroSection; // Added heroSection variable

    // Text mapping for each category
    const heroTextMap = {
        'Everything': { light: 'We find the artfulness', bold: 'in your brand' },
        'Web Design': { light: 'We craft the journey', bold: 'of your online presence' },
        'Poster': { light: 'We highlight the impact', bold: 'of your visual' },
        'Album Cover': { light: 'We visualize the sound', bold: 'of your music' },
        'Brand Identity': { light: 'We define the essence', bold: 'of your business' },
        'Projection Mapping': { light: 'We transform the space', bold: 'with your vision' },
        'Products': { light: 'We enhance the appeal', bold: 'of your offerings' },
        'Book': { light: 'We design the experience', bold: 'of your story' },
        'Illustration': { light: 'We visualize the concept', bold: 'through your lines' }
    };

    // Filter class mapping for isotope filtering
    const filterClassMap = {
        'Everything': '*',
        'Web Design': '.web-design',
        'Poster': '.poster',
        'Album Cover': '.album-cover',
        'Brand Identity': '.brand-identity',
        'Projection Mapping': '.projection-mapping',
        'Products': '.products',
        'Book': '.book',
        'Illustration': '.illustration'
    };

    // Initialize module
    function init(isotopeManager, textAnimator) {
        // Select elements
        filterBar = document.querySelector('.filter-bar');
        typeOfWorkBtn = document.querySelector('.filter-dropdown .filter-btn');
        plus = typeOfWorkBtn ? typeOfWorkBtn.querySelector('.plus') : null;
        filterTrigger = document.querySelector('.filter-options > .filter-btn:not(.filter-dropdown .filter-btn)');
        heroText = document.querySelector('.hero-text');
        heroLightText = heroText ? heroText.querySelector('.light-text') : null;
        heroBoldText = heroText ? heroText.querySelector('.bold-text') : null;
        heroSection = document.querySelector('.hero'); // Select the hero section

        if (!filterBar) {
            console.error("Filter bar element not found.");
            return false;
        }
        if (!heroSection) {
             console.error("Hero section element not found. Cannot calculate sticky threshold.");
             // Continue initialization but scroll logic might fail
        }


        // Create expanded menu if it doesn't exist
        createExpandedMenu(); // This will set the 'expandedMenu' variable

        // Ensure expandedMenu was successfully created
        if (!expandedMenu) {
             console.error("Expanded menu could not be created.");
             return false;
        }

        // Set up event listeners
        attachTypeOfWorkButtonListeners();
        attachCategoryLinkListeners(isotopeManager, textAnimator);

        return true;
    }

    // Create expanded menu with category links
    function createExpandedMenu() {
        // Check if expandedMenu is already set (e.g., from a previous init call or if HTML already had it)
        if (expandedMenu) {
             console.log("Expanded menu already exists.");
             return;
        }

        // Try to find it in the DOM first in case it was added server-side or by other means
        expandedMenu = document.querySelector('.expanded-menu');
        if (expandedMenu) {
             console.log("Expanded menu found in DOM.");
             return;
        }

        // If not found, create it
        if (filterBar) {
            expandedMenu = document.createElement('div');
            expandedMenu.className = 'expanded-menu';

            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'category-grid';

            Object.keys(heroTextMap).forEach((category) => {
                const categoryLink = document.createElement('a');
                categoryLink.href = '#';
                categoryLink.textContent = category;
                categoryLink.className = 'category-link';
                categoryLink.dataset.filter = filterClassMap[category] || '*';

                if (category === 'Everything') {
                    categoryLink.classList.add('active');
                }

                categoryGrid.appendChild(categoryLink);
            });

            expandedMenu.appendChild(categoryGrid);

            const filterBarContainer = filterBar.querySelector('.container');
            if (filterBarContainer) {
                filterBarContainer.appendChild(expandedMenu);
            } else {
                filterBar.appendChild(expandedMenu);
            }

            console.log("Expanded menu created and appended.");
        } else {
            console.error("Cannot create expanded menu: filterBar not found.");
        }
    }


    // Attach listeners to the "Type of Work" filter button
    function attachTypeOfWorkButtonListeners() {
        if (typeOfWorkBtn && expandedMenu && plus) {
            // Click listener
            typeOfWorkBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Type of Work button clicked.");
                expandedMenu.classList.toggle('active');
                typeOfWorkBtn.classList.toggle('active-state');

                // The hover listeners below handle the rotation when the menu is closed.
                // We only need to ensure the rotation is correct when the menu is active.
                if (expandedMenu.classList.contains('active')) {
                     plus.classList.add('rotated');
                     console.log("Menu opened, adding .rotated to plus.");
                } else {
                     // If menu is closing via click, ensure rotated class is removed
                     // unless the mouse is still hovering (handled by mouseleave below)
                     if (!typeOfWorkBtn.matches(':hover')) {
                         plus.classList.remove('rotated');
                         console.log("Menu closed by click, removing .rotated.");
                     } else {
                         console.log("Menu closed by click, but mouse is still hovering.");
                     }
                }
            });

            // Hover listeners
            typeOfWorkBtn.addEventListener('mouseenter', function() {
                // Only add rotated class on hover if the menu is NOT active
                if (!expandedMenu.classList.contains('active')) {
                    plus.classList.add('rotated');
                    console.log("Hovering (menu closed), adding .rotated.");
                }
            });

            typeOfWorkBtn.addEventListener('mouseleave', function() {
                 // Only remove rotated class on mouseleave if the menu is NOT active
                if (!expandedMenu.classList.contains('active')) {
                    plus.classList.remove('rotated');
                    console.log("Mouse left (menu closed), removing .rotated.");
                }
            });

            console.log("Filter button listeners attached.");
        } else {
            if (!typeOfWorkBtn) console.error("'.filter-dropdown .filter-btn' not found.");
            if (!plus) console.error("'.plus' element inside filter button not found.");
            if (!expandedMenu) console.error("'.expanded-menu' not found.");
            console.error("Could not attach listeners for 'Type of Work' button due to missing elements.");
        }
    }

    // Attach listeners to category links
    function attachCategoryLinkListeners(isotopeManager, textAnimator) {
        if (!expandedMenu) {
            console.error("Cannot attach category listeners: expandedMenu not found.");
            return;
        }

        const categoryLinks = expandedMenu.querySelectorAll('.category-link');
        console.log(`Found ${categoryLinks.length} category links to attach listeners.`);

        categoryLinks.forEach(link => {
            // Prevent attaching multiple listeners if init is called more than once
            if (!link.hasAttribute('data-listener-attached')) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    handleFilterClick(this, isotopeManager, textAnimator);
                });
                link.setAttribute('data-listener-attached', 'true');
            }
        });
    }

    // Handle filter click
    function handleFilterClick(clickedLink, isotopeManager, textAnimator) {
        if (!isotopeManager || !isotopeManager.isInitialized()) {
            console.warn("Isotope not ready, filter click ignored.");
            return;
        }

        const categoryLinks = expandedMenu.querySelectorAll('.category-link');
        console.log(`Filter clicked: ${clickedLink.textContent}`);

        // Update active style on category links
        categoryLinks.forEach(l => l.classList.remove('active'));
        clickedLink.classList.add('active');

        const filterValue = clickedLink.dataset.filter;
        const filterText = clickedLink.textContent;

        // Deactivate button & close menu
        if (expandedMenu && expandedMenu.classList.contains('active')) {
            expandedMenu.classList.remove('active');
            console.log("Closing expanded menu.");
        }

        if (typeOfWorkBtn && typeOfWorkBtn.classList.contains('active-state')) {
            typeOfWorkBtn.classList.remove('active-state');
            console.log("Removing active-state from filter button.");
        }

        // Ensure plus icon rotation is correct after closing menu
        // This handles the case where the mouse is no longer hovering after the click
        if (plus && plus.classList.contains('rotated') && !typeOfWorkBtn.matches(':hover')) {
             plus.classList.remove('rotated');
             console.log("Removing rotated class from plus after click and mouseleave.");
        }


        // Update "Everything" button text
        if (filterTrigger) {
            filterTrigger.textContent = filterText === 'Everything' ? 'EVERYTHING' : filterText.toUpperCase();
            if (filterText === 'Everything') {
                filterTrigger.classList.add('active');
            } else {
                filterTrigger.classList.remove('active');
            }
        }

        // Apply filter to isotope
        // This will trigger the layout change and potentially change the grid height
        isotopeManager.applyFilter(filterValue);

        // --- Start Conditional Scroll Logic ---
        const portfolioSection = document.querySelector('.portfolio');
        const header = document.querySelector('.header'); // Get the header element

        if (portfolioSection && filterBar && header && heroSection) {
            // Get the height of the fixed header from the CSS variable
            const headerHeightStyle = getComputedStyle(document.documentElement).getPropertyValue('--header-height-final');
            // Parse the height, default to 60px if variable is not found or invalid
            const headerHeight = parseFloat(headerHeightStyle) || 60;

            // Calculate the scroll position where the filter bar becomes sticky.
            // This is when the bottom of the hero section reaches the top of the viewport
            // plus the final header height.
            // heroSection.offsetTop is the distance from the document top to the hero's top.
            // heroSection.offsetHeight is the height of the hero section.
            // So, heroSection.offsetTop + heroSection.offsetHeight is the absolute document position of the hero's bottom.
            // The sticky threshold is when window.scrollY makes the hero's bottom align with headerHeight from viewport top.
            // (hero.offsetTop + hero.offsetHeight) - window.scrollY = headerHeight
            // window.scrollY = (hero.offsetTop + hero.offsetHeight) - headerHeight
            const stickyThresholdY = (heroSection.offsetTop + heroSection.offsetHeight) - headerHeight;

            console.log(`Sticky threshold calculated at: ${stickyThresholdY}px`);
            console.log(`Current scroll position: ${window.scrollY}px`);

            // ONLY perform the scroll if the user is currently scrolled at or past the sticky threshold.
            if (window.scrollY >= stickyThresholdY) {
                 console.log("Current scroll is at or past sticky threshold. Performing scroll.");

                // Get the actual rendered height of the filter bar (includes its padding)
                // This is the height it will occupy when sticky.
                const filterBarHeight = filterBar.offsetHeight;

                // Calculate the desired vertical position in the viewport for the top of the portfolio section.
                // This is the combined height of the sticky header and the sticky filter bar.
                const desiredViewportTop = headerHeight + filterBarHeight;

                // Get the current position of the portfolio section relative to the viewport.
                const portfolioTopRelativeToViewport = portfolioSection.getBoundingClientRect().top;

                // Calculate the current scroll position.
                const currentScrollY = window.scrollY;

                // Calculate the absolute position of the portfolio section top from the document top.
                // This position is constant regardless of scroll.
                const portfolioAbsoluteTop = portfolioTopRelativeToViewport + currentScrollY;

                // Calculate the desired absolute scroll position.
                // We want the portfolioAbsoluteTop to be visible at desiredViewportTop in the viewport.
                // So, the window needs to be scrolled such that portfolioAbsoluteTop is at the top of the viewport
                // minus the desiredViewportTop offset.
                const desiredScrollY = portfolioAbsoluteTop - desiredViewportTop;

                // Scroll to the desired position.
                // Ensure the scroll position is not less than 0.
                window.scrollTo({
                    top: Math.max(0, desiredScrollY),
                    behavior: 'smooth' // Optional: for smooth scrolling
                });

                console.log(`Scrolling to position: ${Math.max(0, desiredScrollY)}`);

            } else {
                console.log("Current scroll is above sticky threshold. No automatic scroll performed.");
                // If not scrolled past the threshold, the filter bar is not sticky,
                // and we don't want to force a scroll that would make it sticky.
                // The portfolio height changes, but the user's scroll position is preserved.
            }
        } else {
            console.warn("Could not find portfolio section, filter bar, header, or hero section to perform conditional scroll after filter.");
        }
        // --- End Conditional Scroll Logic ---


        // Update hero text
        if (heroText && heroLightText && heroBoldText && textAnimator) {
            console.log("Animating hero text.");
            heroText.classList.add('animate-out');

            setTimeout(() => {
                const newHeroText = heroTextMap[filterText] || heroTextMap['Everything'];
                heroLightText.textContent = newHeroText.light;
                heroBoldText.textContent = newHeroText.bold;

                // Re-split text for animation
                textAnimator.splitText(heroLightText);
                textAnimator.splitText(heroBoldText);

                heroText.classList.remove('animate-out');
                heroText.classList.add('animate-in');

                // Remove animate-in class after animation duration
                setTimeout(() => heroText.classList.remove('animate-in'), 1500);
            }, 750); // Half of the animation duration
        }
    }

    // Public API
    return {
        init: init,
        getActiveFilter: function() {
            if (!expandedMenu) return '*';
            return expandedMenu.querySelector('.category-link.active')?.dataset.filter || '*';
        }
    };
})();

// Export module
export default FilterMenu;