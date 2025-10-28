// filter-menu.js - Filter menu functionality and category selection

const FilterMenu = (function() {
    // --- MODIFICATION: Centralized data structure for categories ---
    const categories = {
        'everything': {
            name: 'Everything',
            filter: '*',
            light: 'We find the artfulness',
            bold: 'in your brand'
        },
        'web-design': {
            name: 'Web Design',
            filter: '.web-design',
            light: 'We craft the journey',
            bold: 'of your online presence'
        },
        'poster': {
            name: 'Poster',
            filter: '.poster',
            light: 'We highlight the impact',
            bold: 'of your visual'
        },
        'album-cover': {
            name: 'Album Cover',
            filter: '.album-cover',
            light: 'We visualize the sound',
            bold: 'of your music'
        },
        'brand-identity': {
            name: 'Brand Identity',
            filter: '.brand-identity',
            light: 'We define the essence',
            bold: 'of your business'
        },
        'projection-mapping': {
            name: 'Projection Mapping',
            filter: '.projection-mapping',
            light: 'We transform the space',
            bold: 'with your vision'
        },
        'products': {
            name: 'Products',
            filter: '.products',
            light: 'We enhance the appeal',
            bold: 'of your offerings'
        },
        'book': {
            name: 'Book',
            filter: '.book',
            light: 'We design the experience',
            bold: 'of your story'
        },
        'illustration': {
            name: 'Illustration',
            filter: '.illustration',
            light: 'We visualize the concept',
            bold: 'through your lines'
        }
    };

    // Private variables
    let filterBar, typeOfWorkBtn, plus, filterTrigger, heroText, heroLightText, heroBoldText, expandedMenu, heroSection;
    let isotopeManager, textAnimator; // Store references

    // Initialize module
    function init(isoManager, txtAnimator) {
        isotopeManager = isoManager; // Store reference
        textAnimator = txtAnimator; // Store reference

        // Select elements
        filterBar = document.querySelector('.filter-bar');
        typeOfWorkBtn = document.querySelector('.filter-dropdown .filter-btn');
        plus = typeOfWorkBtn ? typeOfWorkBtn.querySelector('.plus') : null;
        filterTrigger = document.querySelector('.filter-options > .filter-btn:not(.filter-dropdown .filter-btn)');
        heroText = document.querySelector('.hero-text');
        heroLightText = heroText ? heroText.querySelector('.light-text') : null;
        heroBoldText = heroText ? heroText.querySelector('.bold-text') : null;
        heroSection = document.querySelector('.hero');

        if (!filterBar) {
            console.error("Filter bar element not found.");
            return false;
        }

        createExpandedMenu();

        if (!expandedMenu) {
            console.error("Expanded menu could not be created.");
            return false;
        }

        attachTypeOfWorkButtonListeners();
        attachCategoryLinkListeners();

        return true;
    }

    // Create expanded menu with category links
    function createExpandedMenu() {
        if (expandedMenu) return;
        expandedMenu = document.querySelector('.expanded-menu');
        if (expandedMenu) return;

        if (filterBar) {
            expandedMenu = document.createElement('div');
            expandedMenu.className = 'expanded-menu';
            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'category-grid';

            // --- MODIFICATION: Build from the new categories object ---
            Object.entries(categories).forEach(([slug, data]) => {
                const categoryLink = document.createElement('a');
                categoryLink.href = `#/${slug}`; // Set the href to the hash URL
                categoryLink.textContent = data.name;
                categoryLink.className = 'category-link';
                categoryLink.dataset.slug = slug; // Store slug for easy access

                if (slug === 'everything') {
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
        }
    }

    // Attach listeners to category links
    function attachCategoryLinkListeners() {
        if (!expandedMenu) return;
        const categoryLinks = expandedMenu.querySelectorAll('.category-link');
        categoryLinks.forEach(link => {
            if (!link.hasAttribute('data-listener-attached')) {
                link.addEventListener('click', function(e) {
                    // The default behavior of an anchor tag with an href like "#/poster"
                    // is to change the hash, which is exactly what we want.
                    // The `hashchange` event listener in main.js will handle the rest.
                    // We just need to close the menu.
                    if (expandedMenu && expandedMenu.classList.contains('active')) {
                        expandedMenu.classList.remove('active');
                    }
                    if (typeOfWorkBtn && typeOfWorkBtn.classList.contains('active-state')) {
                        typeOfWorkBtn.classList.remove('active-state');
                    }
                    if (plus && plus.classList.contains('rotated') && !typeOfWorkBtn.matches(':hover')) {
                        plus.classList.remove('rotated');
                    }
                });
                link.setAttribute('data-listener-attached', 'true');
            }
        });
    }

    // --- NEW FUNCTION: The single source of truth for applying a filter ---
    // This is called from main.js whenever the URL hash changes.
    function applyFilterFromSlug(slug) {
        if (!isotopeManager || !isotopeManager.isInitialized()) {
            console.warn("Isotope not ready, filter application delayed.");
            // Optionally, you could queue this action. For now, we rely on main.js to call it at the right time.
            return;
        }

        const categoryData = categories[slug] || categories['everything']; // Fallback to 'everything'
        console.log(`Applying filter for slug: '${slug}'`);

        // Update active style on category links
        const categoryLinks = expandedMenu.querySelectorAll('.category-link');
        categoryLinks.forEach(l => {
            if (l.dataset.slug === slug) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        });

        // Update "Everything" button text
        if (filterTrigger) {
            filterTrigger.textContent = categoryData.name === 'Everything' ? 'EVERYTHING' : categoryData.name.toUpperCase();
            if (categoryData.name === 'Everything') {
                filterTrigger.classList.add('active');
            } else {
                filterTrigger.classList.remove('active');
            }
        }

        // Apply filter to isotope
        isotopeManager.applyFilter(categoryData.filter);

        // Conditional Scroll Logic (no changes needed here)
        performConditionalScroll();

        // Update hero text
        if (heroText && heroLightText && heroBoldText && textAnimator) {
            heroText.classList.add('animate-out');
            setTimeout(() => {
                heroLightText.textContent = categoryData.light;
                heroBoldText.textContent = categoryData.bold;
                textAnimator.splitText(heroLightText);
                textAnimator.splitText(heroBoldText);
                heroText.classList.remove('animate-out');
                heroText.classList.add('animate-in');
                setTimeout(() => heroText.classList.remove('animate-in'), 1500);
            }, 750);
        }
    }

    // (This function is unchanged, just extracted for clarity)
    function performConditionalScroll() {
        const portfolioSection = document.querySelector('.portfolio');
        const header = document.querySelector('.header');
        if (portfolioSection && filterBar && header && heroSection) {
            const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height-final')) || 60;
            const stickyThresholdY = (heroSection.offsetTop + heroSection.offsetHeight) - headerHeight;
            if (window.scrollY >= stickyThresholdY) {
                const filterBarHeight = filterBar.offsetHeight;
                const desiredViewportTop = headerHeight + filterBarHeight;
                const portfolioAbsoluteTop = portfolioSection.getBoundingClientRect().top + window.scrollY;
                const desiredScrollY = portfolioAbsoluteTop - desiredViewportTop;
                window.scrollTo({
                    top: Math.max(0, desiredScrollY),
                    behavior: 'smooth'
                });
            }
        }
    }

    // (This function is unchanged)
    function attachTypeOfWorkButtonListeners() {
        if (typeOfWorkBtn && expandedMenu && plus) {
            typeOfWorkBtn.addEventListener('click', function(e) {
                e.preventDefault();
                expandedMenu.classList.toggle('active');
                typeOfWorkBtn.classList.toggle('active-state');
                if (expandedMenu.classList.contains('active')) {
                    plus.classList.add('rotated');
                } else {
                    if (!typeOfWorkBtn.matches(':hover')) {
                        plus.classList.remove('rotated');
                    }
                }
            });
            typeOfWorkBtn.addEventListener('mouseenter', function() {
                if (!expandedMenu.classList.contains('active')) {
                    plus.classList.add('rotated');
                }
            });
            typeOfWorkBtn.addEventListener('mouseleave', function() {
                if (!expandedMenu.classList.contains('active')) {
                    plus.classList.remove('rotated');
                }
            });
        }
    }

    // Public API
    return {
        init: init,
        // --- MODIFICATION: Expose the new function and a way to get the current filter ---
        applyFilterFromSlug: applyFilterFromSlug,
        getActiveFilter: function() {
            if (!expandedMenu) return '*';
            const activeLink = expandedMenu.querySelector('.category-link.active');
            const slug = activeLink ? activeLink.dataset.slug : 'everything';
            return categories[slug] ? categories[slug].filter : '*';
        }
    };
})();

export default FilterMenu;