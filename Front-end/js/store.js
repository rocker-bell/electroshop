/**
 * Electro Shop - Global State, Cart & UI Notification Store
 */

const Store = {
  cart: [],
  wishlist: [],
  FREE_SHIPPING_THRESHOLD: 150.00,

  init() {
    try {
      this.cart = JSON.parse(localStorage.getItem('electro_cart')) || [];
      this.wishlist = JSON.parse(localStorage.getItem('electro_wishlist')) || [];
    } catch (e) {
      this.cart = [];
      this.wishlist = [];
    }
    this.updateCartBadge();
    this.updateWishlistBadge();
    this.renderCartDrawer();
  },

  saveCart() {
    localStorage.setItem('electro_cart', JSON.stringify(this.cart));
    this.updateCartBadge();
    this.renderCartDrawer();
  },

  saveWishlist() {
    localStorage.setItem('electro_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistBadge();
  },

  // ===== CART ACTIONS =====
  addToCart(product, quantity = 1) {
    if (!product) return;
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: parseFloat(product.price),
        image: product.image,
        quantity: quantity
      });
    }
    this.saveCart();
    this.showToast(`Added <strong>${product.name}</strong> to your cart!`, 'success');
    this.openCartDrawer();
  },

  removeFromCart(productId) {
    const item = this.cart.find(i => i.id === productId);
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    if (item) {
      this.showToast(`Removed <strong>${item.name}</strong> from cart.`, 'info');
    }
  },

  updateQuantity(productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
      }
    }
  },

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  },

  getCartSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge-count');
    const count = this.getCartCount();
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },

  // ===== WISHLIST ACTIONS =====
  toggleWishlist(product) {
    const index = this.wishlist.findIndex(item => item.id === product.id);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.saveWishlist();
      this.showToast(`Removed <strong>${product.name}</strong> from wishlist.`, 'info');
      return false;
    } else {
      this.wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
      this.saveWishlist();
      this.showToast(`Added <strong>${product.name}</strong> to wishlist!`, 'success');
      return true;
    }
  },

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  },

  updateWishlistBadge() {
    const badges = document.querySelectorAll('.wishlist-badge-count');
    const count = this.wishlist.length;
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },

  // ===== CART DRAWER UI =====
  openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.classList.add('drawer-open');
    }
  },

  closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('drawer-open');
    }
  },

  renderCartDrawer() {
    const container = document.getElementById('cartDrawerItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingProgressEl = document.getElementById('shippingProgressBar');
    const shippingMsgEl = document.getElementById('shippingProgressMsg');
    if (!container) return;

    const subtotal = this.getCartSubtotal();
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Free shipping calculation
    if (shippingProgressEl && shippingMsgEl) {
      const remaining = Math.max(0, this.FREE_SHIPPING_THRESHOLD - subtotal);
      const percent = Math.min(100, (subtotal / this.FREE_SHIPPING_THRESHOLD) * 100);
      shippingProgressEl.style.width = `${percent}%`;
      if (remaining === 0) {
        shippingMsgEl.innerHTML = '<i class="fas fa-check-circle text-success"></i> You unlocked <strong>FREE Express Shipping</strong>!';
      } else {
        shippingMsgEl.innerHTML = `Add <strong>$${remaining.toFixed(2)}</strong> more for <strong>FREE Express Shipping</strong>`;
      }
    }

    if (this.cart.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-cart-icon"><i class="fas fa-shopping-bag"></i></div>
          <h4>Your cart is empty</h4>
          <p>Explore our electronics catalog and discover incredible tech deals!</p>
          <a href="search.html" class="btn btn-primary btn-sm mt-3" onclick="Store.closeCartDrawer()">Start Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = this.cart.map(item => `
      <div class="cart-drawer-item" data-id="${item.id}">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button type="button" class="qty-btn" onclick="Store.updateQuantity('${item.id}', -1)">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="qty-btn" onclick="Store.updateQuantity('${item.id}', 1)">+</button>
            </div>
            <button type="button" class="remove-item-btn" onclick="Store.removeFromCart('${item.id}')" title="Remove">
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  // ===== QUICK VIEW MODAL =====
  openQuickView(productId) {
    const product = SEED_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    document.getElementById('qvModalTitle').textContent = product.name;
    document.getElementById('qvModalCategory').textContent = product.category;
    document.getElementById('qvModalPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('qvModalOldPrice').textContent = product.oldPrice ? `$${product.oldPrice.toFixed(2)}` : '';
    document.getElementById('qvModalRating').innerHTML = this.renderStars(product.rating) + ` <span>(${product.reviewsCount} reviews)</span>`;
    document.getElementById('qvModalDesc').textContent = product.description;
    document.getElementById('qvModalImage').src = product.image;
    
    const specsEl = document.getElementById('qvModalSpecs');
    if (specsEl && product.specs) {
      specsEl.innerHTML = product.specs.map(spec => `<li><i class="fas fa-check-circle"></i> ${spec}</li>`).join('');
    }

    const addBtn = document.getElementById('qvModalAddCart');
    if (addBtn) {
      addBtn.onclick = () => {
        const qty = parseInt(document.getElementById('qvModalQty').value) || 1;
        this.addToCart(product, qty);
        $('#quickViewModal').modal('hide');
      };
    }

    $('#quickViewModal').modal('show');
  },

  renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '<span class="star-rating">' +
      '<i class="fas fa-star"></i>'.repeat(full) +
      (half ? '<i class="fas fa-star-half-alt"></i>' : '') +
      '<i class="far fa-star"></i>'.repeat(empty) +
      '</span>';
  },

  // ===== TOAST NOTIFICATIONS =====
  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-notification-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type} animate-slide-in`;
    
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
    toast.innerHTML = `
      <div class="toast-icon"><i class="fas ${icon}"></i></div>
      <div class="toast-content">${message}</div>
      <button type="button" class="toast-close">&times;</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('animate-fade-out');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }
};

window.Store = Store;
document.addEventListener('DOMContentLoaded', () => Store.init());
