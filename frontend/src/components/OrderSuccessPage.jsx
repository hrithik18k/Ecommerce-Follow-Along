import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="order-success">
            <div className="success-icon">✓</div>
            <h1 className="success-title">Order Placed Successfully</h1>
            <p className="success-message">
                Thank you for your purchase. Your order has been confirmed and will be delivered soon.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => navigate('/my-orders')} className="btn btn-primary btn-lg">View Orders</button>
                <button onClick={() => navigate('/')} className="btn btn-secondary btn-lg">Continue Shopping</button>
            </div>
        </div>
    );
};

export default OrderSuccessPage;