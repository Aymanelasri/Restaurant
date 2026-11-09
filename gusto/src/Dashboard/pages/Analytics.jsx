import React, { useState, useEffect } from 'react';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, CalculatorIcon, ClipboardDocumentListIcon, BanknotesIcon, ChartBarIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import ApiService from '../services/apiService';

function FinancialAnalytics() {
  const [activeTab, setActiveTab] = useState('area');
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
      const colors = ['#FF2D1A', '#F5B800', '#22C55E', '#3B82F6', '#FF7A1A', '#14B8A6', '#8A8A8A', '#A855F7'];
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
    return <div className="p-4">Error loading analytics data</div>;
  }

  const totalRevenue = analytics.totalRevenue || 0;
  const totalOrders = analytics.totalOrders || 0;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  const kpiMetrics = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: CurrencyDollarIcon, trend: '+0%', color: 'success' },
    { label: 'Total Orders', value: totalOrders, icon: CalculatorIcon, trend: '+0%', color: 'warning' },
    { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, icon: ClipboardDocumentListIcon, trend: '+0%', color: 'info' },
    { label: 'Total Users', value: analytics.totalUsers, icon: BanknotesIcon, trend: '+0%', color: 'primary' },
  ];

  const chartMax = Math.max(...weeklySales.map(day => Math.max(day.revenue || 0, day.orders || 0, day.customers || 0)), 1);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="h2 fw-bold text-primary mb-1 d-flex align-items-center">
          <span className="d-inline-flex align-items-center justify-content-center me-3" style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(255,42,26,.12)',border:'1px solid rgba(255,42,26,.35)',color:'#ff2a1a'}}>
            <ChartBarIcon style={{width:'22px',height:'22px'}} />
          </span>
          Financial Analytics
        </h1>
        <p className="text-muted mb-0">Business intelligence and financial insights</p>
      </div>

      <div className="row g-3 mb-4">
        {kpiMetrics.map((metric, index) => (
          <div key={index} className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <metric.icon className={`text-${metric.color} me-2`} style={{width: '18px', height: '18px'}} />
                      <h6 className="mb-0 text-muted small">{metric.label}</h6>
                    </div>
                    <h3 className="fw-bold mb-1">{metric.value}</h3>
                    <div className="d-flex align-items-center">
                      <ArrowTrendingUpIcon className="text-success me-1" style={{width: '12px', height: '12px'}} />
                      <small className="text-success">{metric.trend}</small>
                    </div>
                  </div>
                  <div className={`bg-${metric.color} bg-opacity-10 rounded-circle p-2`}>
                    <metric.icon className={`text-${metric.color}`} style={{width: '20px', height: '20px'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-transparent border-0">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'area' ? 'active' : ''}`}
                onClick={() => setActiveTab('area')}
              >
                <ChartBarIcon style={{width:'18px', height:'18px'}} />
                Revenue Growth
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'donut' ? 'active' : ''}`}
                onClick={() => setActiveTab('donut')}
              >
                <ChartPieIcon style={{width:'18px', height:'18px'}} />
                Category Analysis
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'line' ? 'active' : ''}`}
                onClick={() => setActiveTab('line')}
              >
                <ArrowTrendingUpIcon style={{width:'18px', height:'18px'}} />
                Performance Trends
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'area' && (
            <div className="row g-4">
              <div className="col-12">
                <h5 className="fw-semibold mb-3">Weekly Revenue & Orders Growth</h5>
                <div className="d-flex align-items-end gap-3" style={{ height: '260px' }}>
                  {weeklySales.map((day) => (
                    <div key={day.day} className="flex-fill d-flex flex-column align-items-center justify-content-end gap-2" style={{ height: '100%' }}>
                      <div className="d-flex align-items-end justify-content-center gap-1" style={{ height: '200px', width: '100%' }}>
                        <div style={{ width: '18%', height: `${Math.max(12, (day.revenue / chartMax) * 100)}%`, background: '#f5b800', borderRadius: '10px 10px 0 0' }} />
                        <div style={{ width: '18%', height: `${Math.max(12, (day.orders / chartMax) * 100)}%`, background: '#ff2a1a', borderRadius: '10px 10px 0 0' }} />
                      </div>
                      <span className="small text-muted">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'donut' && (
            <div className="row g-4">
              <div className="col-12 col-lg-6 mx-auto">
                <h5 className="fw-semibold mb-3 text-center">Product Category Distribution</h5>
                <div className="d-flex justify-content-center">
                  <div style={{ width: '190px', height: '190px', borderRadius: '50%', background: categoryData.length ? `conic-gradient(${categoryData.map((item, index) => {
                    const start = categoryData.slice(0, index).reduce((sum, current) => sum + Number(current.value || 0), 0);
                    const end = start + Number(item.value || 0);
                    return `${item.color} ${start}% ${end}%`;
                  }).join(', ')})` : '#e9ecef' }} />
                </div>
                <div className="mt-4">
                  <div className="row g-3">
                    {categoryData.map((cat, index) => (
                      <div key={index} className="col-6">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body p-3">
                            <div className="d-flex align-items-center mb-2">
                              <div 
                                style={{
                                  width: '16px', 
                                  height: '16px', 
                                  backgroundColor: cat.color, 
                                  borderRadius: '50%', 
                                  marginRight: '10px'
                                }}
                              ></div>
                              <span className="fw-semibold">{cat.name}</span>
                            </div>
                            <h4 className="mb-0" style={{ color: cat.color }}>{cat.value}%</h4>
                            <small className="text-muted">{cat.orders || 0} items</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'line' && (
            <div className="row g-4">
              <div className="col-12">
                <h5 className="fw-semibold mb-3">Revenue & Orders Performance Trends</h5>
                <div className="d-flex align-items-end gap-3" style={{ height: '260px' }}>
                  {weeklySales.map((day) => (
                    <div key={day.day} className="flex-fill d-flex flex-column align-items-center justify-content-end gap-2" style={{ height: '100%' }}>
                      <div className="d-flex align-items-end justify-content-center gap-1" style={{ height: '200px', width: '100%' }}>
                        <div style={{ width: '18%', height: `${Math.max(12, (day.revenue / chartMax) * 100)}%`, background: '#f5b800', borderRadius: '10px 10px 0 0' }} />
                        <div style={{ width: '18%', height: `${Math.max(12, (day.orders / chartMax) * 100)}%`, background: '#ff2a1a', borderRadius: '10px 10px 0 0' }} />
                        <div style={{ width: '18%', height: `${Math.max(12, (day.customers / chartMax) * 100)}%`, background: '#b3150a', borderRadius: '10px 10px 0 0' }} />
                      </div>
                      <span className="small text-muted">{day.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #f5b800' }}>
                        <div className="card-body">
                          <small className="text-muted d-block mb-1">Total Revenue</small>
                          <h3 className="mb-0 fw-bold text-success">
                            ${weeklySales.reduce((sum, day) => sum + (day.revenue || 0), 0)}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #ff2a1a' }}>
                        <div className="card-body">
                          <small className="text-muted d-block mb-1">Total Orders</small>
                          <h3 className="mb-0 fw-bold text-primary">
                            {weeklySales.reduce((sum, day) => sum + (day.orders || 0), 0)}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #b3150a' }}>
                        <div className="card-body">
                          <small className="text-muted d-block mb-1">Total Customers</small>
                          <h3 className="mb-0 fw-bold text-danger">
                            {weeklySales.reduce((sum, day) => sum + (day.customers || 0), 0)}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancialAnalytics;