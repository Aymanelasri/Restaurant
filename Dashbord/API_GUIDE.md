# API Connection Guide - Dashboard ↔ gustobackend

## Configuration Files Created

### 1. `/src/config/api.js`
- Contains backend URL and headers configuration
- Change `BASE_URL` if backend runs on different port

### 2. `/src/services/apiService.js`
- Centralized API service with all HTTP methods
- Handles authentication tokens automatically
- Includes all gustobackend endpoints

### 3. `.env` file updated
- Added `REACT_APP_API_URL=http://localhost:8000/api`

## How to Use API Service

### Import the service:
```javascript
import apiService from '../services/apiService.js';
```

### Authentication:
```javascript
// Login (stores token automatically)
const response = await apiService.login({ email, password });

// Logout (removes token)
await apiService.logout();
```

### Orders:
```javascript
// Get all orders
const orders = await apiService.getOrders();

// Create new order
const newOrder = await apiService.createOrder({
  items: [...],
  customer_name: "John Doe",
  customer_phone: "123456789",
  delivery_address: "123 Street",
  city: "City",
  payment_method: "card", // or "cash"
  total_amount: 25.50
});

// Update order status
await apiService.updateOrder(orderId, { status: "delivered" });
```

### Reservations:
```javascript
// Get all reservations
const reservations = await apiService.getReservations();

// Create new reservation
const newReservation = await apiService.createReservation({
  name: "John Doe",
  phone: "123456789",
  date: "2024-01-15",
  time: "19:00",
  table_id: 1
});

// Get available tables
const tables = await apiService.getAvailableTables({
  date: "2024-01-15",
  time: "19:00",
  guests: 4
});
```

## Backend Requirements

Make sure gustobackend is running:
```bash
cd gustobackend
php artisan serve
```

The backend should be accessible at: `http://localhost:8000`

## API Endpoints Available

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation
- `GET /api/tables` - Get tables with availability
- `GET /api/available-tables` - Get available tables

## Error Handling

The API service automatically handles:
- Authentication headers
- JSON parsing
- Error responses
- Token storage

All methods return promises and can be used with async/await or .catch() for error handling.