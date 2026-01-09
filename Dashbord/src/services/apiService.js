import API_CONFIG from '../config/api.js';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  getAuthHeaders() {
    return {
      ...API_CONFIG.HEADERS
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
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

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth methods
  async login(credentials) {
    const response = await this.post('/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  }

  async register(userData) {
    return this.post('/register', userData);
  }

  logout() {
    localStorage.removeItem('token');
    return this.post('/logout');
  }

  // Orders
  async getOrders() {
    return this.get('/orders');
  }

  async createOrder(orderData) {
    return this.post('/orders', {
      items: orderData.items,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      delivery_address: orderData.delivery_address,
      city: orderData.city,
      payment_method: orderData.payment_method,
      total_amount: orderData.total_amount
    });
  }

  async updateOrder(id, orderData) {
    return this.put(`/orders/${id}`, orderData);
  }

  // Reservations
  async getReservations() {
    return this.get('/reservations');
  }

  async createReservation(reservationData) {
    return this.post('/reservations', {
      name: reservationData.name,
      phone: reservationData.phone,
      date: reservationData.date,
      time: reservationData.time,
      table_id: reservationData.table_id,
     
    });
  }

  async getTables(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/tables${query ? '?' + query : ''}`);
  }

  async getAvailableTables(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/available-tables${query ? '?' + query : ''}`);
  }

  // User
  async getUser() {
    return this.get('/user');
  }
}

export default new ApiService();