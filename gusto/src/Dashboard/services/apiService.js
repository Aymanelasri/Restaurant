const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth
  async login(email, password) {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Handle both verification and direct login
    if (response.requires_verification) {
      throw new Error('Verification required');
    }
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  }

  async logout() {
    await this.request('/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Reservations
  async getReservations() {
    return this.request('/reservations');
  }

  async updateReservation(id, reservationData) {
    return this.request(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservationData),
    });
  }

  async getTables() {
    return this.request('/tables');
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async updateOrder(id, orderData) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  // Reviews
  async getReviews() {
    return this.request('/reviews');
  }

  // Products
  async getProducts() {
    return this.request('/products');
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Chefs
  async getChefs() {
    return this.request('/chefs');
  }

  async createChef(chefData) {
    return this.request('/chefs', {
      method: 'POST',
      body: JSON.stringify(chefData),
    });
  }

  async updateChef(id, chefData) {
    return this.request(`/chefs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chefData),
    });
  }

  async deleteChef(id) {
    return this.request(`/chefs/${id}`, {
      method: 'DELETE',
    });
  }

  // Users/Admins
  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Analytics
  async getAnalytics() {
    const [users, orders, reservations, reviews] = await Promise.all([
      this.getUsers(),
      this.getOrders(),
      this.getReservations(),
      this.getReviews()
    ]);

    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalReservations: reservations.length,
      totalReviews: reviews.length,
      totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      confirmedReservations: reservations.filter(r => r.status === 'confirmed').length,
      users,
      orders,
      reservations,
      reviews
    };
  }

  // Dashboard Analytics
  async getWeeklySales() {
    return this.request('/dashboard/weekly-sales');
  }

  async getPopularCategories() {
    return this.request('/dashboard/popular-categories');
  }

  async getPopularDishes() {
    return this.request('/dashboard/popular-dishes');
  }

  async getChefsStatus() {
    return this.request('/dashboard/chefs-status');
  }
}

const apiService = new ApiService();
export default apiService;