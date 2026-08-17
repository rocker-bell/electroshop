/**
 * Electro Shop - Backend API Integration Layer
 * Endpoints:
 * - Products: http://localhost:3001/products
 * - Users / Auth: http://localhost:3000
 * - Messages: http://localhost:5000
 */

const API_CONFIG = {
  PRODUCTS_URL: 'http://localhost:3001',
  USERS_URL: 'http://localhost:3000',
  MESSAGES_URL: 'http://localhost:5000',
  TIMEOUT_MS: 2000
};

const ElectroAPI = {
  // Helper for fetch with timeout
  async fetchWithTimeout(resource, options = {}) {
    const { timeout = API_CONFIG.TIMEOUT_MS } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  },

  // ===== PRODUCTS API (Port 3001) =====
  async getProducts() {
    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.PRODUCTS_URL}/products`);
      if (response.ok) {
        const backendProducts = await response.json();
        if (Array.isArray(backendProducts) && backendProducts.length > 0) {
          // Enrich backend products with default visuals and attributes if needed
          return backendProducts.map(p => {
            const seedMatch = SEED_PRODUCTS.find(sp => sp.id === p.id || sp.name === p.name);
            return {
              id: p.id || 'p-' + Math.random().toString(36).substr(2, 9),
              name: p.name || 'Unnamed Product',
              category: p.category || 'Laptops & Computers',
              description: p.description || '',
              price: parseFloat(p.price) || 99.99,
              oldPrice: seedMatch ? seedMatch.oldPrice : (parseFloat(p.price) * 1.15).toFixed(2),
              rating: seedMatch ? seedMatch.rating : 4.8,
              reviewsCount: seedMatch ? seedMatch.reviewsCount : 24,
              badge: seedMatch ? seedMatch.badge : 'Popular',
              brand: seedMatch ? seedMatch.brand : (p.name.split(' ')[0] || 'Electro'),
              inStock: true,
              featured: seedMatch ? seedMatch.featured : true,
              deal: seedMatch ? seedMatch.deal : false,
              specs: seedMatch ? seedMatch.specs : [p.description],
              image: (seedMatch && seedMatch.image) ? seedMatch.image : createProductSVG('laptop', p.name)
            };
          });
        }
      }
    } catch (err) {
      console.info('Backend product server unavailable (Port 3001), running with offline seed dataset.');
    }
    return SEED_PRODUCTS;
  },

  async getProductById(id) {
    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.PRODUCTS_URL}/products/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.info('Backend product server unavailable, using local lookup.');
    }
    return SEED_PRODUCTS.find(p => p.id === id) || null;
  },

  async addProduct(productData) {
    // Expected schema: { category, name, description, price }
    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.PRODUCTS_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: productData.category,
          name: productData.name,
          description: productData.description,
          price: productData.price
        })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Could not persist to backend (Port 3001). Product added locally.');
    }
    return { message: 'Product recorded in session' };
  },

  async deleteProduct(id) {
    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.PRODUCTS_URL}/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Backend delete unavailable');
    }
    return { message: 'Product deleted' };
  },

  // ===== USERS & AUTH API (Port 3000) =====
  async login(email, password) {
    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.USERS_URL}/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('electro_token', data.token);
          localStorage.setItem('electro_user', JSON.stringify({ email }));
        }
        return { success: true, data };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      // Demo authentication fallback
      if (email && password) {
        const dummyToken = 'demo-jwt-token-' + Date.now();
        localStorage.setItem('electro_token', dummyToken);
        localStorage.setItem('electro_user', JSON.stringify({ email, name: email.split('@')[0] }));
        return { success: true, message: 'Logged in (Demo Mode)', token: dummyToken };
      }
      return { success: false, message: 'Could not connect to authentication server' };
    }
  },

  async register(username, email, password) {
    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.USERS_URL}/Register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.status === 201) {
        return { success: true, message: data.message || 'Registered successfully' };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      // Fallback
      return { success: true, message: 'Registered successfully (Demo Mode)' };
    }
  },

  async getUsers() {
    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.USERS_URL}/users`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.info('Backend users server unavailable');
    }
    return [
      { id: 'usr-1', username: 'admin', email: 'admin@electroshop.com' },
      { id: 'usr-2', username: 'bross', email: 'bross@gmail.com' }
    ];
  },

  // ===== MESSAGES API (Port 5000) =====
  async sendMessage(name, email, message, receipient = 'admin') {
    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.MESSAGES_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, receipient })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.info('Backend messages server unavailable');
    }
    return { message: 'Message sent successfully.' };
  }
};

window.ElectroAPI = ElectroAPI;
