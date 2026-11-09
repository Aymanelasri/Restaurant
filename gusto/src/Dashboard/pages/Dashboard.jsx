import React, { useState, useEffect, useMemo } from 'react';
import { UserGroupIcon, CurrencyDollarIcon, ShoppingBagIcon, ClockIcon, HomeIcon, ChartBarIcon, ChartPieIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ApiService from '../services/apiService';

const COLORS = [
  '#FF2D1A',
  '#F5B800',
  '#22C55E',
  '#3B82F6',
  '#FF7A1A',
  '#14B8A6',
  '#8A8A8A',
  '#A855F7',
];

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
      const formatted = data.map((cat, index) => ({
        name: cat.category,
        value: cat.percentage,
        color: COLORS[index % COLORS.length]
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

  const safeCategoryData = useMemo(() => categoryData.map(item => ({ ...item })), [categoryData]);

  const renderPieLabel = ({ cx, cy, midAngle, outerRadius, percent, name, value }) => {
    const radius = outerRadius + 28;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
    const xLine = cx + (outerRadius + 10) * Math.cos((-midAngle * Math.PI) / 180);
    const yLine = cy + (outerRadius + 10) * Math.sin((-midAngle * Math.PI) / 180);
    const textAnchor = x > cx ? 'start' : 'end';

    return (
      <g>
        <polyline
          points={`${xLine},${yLine} ${x},${y}`}
          fill="none"
          stroke="#d5d5d5"
          strokeWidth={1.2}
        />
        <text
          x={x}
          y={y}
          fill="#f5f5f5"
          fontSize={12}
          textAnchor={textAnchor}
          dominantBaseline="middle"
        >
          {`${name}`}
        </text>
        <text
          x={x}
          y={y + 14}
          fill="#f5f5f5"
          fontSize={11}
          opacity={0.85}
          textAnchor={textAnchor}
          dominantBaseline="middle"
        >
          {`${Math.round(percent * 100)}%`}
        </text>
      </g>
    );
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

  const maxSales = Math.max(...weeklySales.map(day => Math.max(day.orders || 0, day.customers || 0)), 1);

  return (
    <div className="p-0 p-md-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold text-primary mb-1 d-flex align-items-center">
            <span className="d-inline-flex align-items-center justify-content-center me-3" style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(255,42,26,.12)',border:'1px solid rgba(255,42,26,.35)',color:'#ff2a1a'}}>
              <HomeIcon style={{width:'22px',height:'22px'}} />
            </span>
            Restaurant Dashboard
          </h1>
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
              <h5 className="fw-semibold mb-1 d-flex align-items-center">
                <ChartBarIcon className="me-2" style={{width:'20px',height:'20px',color:'#ff2a1a'}} />
                Weekly Sales Performance
              </h5>
              <p className="text-muted mb-0 small">Orders and customer trends</p>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }} className="d-flex align-items-end gap-2 mt-3">
                {weeklySales.map((day) => (
                  <div key={day.day} className="flex-fill d-flex flex-column align-items-center justify-content-end gap-2" style={{ height: '100%' }}>
                    <div className="d-flex align-items-end justify-content-center gap-1" style={{ height: '220px', width: '100%' }}>
                      <div title={`${day.orders} orders`} style={{ width: '18%', height: `${Math.max(12, (day.orders / maxSales) * 100)}%`, background: COLORS[0], borderRadius: '8px 8px 0 0' }} />
                      <div title={`${day.customers} customers`} style={{ width: '18%', height: `${Math.max(12, (day.customers / maxSales) * 100)}%`, background: COLORS[1], borderRadius: '8px 8px 0 0' }} />
                    </div>
                    <span className="small text-muted">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="fw-semibold mb-1 d-flex align-items-center">
                <ChartPieIcon className="me-2" style={{width:'20px',height:'20px',color:'#ff2a1a'}} />
                Popular Categories
              </h5>
              <p className="text-muted mb-0 small">Orders by food category</p>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-center align-items-center my-2" style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={safeCategoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={26}
                      minAngle={15}
                      stroke="#141414"
                      strokeWidth={2}
                      label={renderPieLabel}
                      labelLine={false}
                    >
                      {safeCategoryData.map((category, index) => (
                        <Cell key={`${category.name}-${index}`} fill={category.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3">
                {safeCategoryData.map((category, index) => (
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
              <h5 className="fw-semibold mb-1 d-flex align-items-center">
                <TrophyIcon className="me-2" style={{width:'20px',height:'20px',color:'#ff2a1a'}} />
                Popular Dishes
              </h5>
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