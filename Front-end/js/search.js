/**
 * Electro Shop - Search & Multi-Faceted Product Filter Engine
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch products from API layer (with fallback)
  const allProducts = await ElectroAPI.getProducts();

  // Search Engine State
  const state = {
    allProducts: allProducts,
    filteredProducts: [...allProducts],
    query: '',
    selectedCategory: 'all',
    selectedBrands: [],
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'featured',
    viewMode: 'grid' // 'grid' or 'list'
  };

  // Parse Initial URL Query Parameters
  parseUrlParams(state);

  // Initialize UI components & sidebar filters
  initFilterSidebar(state);
  initSortingAndViews(state);
  initActiveFilterChips(state);

  // Initial Filter & Render Pass
  applyFiltersAndRender(state);

  // Synchronize Header Live Search if present
  initLiveSearch(allProducts);
});

/* ==========================================================================
   URL PARAMETER PARSING
   ========================================================================== */
function parseUrlParams(state) {
  const params = new URLSearchParams(window.location.search);
  if (params.has('q')) state.query = params.get('q').trim();
  if (params.has('cat')) state.selectedCategory = params.get('cat');
  if (params.has('brand')) state.selectedBrands = params.get('brand').split(',');
  if (params.has('minPrice')) state.minPrice = parseFloat(params.get('minPrice')) || 0;
  if (params.has('maxPrice')) state.maxPrice = parseFloat(params.get('maxPrice')) || 5000;
  if (params.has('sort')) state.sortBy = params.get('sort');

  // Update header search input value if query exists
  const searchInput = document.getElementById('mainSearchInput');
  if (searchInput && state.query) {
    searchInput.value = state.query;
  }
}

/* ==========================================================================
   FILTER SIDEBAR INITIALIZATION
   ========================================================================== */
function initFilterSidebar(state) {
  // Category Radio / Checkbox List
  const categoryListContainer = document.getElementById('filterCategoriesList');
  if (categoryListContainer) {
    categoryListContainer.innerHTML = CATEGORIES.map(cat => {
      const count = cat.id === 'all'
        ? state.allProducts.length
        : state.allProducts.filter(p => p.category.toLowerCase().includes(cat.name.toLowerCase()) || cat.name.toLowerCase().includes(p.category.toLowerCase())).length;

      const isChecked = state.selectedCategory === cat.id || state.selectedCategory.toLowerCase() === cat.name.toLowerCase();

      return `
        <label class="filter-item">
          <span class="filter-checkbox-label">
            <input type="radio" name="filterCategory" class="custom-checkbox" value="${cat.id}" ${isChecked ? 'checked' : ''} />
            <span>${cat.name}</span>
          </span>
          <span class="filter-count">${count}</span>
        </label>
      `;
    }).join('');

    categoryListContainer.addEventListener('change', (e) => {
      if (e.target.name === 'filterCategory') {
        state.selectedCategory = e.target.value;
        applyFiltersAndRender(state);
      }
    });
  }

  // Brand Checkboxes List
  const brandListContainer = document.getElementById('filterBrandsList');
  if (brandListContainer) {
    brandListContainer.innerHTML = BRANDS.map(brand => {
      const count = state.allProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase()).length;
      const isChecked = state.selectedBrands.includes(brand);
      return `
        <label class="filter-item">
          <span class="filter-checkbox-label">
            <input type="checkbox" class="custom-checkbox brand-filter-cb" value="${brand}" ${isChecked ? 'checked' : ''} />
            <span>${brand}</span>
          </span>
          <span class="filter-count">${count}</span>
        </label>
      `;
    }).join('');

    brandListContainer.addEventListener('change', () => {
      const checkedBoxes = brandListContainer.querySelectorAll('.brand-filter-cb:checked');
      state.selectedBrands = Array.from(checkedBoxes).map(cb => cb.value);
      applyFiltersAndRender(state);
    });
  }

  // Price Slider & Numeric Inputs
  const minPriceInput = document.getElementById('minPriceInput');
  const maxPriceInput = document.getElementById('maxPriceInput');
  const priceSlider = document.getElementById('priceSlider');

  if (minPriceInput && maxPriceInput && priceSlider) {
    minPriceInput.value = state.minPrice;
    maxPriceInput.value = state.maxPrice;
    priceSlider.value = state.maxPrice;

    priceSlider.addEventListener('input', (e) => {
      state.maxPrice = parseFloat(e.target.value);
      maxPriceInput.value = state.maxPrice;
      applyFiltersAndRender(state);
    });

    minPriceInput.addEventListener('change', (e) => {
      state.minPrice = Math.max(0, parseFloat(e.target.value) || 0);
      applyFiltersAndRender(state);
    });

    maxPriceInput.addEventListener('change', (e) => {
      state.maxPrice = Math.max(state.minPrice, parseFloat(e.target.value) || 5000);
      priceSlider.value = state.maxPrice;
      applyFiltersAndRender(state);
    });
  }

  // Rating Filter
  const ratingFilterContainer = document.getElementById('filterRatingList');
  if (ratingFilterContainer) {
    ratingFilterContainer.addEventListener('change', (e) => {
      if (e.target.name === 'filterRating') {
        state.minRating = parseFloat(e.target.value) || 0;
        applyFiltersAndRender(state);
      }
    });
  }

  // Reset Filters Button
  const resetBtn = document.getElementById('resetAllFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetFilters(state);
    });
  }

  // Mobile Filter Drawer Toggle
  const mobileFilterBtn = document.getElementById('mobileFilterToggleBtn');
  const sidebarEl = document.querySelector('.filter-sidebar');
  if (mobileFilterBtn && sidebarEl) {
    mobileFilterBtn.addEventListener('click', () => {
      sidebarEl.classList.toggle('mobile-open');
    });
  }
}

function resetFilters(state) {
  state.query = '';
  state.selectedCategory = 'all';
  state.selectedBrands = [];
  state.minPrice = 0;
  state.maxPrice = 5000;
  state.minRating = 0;
  state.sortBy = 'featured';

  // Reset UI inputs
  const catAllRadio = document.querySelector('input[name="filterCategory"][value="all"]');
  if (catAllRadio) catAllRadio.checked = true;

  document.querySelectorAll('.brand-filter-cb').forEach(cb => cb.checked = false);

  const minPriceInput = document.getElementById('minPriceInput');
  const maxPriceInput = document.getElementById('maxPriceInput');
  const priceSlider = document.getElementById('priceSlider');
  if (minPriceInput) minPriceInput.value = 0;
  if (maxPriceInput) maxPriceInput.value = 5000;
  if (priceSlider) priceSlider.value = 5000;

  const ratingAny = document.querySelector('input[name="filterRating"][value="0"]');
  if (ratingAny) ratingAny.checked = true;

  const sortSelect = document.getElementById('catalogSortSelect');
  if (sortSelect) sortSelect.value = 'featured';

  const searchInput = document.getElementById('mainSearchInput');
  if (searchInput) searchInput.value = '';

  applyFiltersAndRender(state);
}

/* ==========================================================================
   SORTING & VIEW MODE TOGGLE
   ========================================================================== */
function initSortingAndViews(state) {
  const sortSelect = document.getElementById('catalogSortSelect');
  if (sortSelect) {
    sortSelect.value = state.sortBy;
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFiltersAndRender(state);
    });
  }

  const gridViewBtn = document.getElementById('gridViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const catalogGrid = document.getElementById('catalogProductsGrid');

  if (gridViewBtn && listViewBtn && catalogGrid) {
    gridViewBtn.addEventListener('click', () => {
      state.viewMode = 'grid';
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      catalogGrid.classList.remove('list-view');
    });

    listViewBtn.addEventListener('click', () => {
      state.viewMode = 'list';
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      catalogGrid.classList.add('list-view');
    });
  }
}

/* ==========================================================================
   FILTERING LOGIC & RENDERING
   ========================================================================== */
function applyFiltersAndRender(state) {
  let list = [...state.allProducts];

  // 1. Search Query Filter
  if (state.query) {
    const q = state.query.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // 2. Category Filter
  if (state.selectedCategory && state.selectedCategory !== 'all') {
    const targetCat = CATEGORIES.find(c => c.id === state.selectedCategory);
    const catName = targetCat ? targetCat.name.toLowerCase() : state.selectedCategory.toLowerCase();
    list = list.filter(p => p.category.toLowerCase().includes(catName) || catName.includes(p.category.toLowerCase()));
  }

  // 3. Brand Filter
  if (state.selectedBrands.length > 0) {
    list = list.filter(p => state.selectedBrands.some(b => b.toLowerCase() === p.brand.toLowerCase()));
  }

  // 4. Price Filter
  list = list.filter(p => p.price >= state.minPrice && p.price <= state.maxPrice);

  // 5. Rating Filter
  if (state.minRating > 0) {
    list = list.filter(p => p.rating >= state.minRating);
  }

  // 6. Sorting
  switch (state.sortBy) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      list.sort((a, b) => (b.badge.includes('New') ? 1 : 0) - (a.badge.includes('New') ? 1 : 0));
      break;
    default: // 'featured'
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  state.filteredProducts = list;

  // Render updates
  renderResultsSummary(state);
  renderActiveFilterChips(state);
  renderCatalogProducts(state);
}

function renderResultsSummary(state) {
  const countEl = document.getElementById('resultsCountVal');
  const queryEl = document.getElementById('resultsQueryDisplay');

  if (countEl) countEl.textContent = state.filteredProducts.length;
  if (queryEl) {
    if (state.query) {
      queryEl.innerHTML = `for "<span class="results-query-highlight">${state.query}</span>"`;
    } else if (state.selectedCategory !== 'all') {
      const catObj = CATEGORIES.find(c => c.id === state.selectedCategory);
      queryEl.innerHTML = `in <strong>${catObj ? catObj.name : state.selectedCategory}</strong>`;
    } else {
      queryEl.textContent = '';
    }
  }
}

function initActiveFilterChips(state) {
  // Handler attached via render
}

function renderActiveFilterChips(state) {
  const container = document.getElementById('activeFiltersBar');
  if (!container) return;

  const chips = [];

  if (state.query) {
    chips.push({ label: `Search: "${state.query}"`, onRemove: () => { state.query = ''; applyFiltersAndRender(state); } });
  }

  if (state.selectedCategory !== 'all') {
    const catObj = CATEGORIES.find(c => c.id === state.selectedCategory);
    chips.push({
      label: `Category: ${catObj ? catObj.name : state.selectedCategory}`,
      onRemove: () => {
        state.selectedCategory = 'all';
        const radio = document.querySelector('input[name="filterCategory"][value="all"]');
        if (radio) radio.checked = true;
        applyFiltersAndRender(state);
      }
    });
  }

  state.selectedBrands.forEach(brand => {
    chips.push({
      label: `Brand: ${brand}`,
      onRemove: () => {
        state.selectedBrands = state.selectedBrands.filter(b => b !== brand);
        const cb = document.querySelector(`.brand-filter-cb[value="${brand}"]`);
        if (cb) cb.checked = false;
        applyFiltersAndRender(state);
      }
    });
  });

  if (state.minPrice > 0 || state.maxPrice < 5000) {
    chips.push({
      label: `Price: $${state.minPrice} - $${state.maxPrice}`,
      onRemove: () => {
        state.minPrice = 0;
        state.maxPrice = 5000;
        document.getElementById('minPriceInput').value = 0;
        document.getElementById('maxPriceInput').value = 5000;
        document.getElementById('priceSlider').value = 5000;
        applyFiltersAndRender(state);
      }
    });
  }

  if (state.minRating > 0) {
    chips.push({
      label: `Rating: ${state.minRating}★+`,
      onRemove: () => {
        state.minRating = 0;
        const r0 = document.querySelector('input[name="filterRating"][value="0"]');
        if (r0) r0.checked = true;
        applyFiltersAndRender(state);
      }
    });
  }

  if (chips.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = `
    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--slate-500); margin-right: 4px;">Active Filters:</span>
    ${chips.map((c, idx) => `
      <span class="filter-chip" data-chip-idx="${idx}">
        ${c.label}
        <i class="fas fa-times chip-remove"></i>
      </span>
    `).join('')}
    <button type="button" class="reset-filters-btn" id="clearAllChipsBtn" style="margin-left: 8px;">Clear All</button>
  `;

  // Attach chip remove listeners
  container.querySelectorAll('.filter-chip').forEach((el, idx) => {
    el.querySelector('.chip-remove').addEventListener('click', () => {
      chips[idx].onRemove();
    });
  });

  const clearAllBtn = document.getElementById('clearAllChipsBtn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => resetFilters(state));
  }
}

function renderCatalogProducts(state) {
  const container = document.getElementById('catalogProductsGrid');
  if (!container) return;

  if (state.filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="empty-results-box" style="grid-column: 1 / -1;">
        <div class="empty-results-icon"><i class="fas fa-search"></i></div>
        <h3>No matching electronics found</h3>
        <p>Try adjusting your category selection, price range, or search keywords.</p>
        <button type="button" class="btn btn-primary" onclick="window.resetCatalogFilters()">
          Reset All Filters
        </button>
      </div>
    `;
    window.resetCatalogFilters = () => resetFilters(state);
    return;
  }

  container.innerHTML = state.filteredProducts.map(p => {
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
            <a href="javascript:void(0)" onclick="Store.openQuickView('${p.id}')">${p.name}</a>
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
  }).join('');
}
