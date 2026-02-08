import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserGroupIcon, CurrencyDollarIcon, ShoppingBagIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import ApiService from '../services/apiService';

function RestaurantDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weeklySales, setWeeklySales] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchWeeklySales();
    fetchCategories();
  }, []);

  const fetchWeeklySales = async () => {
    try {
      const data = await ApiService.getWeeklySales();
      setWeeklySales(data);
    } catch (error) {
      console.error('Error fetching weekly sales:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await ApiService.getPopularCategories();
      const colors = ['#0d6efd', '#198754', '#ffc107', '#fd7e14', '#dc3545'];
      const formatted = data.map((cat, index) => ({
        name: cat.category,
        value: cat.percentage,
        color: colors[index % colors.length]
      }));
      setCategoryData(formatted);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await ApiService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="p-4">Error loading dashboard data</div>;
  }

  const stats = [
    { title: 'Total Users', value: analytics.totalUsers, change: '+12%', icon: UserGroupIcon, color: 'primary' },
    { title: 'Revenue', value: `$${analytics.totalRevenue.toFixed(2)}`, change: '+8%', icon: CurrencyDollarIcon, color: 'success' },
    { title: 'Total Orders', value: analytics.totalOrders, change: '+15%', icon: ShoppingBagIcon, color: 'info' },
    { title: 'Reservations', value: analytics.totalReservations, change: '-3%', icon: ClockIcon, color: 'warning' },
  ];

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-primary mb-1">🍽️ Restaurant Dashboard</h1>
          <p className="text-muted mb-0">Manage your restaurant operations efficiently</p>
        </div>
       
      </div>

      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className={`card border-0 bg-${stat.color} text-white`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-white-50 mb-1">{stat.title}</h6>
                    <h3 className="fw-bold mb-1">{stat.value}</h3>
                    <small className="text-white-50">{stat.change} from yesterday</small>
                  </div>
                  <stat.icon style={{width: '40px', height: '40px', opacity: 0.7}} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="fw-semibold mb-1">📈 Weekly Sales Performance</h5>
              <p className="text-muted mb-0 small">Orders and revenue trends</p>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="orders" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="customers" fill="#198754" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="fw-semibold mb-1">🍕 Popular Categories</h5>
              <p className="text-muted mb-0 small">Orders by food category</p>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3">
                {categoryData.map((category, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-2" 
                        style={{width: '12px', height: '12px', backgroundColor: category.color}}
                      ></div>
                      <span className="small">{category.name}</span>
                    </div>
                    <span className="fw-semibold">{category.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="fw-semibold mb-1">🏆 Popular Dishes</h5>
              <p className="text-muted mb-0 small">Best selling menu items - Coming soon</p>
            </div>
            <div className="card-body text-center py-5">
              <p className="text-muted">Popular dishes data will be available soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;
