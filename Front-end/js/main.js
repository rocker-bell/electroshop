/**
 * Electro Shop - Main Storefront Interactions & Homepage Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Load Products through API layer (with offline seed fallback)
  const products = await ElectroAPI.getProducts();

  // Initialize Search & Autocomplete
  initLiveSearch(products);

  // Initialize Deals Countdown
  initDealsCountdown();

  // Initialize Homepage Category Tabs & Product Grids
  initHomepageGrids(products);

  // Initialize Newsletter Signup
  initNewsletter();
});

/* ==========================================================================
   LIVE SEARCH & AUTOCOMPLETE SYSTEM
   ========================================================================== */
function initLiveSearch(products) {
  const searchInput = document.getElementById('mainSearchInput');
  const categorySelect = document.getElementById('searchCategorySelect');
  const suggestionsBox = document.getElementById('searchSuggestions');
  const searchForm = document.getElementById('headerSearchForm');

  if (!searchInput || !suggestionsBox) return;

  // Search input typing handler with debounce
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim().toLowerCase();
    const selectedCategory = categorySelect ? categorySelect.value : 'all';

    if (query.length < 2) {
      suggestionsBox.classList.remove('show');
      return;
    }

    debounceTimer = setTimeout(() => {
      const matches = products.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesQuery = p.name.toLowerCase().includes(query) ||
                             p.category.toLowerCase().includes(query) ||
                             p.brand.toLowerCase().includes(query) ||
                             p.description.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
      }).slice(0, 5);

      renderSuggestions(matches, query, suggestionsBox);
    }, 200);
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.remove('show');
    }
  });

  // Submit search form -> navigate to search.html with parameters
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = encodeURIComponent(searchInput.value.trim());
      const cat = categorySelect ? encodeURIComponent(categorySelect.value) : 'all';
      window.location.href = `search.html?q=${q}&cat=${cat}`;
    });
  }
}

function renderSuggestions(matches, query, container) {
  if (matches.length === 0) {
    container.innerHTML = `
      <div class="suggestion-header">Suggestions for "${query}"</div>
      <div style="padding: 16px; text-align: center; color: var(--slate-400); font-size: 0.875rem;">
        No products found matching "${query}"
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="suggestion-header">Products (${matches.length})</div>
      ${matches.map(p => `
        <div class="suggestion-item" onclick="window.location.href='search.html?q=${encodeURIComponent(p.name)}'">
          <div class="suggestion-thumb">
            <img src="${p.image}" alt="${p.name}" />
          </div>
          <div class="suggestion-details">
            <div class="suggestion-title">${highlightMatch(p.name, query)}</div>
            <div class="suggestion-meta">
              <span class="suggestion-price">$${p.price.toFixed(2)}</span>
              <span>•</span>
              <span>${p.category}</span>
            </div>
          </div>
          <i class="fas fa-chevron-right" style="color: var(--slate-300); font-size: 0.75rem;"></i>
        </div>
      `).join('')}
      <div style="padding: 10px; text-align: center; background: var(--slate-50); border-top: 1px solid var(--slate-100);">
        <a href="search.html?q=${encodeURIComponent(query)}" style="font-size: 0.8125rem; font-weight: 700; color: var(--primary);">
          View all results <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    `;
  }
  container.classList.add('show');
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<strong style="color: var(--primary); font-weight: 700;">$1</strong>');
}

/* ==========================================================================
   FLASH DEALS COUNTDOWN TIMER
   ========================================================================== */
function initDealsCountdown() {
  const hoursEl = document.getElementById('dealHours');
  const minsEl = document.getElementById('dealMins');
  const secsEl = document.getElementById('dealSecs');

  if (!hoursEl || !minsEl || !secsEl) return;

  // Set 24 hour rolling flash deal timer
  let remainingSeconds = (18 * 3600) + (42 * 60) + 15;

  function updateTimer() {
    remainingSeconds--;
    if (remainingSeconds <= 0) remainingSeconds = 24 * 3600;

    const hours = Math.floor(remainingSeconds / 3600);
    const mins = Math.floor((remainingSeconds % 3600) / 60);
    const secs = remainingSeconds % 60;

    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   HOMEPAGE PRODUCT GRIDS & CATEGORY FILTER TABS
   ========================================================================== */
function initHomepageGrids(products) {
  renderDealsGrid(products.filter(p => p.deal || p.badge.includes('Sale')).slice(0, 4));
  renderFeaturedGrid(products, 'all');
  renderBestSellersGrid(products.slice(4, 8));

  // Category Selector Tabs
  const catButtons = document.querySelectorAll('.cat-filter-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      renderFeaturedGrid(products, cat);
    });
  });
}

function renderProductCard(p) {
  const isWish = Store.isInWishlist(p.id);
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-thumb-box">
        ${p.badge ? `<span class="product-badge ${p.badge.toLowerCase().includes('hot') ? 'badge-hot' : (p.badge.toLowerCase().includes('new') ? 'badge-new' : '')}">${p.badge}</span>` : ''}
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <div class="product-hover-actions">
          <button type="button" class="hover-action-btn ${isWish ? 'active-wish' : ''}" onclick="Store.toggleWishlist(${JSON.stringify(p).replace(/"/g, '&quot;')}); this.classList.toggle('active-wish');" title="Wishlist">
            <i class="far fa-heart"></i>
          </button>
          <button type="button" class="hover-action-btn" onclick="Store.openQuickView('${p.id}')" title="Quick View">
            <i class="far fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-content">
        <span class="product-category-label">${p.category}</span>
        <h3 class="product-name" title="${p.name}">
          <a href="search.html?q=${encodeURIComponent(p.name)}">${p.name}</a>
        </h3>
        <div class="product-rating-wrap">
          ${Store.renderStars(p.rating)}
          <span class="rating-count">(${p.reviewsCount})</span>
        </div>
        <div class="product-pricing-row">
          <span class="current-price">$${p.price.toFixed(2)}</span>
          ${p.oldPrice ? `<span class="old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}
        </div>
        <button type="button" class="add-cart-btn" onclick="Store.addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

function renderDealsGrid(deals) {
  const container = document.getElementById('flashDealsGrid');
  if (!container) return;
  container.innerHTML = deals.map(p => renderProductCard(p)).join('');
}

function renderFeaturedGrid(products, category = 'all') {
  const container = document.getElementById('featuredProductsGrid');
  if (!container) return;

  const filtered = category === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category.toLowerCase().includes(category.toLowerCase())).slice(0, 8);

  container.innerHTML = filtered.map(p => renderProductCard(p)).join('');
}

function renderBestSellersGrid(items) {
  const container = document.getElementById('bestSellersGrid');
  if (!container) return;
  container.innerHTML = items.map(p => renderProductCard(p)).join('');
}

/* ==========================================================================
   NEWSLETTER
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    if (email) {
      Store.showToast('Thank you for subscribing to Electro Shop VIP deals!', 'success');
      form.reset();
    }
  });
}
