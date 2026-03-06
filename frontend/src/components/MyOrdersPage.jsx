import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/orders/user-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        if (token) fetchOrders();
    }, [token]);

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await axios.patch(`http://localhost:3001/api/orders/${orderId}/cancel`, {}, {
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

    return (
        <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">Track and manage your orders ({orders.length} total)</p>

            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div key={order._id} className="order-card" style={{ animationDelay: `${index * 0.08}s` }}>
                        <div className="order-header">
                            <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                            <span className={getStatusClass(order.status)}>{order.status}</span>
                        </div>
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