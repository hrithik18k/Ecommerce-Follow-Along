import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token'); // Get the token from localStorage

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/orders/user-orders`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request headers
                    }
                });
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (token) {
            fetchOrders();
        } else {
            console.error('No token found');
        }
    }, [token]);

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await axios.patch(`${BASE_URL}/api/orders/${orderId}/cancel`, {}, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            });

            if (response.status === 200) {
                setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'Canceled' } : order));
            } else {
                console.error('Failed to cancel order');
            }
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundImage: "url('/military-background.jpg')", borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: "white" }}>My Orders</h1>
            {orders.length > 0 ? (
                orders.map(order => (
                    <div key={order._id} style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#E2D7AB', border:"2px solid white" }}>
                        <h2>Order ID: {order._id}</h2>
                        <p>Status: {order.status}</p>
                        <h3>Products:</h3>
                        <ul style={{ listStyleType: 'none', padding: '0' }}>
                            {order.products.map(product => (
                                <li key={product.productId._id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                                    <span>{product.productId.name}</span> - <span>Quantity: {product.quantity}</span> - <span>Price: ${product.productId.price}</span>
                                </li>
                            ))}
                        </ul>
                        <h3>Delivery Address:</h3>
                        <p>{order.address.address1}, {order.address.address2}, {order.address.city}, {order.address.country}, {order.address.zipCode}</p>
                        <h3>Total Price: ${order.totalPrice.toFixed(2)}</h3>
                        {order.status !== 'Canceled' && (
                            <button onClick={() => handleCancelOrder(order._id)} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: 'maroon', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel Order</button>
                        )}
                    </div>
                ))
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default MyOrdersPage;