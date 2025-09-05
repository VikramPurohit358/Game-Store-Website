document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    addSmoothScrolling();
    
    initSearch();
    
    addGameCardInteractions();
    
    addHeaderScrollEffects();
    
    initLazyLoading();
    
    addKeyboardNavigation();
}
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
function initSearch() {
    const searchBar = document.getElementById('searchbar');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchBar) return;
    
    searchBar.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (query.length > 0) {
            performSearch(query);
        } else {
            showAllGames();
        }
    });

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchBar.value.toLowerCase().trim();
            if (query.length > 0) {
                performSearch(query);
            }
        });
    }

    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.toLowerCase().trim();
            if (query.length > 0) {
                performSearch(query);
            }
        }
    });
}

function performSearch(query) {
    const gameCards = document.querySelectorAll('.game-card');
    let resultsFound = 0;
    
    gameCards.forEach(card => {
        const title = card.querySelector('.game-title')?.textContent.toLowerCase() || '';
        const category = card.querySelector('.game-category')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || category.includes(query)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.3s ease forwards';
            resultsFound++;
        } else {
            card.style.display = 'none';
        }
    });
    
    showSearchResults(query, resultsFound);
}

function showAllGames() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp 0.3s ease forwards';
    });
    
    hideSearchResults();
}

function showSearchResults(query, count) {
    let resultsDiv = document.getElementById('search-results');
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'search-results';
        resultsDiv.className = 'search-results';
        document.querySelector('.main-content').insertBefore(resultsDiv, document.querySelector('.games-section'));
    }
    
    resultsDiv.innerHTML = `
        <div class="search-results-content">
            <h3>Search Results for "${query}"</h3>
            <p>${count} game${count !== 1 ? 's' : ''} found</p>
            <button class="clear-search-btn" onclick="clearSearch()">Clear Search</button>
        </div>
    `;
    resultsDiv.style.display = 'block';
}

function hideSearchResults() {
    const resultsDiv = document.getElementById('search-results');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

function clearSearch() {
    const searchBar = document.getElementById('searchbar');
    if (searchBar) {
        searchBar.value = '';
    }
    showAllGames();
}

function addGameCardInteractions() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameTitle = this.querySelector('.game-title')?.textContent || 'Game';
            showGameDetails(gameTitle);
        });
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid #056559';
            this.style.outlineOffset = '2px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

function showGameDetails(gameTitle) {
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${gameTitle}</h2>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <p>Game details for ${gameTitle} would go here.</p>
                <p>This could include screenshots, description, ratings, and download button.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .game-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                background: #1a1f2e;
                border-radius: 16px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: slideUp 0.3s ease;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .close-btn {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            .close-btn:hover {
                color: #056559;
                background: rgba(5, 101, 89, 0.1);
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `;
        document.head.appendChild(style);
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(this);
        }
    });
}

function closeModal(button) {
    const modal = button.closest('.game-modal');
    if (modal) {
        modal.remove();
    }
}

function addHeaderScrollEffects() {
    const header = document.querySelector('.main-header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function addKeyboardNavigation() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.setAttribute('tabindex', '0');
    });
    
    document.addEventListener('keydown', function(e) {
        const focusedElement = document.activeElement;
        
        if (focusedElement.classList.contains('game-card')) {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    focusedElement.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    navigateToNextCard(focusedElement, 1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    navigateToNextCard(focusedElement, -1);
                    break;
            }
        }
    });
}

function navigateToNextCard(currentCard, direction) {
    const gameCards = Array.from(document.querySelectorAll('.game-card'));
    const currentIndex = gameCards.indexOf(currentCard);
    const nextIndex = (currentIndex + direction + gameCards.length) % gameCards.length;
    
    gameCards[nextIndex].focus();
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = '<div class="spinner"></div><p>Loading...</p>';
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.querySelector('.loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedSearch = debounce(function(query) {
    performSearch(query);
}, 300);

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('searchbar');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            if (query.length > 0) {
                debouncedSearch(query);
            } else {
                showAllGames();
            }
        });
    }
});

const searchResultsStyles = `
    .search-results {
        background: rgba(5, 101, 89, 0.1);
        border: 1px solid rgba(5, 101, 89, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 2rem;
        animation: fadeInUp 0.3s ease;
    }
    .search-results-content h3 {
        color: #056559;
        margin-bottom: 0.5rem;
    }
    .search-results-content p {
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 1rem;
    }
    .clear-search-btn {
        background: #056559;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .clear-search-btn:hover {
        background: #0a8a7a;
        transform: translateY(-2px);
    }
    .scrolled {
        background: rgba(14, 19, 31, 0.98) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
    }
`;

if (!document.getElementById('search-results-styles')) {
    const style = document.createElement('style');
    style.id = 'search-results-styles';
    style.textContent = searchResultsStyles;
    document.head.appendChild(style);
}
