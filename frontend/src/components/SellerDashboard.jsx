import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './SellerDashboard.css';

const SellerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const email = useSelector((state) => state.user.email);
    const role = useSelector((state) => state.user.role);
    const token = useSelector((state) => state.user.token); // assuming token exists? Wait, the frontend might just use axios defaults or need manual token
    const navigate = useNavigate();

    useEffect(() => {
        if (!email || (role !== 'seller' && role !== 'admin')) {
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            try {
                // Ensure auth header is set if needed by looking at how other components do it.
                // Looking at standard redux and axios config, token might be in state or local storage.
                // If it's in localStorage, get it.
                const storedToken = localStorage.getItem('token') || '';

                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/seller-stats`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching seller stats:", err);
                setError('Failed to load dashboard statistics.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [email, role, navigate]);

    if (isLoading) {
        return (
            <div className="page-container seller-dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <div className="empty-state-icon">⚠️</div>
                    <h3 className="empty-state-title">Error</h3>
                    <p className="empty-state-text">{error}</p>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    // Find max count for the bar chart
    const maxSalesCount = stats.topProducts.length > 0
        ? Math.max(...stats.topProducts.map(p => p.count))
        : 1;

    return (
        <div className="page-container seller-dashboard">
            <h1 className="page-title">Seller Dashboard</h1>
            <p className="page-subtitle">Overview of your store's performance</p>

            {/* Metric Cards */}
            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <div className="card-title">Total Revenue</div>
                    <div className="card-value text-accent">${stats.totalRevenue.toFixed(2)}</div>
                </div>
                <div className="dashboard-card">
                    <div className="card-title">Total Orders</div>
                    <div className="card-value">{stats.totalOrders}</div>
                </div>
                <div className="dashboard-card">
                    <div className="card-title">Active Products</div>
                    <div className="card-value">{stats.totalProducts}</div>
                </div>
                <div className="dashboard-card">
                    <div className="card-title">Average Rating</div>
                    <div className="card-value ">{stats.averageRating} ⭐</div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* CSS Bar Chart for Top Products */}
                <div className="dashboard-section chart-section">
                    <h2 className="section-title">Sales by Top Products</h2>
                    {stats.topProducts.length > 0 ? (
                        <div className="css-bar-chart">
                            {stats.topProducts.map((item, idx) => {
                                const heightPercentage = (item.count / maxSalesCount) * 100;
                                return (
                                    <div key={item.product._id || idx} className="bar-container">
                                        <div className="bar-value">{item.count}</div>
                                        <div className="bar-wrapper">
                                            <div
                                                className="bar-fill"
                                                style={{ height: `${heightPercentage}%`, animationDelay: `${idx * 0.1}s` }}
                                            ></div>
                                        </div>
                                        <div className="bar-label" title={item.product.name}>
                                            {item.product.name.substring(0, 10)}{item.product.name.length > 10 ? '...' : ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted">No sales data to display for the chart.</p>
                    )}
                </div>

                {/* Recent Orders List */}
                <div className="dashboard-section">
                    <h2 className="section-title">Recent Orders</h2>
                    {stats.recentOrders.length > 0 ? (
                        <div className="recent-orders-list">
                            {stats.recentOrders.map(order => (
                                <div key={order._id} className="recent-order-item">
                                    <div className="order-item-header">
                                        <span className="order-id">Order #{order._id.substring(0, 8)}</span>
                                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="order-item-body">
                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className="order-price">${order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No recent orders found.</p>
                    )}
                </div>
            </div>

            {/* Top Products Table */}
            <div className="dashboard-section mt-4">
                <h2 className="section-title">Top Selling Products</h2>
                <div className="table-responsive">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Units Sold</th>
                                <th>Revenue Generated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topProducts.length > 0 ? (
                                stats.topProducts.map(item => (
                                    <tr key={item.product._id}>
                                        <td>
                                            <div className="td-product">
                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/${item.product.imageUrl[0]}`} alt={item.product.name} className="td-img" />
                                                <span>{item.product.name}</span>
                                            </div>
                                        </td>
                                        <td>${item.product.price}</td>
                                        <td>{item.product.category}</td>
                                        <td>{item.count}</td>
                                        <td>${(item.count * item.product.price).toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No top selling products yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default SellerDashboard;
