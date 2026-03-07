import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RazorpayButton from './RazorpayButton';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, selectedAddress, totalPrice } = location.state;
    const token = localStorage.getItem('token');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isPlacing, setIsPlacing] = useState(false);

    const handlePlaceOrder = async () => {
        setIsPlacing(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/place-order`, {
                products: cartItems, address: selectedAddress, totalPrice
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (response.status === 201) {
                navigate('/order-success');
            }
        } catch (error) {
            console.error('Error placing order:', error);
        } finally {
            setIsPlacing(false);
        }
    };

    return (
        <div className="order-confirmation-container">
            <h1 className="page-title">Order Confirmation</h1>
            <p className="page-subtitle">Review your order before placing it</p>

            <div className="order-card">
                <h3 style={{ color: '#fff', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Products</h3>
                {cartItems.map(item => (
                    <div key={item.productId._id} className="order-product-item">
                        <img src={`${import.meta.env.VITE_BACKEND_URL}/${item.productId.imageUrl[0]}`} alt={item.productId.name} className="order-product-image" />
                        <span className="order-product-name">{item.productId.name}</span>
                        <span className="order-product-detail">x{item.quantity}</span>
                        <span className="order-product-detail">${item.productId.price}</span>
                    </div>
                ))}
            </div>

            <div className="order-card">
                <h3 style={{ color: '#fff', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Delivery Address</h3>
                <div className="order-address">
                    <div className="order-address-label">Delivering to</div>
                    {selectedAddress.address1}, {selectedAddress.address2 && `${selectedAddress.address2}, `}
                    {selectedAddress.city}, {selectedAddress.country} - {selectedAddress.zipCode}
                </div>
            </div>

            <div className="order-card">
                <h3 style={{ color: '#fff', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Payment Method</h3>
                <div className="payment-options">
                    <div className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('COD')}>
                        <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                        <span className="payment-label">Cash on Delivery</span>
                    </div>
                    <div className={`payment-option ${paymentMethod === 'ONLINE' ? 'selected' : ''}`} onClick={() => setPaymentMethod('ONLINE')}>
                        <input type="radio" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} />
                        <span className="payment-label">Online Payment</span>
                    </div>
                </div>
            </div>

            <div className="cart-summary">
                <div className="cart-summary-row cart-summary-total">
                    <span>Total</span>
                    <span className="cart-summary-total-price">${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                {paymentMethod === 'ONLINE' ? (
                    <RazorpayButton totalPrice={totalPrice} cartItems={cartItems} selectedAddress={selectedAddress} />
                ) : (
                    <button onClick={handlePlaceOrder} className="btn btn-primary btn-full btn-lg" disabled={isPlacing}>
                        {isPlacing ? 'Placing Order...' : 'Place Order'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderConfirmationPage;