import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'];

    useEffect(() => {
        const fetchSellerOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/seller-orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching seller orders:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (token) fetchSellerOrders();
    }, [token]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200) {
                setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
                toast('Order status updated successfully');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast('Failed to update status');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Canceled': return 'order-status order-status-canceled';
            case 'Delivered': return 'order-status order-status-delivered';
            case 'Shipped': return 'order-status order-status-processing'; // You can add more classes in CSS
            default: return 'order-status order-status-pending';
        }
    };

    if (isLoading) {
        return <div className="loading-container"><div className="loading-spinner"></div></div>;
    }

    return (
        <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="page-title">Seller Orders</h1>
            <p className="page-subtitle">Manage orders for your products ({orders.length} total)</p>

            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div key={order._id} className="order-card" style={{ animationDelay: `${index * 0.08}s` }}>
                        <div className="order-header">
                            <div>
                                <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    Customer: {order.user.name} ({order.user.email})
                                </div>
                            </div>
                            <span className={getStatusClass(order.status)}>{order.status}</span>
                        </div>

                        <div className="order-products-list">
                            <div style={{ fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Your Products in this order:</div>
                            {order.products.map(product => (
                                <div key={product.productId._id} className="order-product-item">
                                    <span className="order-product-name">{product.productId.name}</span>
                                    <span className="order-product-detail">x{product.quantity}</span>
                                    <span className="order-product-detail">${product.productId.price}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-address">
                            <div className="order-address-label">Shipping Address</div>
                            {order.address.address1}, {order.address.address2 && `${order.address.address2}, `}
                            {order.address.city}, {order.address.country} - {order.address.zipCode}
                        </div>

                        <div className="order-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <label htmlFor={`status-${order._id}`} style={{ marginRight: '0.5rem', fontSize: '0.85rem' }}>Update Status:</label>
                                <select
                                    id={`status-${order._id}`}
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                    className="form-input"
                                    style={{ width: 'auto', padding: '0.25rem 0.5rem', marginBottom: 0 }}
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="order-total">Order Total: ${order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">—</div>
                    <h3 className="empty-state-title">No orders found</h3>
                    <p className="empty-state-text">Orders will appear here once customers buy your products</p>
                </div>
            )}
        </div>
    );
};

export default SellerOrdersPage;

