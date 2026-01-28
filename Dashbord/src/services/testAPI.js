// Simple API service for testing
const API_BASE = 'http://localhost:8000/api';

export const testAPI = {
  async getOrders() {
    try {
      const response = await fetch(`${API_BASE}/orders`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Orders API error:', error);
      return [];
    }
  },

  async getReservations() {
    try {
      const response = await fetch(`${API_BASE}/reservations`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Reservations API error:', error);
      return [];
    }
  },

  async getTables() {
    try {
      const response = await fetch(`${API_BASE}/tables`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Tables API error:', error);
      return [];
    }
  }
};