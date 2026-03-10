import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/user-orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        if (token) fetchOrders();
    }, [token]);

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'Canceled' } : order));
            }
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Canceled': return 'order-status order-status-canceled';
            case 'Delivered': return 'order-status order-status-delivered';
            default: return 'order-status order-status-pending';
        }
    };

    const renderStepper = (status, statusHistory = []) => {
        const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

        if (status === 'Canceled') {
            const cancelHistory = statusHistory.find(h => h.status === 'Canceled');
            return (
                <div style={{ color: 'var(--color-danger)', fontWeight: 'bold', margin: '1rem 0', padding: '1rem', background: 'rgba(248, 113, 113, 0.1)', borderRadius: 'var(--radius-md)' }}>
                    ❌ Order Canceled
                    {cancelHistory &&
                        <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-danger)', opacity: 0.8 }}>
                            on {new Date(cancelHistory.timestamp).toLocaleString()}
                        </span>
                    }
                </div>
            );
        }

        const currentStepIndex = steps.indexOf(status);

        return (
            <div className="order-timeline" style={{ display: 'flex', justifyContent: 'space-between', margin: '2rem 0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '15px', left: 'auto', right: 'auto', width: '100%', height: '2px', background: 'var(--border)', zIndex: 0 }}></div>
                {steps.map((step, idx) => {
                    const historyItem = statusHistory.find(h => h.status === step);
                    const isCompleted = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', width: '25%' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isCompleted ? 'var(--color-accent)' : 'var(--surface)',
                                border: `2px solid ${isCompleted ? 'var(--color-accent)' : 'var(--border)'}`,
                                color: isCompleted ? '#fff' : 'var(--text-secondary)',
                                fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem',
                                transition: 'all 0.3s ease'
                            }}>
                                {isCompleted ? '✓' : idx + 1}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: isCurrent ? 'bold' : 'normal', color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {step}
                                </div>
                                {historyItem && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                        {new Date(historyItem.timestamp).toLocaleDateString()}<br />
                                        {new Date(historyItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">Track and manage your orders ({orders.length} total)</p>

            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div key={order._id} className="order-card" style={{ animationDelay: `${index * 0.08}s` }}>
                        <div className="order-header">
                            <div className="order-id">
                                Order #{order._id.slice(-8).toUpperCase()}
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontWeight: 'normal' }}>
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <span className={getStatusClass(order.status)}>{order.status}</span>
                        </div>

                        {/* Order Timeline Stepper */}
                        {renderStepper(order.status, order.statusHistory)}

                        <div className="order-products-list">
                            {order.products.map(product => (
                                <div key={product.productId._id} className="order-product-item">
                                    <span className="order-product-name">{product.productId.name}</span>
                                    <span className="order-product-detail">x{product.quantity}</span>
                                    <span className="order-product-detail">${product.productId.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="order-address">
                            <div className="order-address-label">Delivery Address</div>
                            {order.address.address1}, {order.address.address2 && `${order.address.address2}, `}
                            {order.address.city}, {order.address.country} - {order.address.zipCode}
                        </div>
                        <div className="order-footer">
                            <span className="order-total">Total: ${order.totalPrice.toFixed(2)}</span>
                            {order.status !== 'Canceled' && (
                                <button onClick={() => handleCancelOrder(order._id)} className="btn btn-danger btn-sm">Cancel Order</button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">—</div>
                    <h3 className="empty-state-title">No orders yet</h3>
                    <p className="empty-state-text">Your order history will appear here</p>
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;