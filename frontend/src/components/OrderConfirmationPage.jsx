import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, selectedAddress, totalPrice } = location.state;
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => setRazorpayLoaded(true);
        script.onerror = () => setRazorpayLoaded(false);
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        if (paymentMethod === 'ONLINE') {
            const order = await axios.post('http://localhost:3001/api/orders/create-order', {
                amount: totalPrice * 100, // amount in paise
                currency: 'INR',
                receipt: 'receipt#1',
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use the environment variable
                amount: order.data.amount,
                currency: order.data.currency,
                name: 'Ecommerce App',
                description: 'Test Transaction',
                order_id: order.data.id,
                handler: async (response) => {
                    const paymentResult = await axios.post('http://localhost:3001/api/orders/verify-payment', response);
                    if (paymentResult.data.status === 'success') {
                        alert('Payment Successful');
                        navigate('/order-success');
                    } else {
                        alert('Payment Failed');
                    }
                },
                prefill: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            if (razorpayLoaded) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert('Razorpay SDK failed to load. Are you online?');
            }
        } else {
            handlePlaceOrder();
        }
    };

    const handlePlaceOrder = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/orders/place-order', {
                products: cartItems,
                address: selectedAddress,
                totalPrice
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            });

            if (response.status === 201) {
                navigate('/order-success');
            } else {
                console.error('Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#E2D7AB', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Order Confirmation</h1>
            <h2>Products</h2>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {cartItems.map(item => (
                    <li key={item.productId._id} style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center' }}>
                        <img src={`http://localhost:3001/${item.productId.imageUrl[0]}`} alt={item.productId.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '20px' }} />
                        <div>
                            <span>{item.productId.name}</span> - <span>Quantity: {item.quantity}</span> - <span>Price: ${item.productId.price}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <h2>Delivery Address</h2>
            <p>{selectedAddress.address1}, {selectedAddress.address2}, {selectedAddress.city}, {selectedAddress.country}, {selectedAddress.zipCode}</p>
            <h2>Total Price</h2>
            <p>${totalPrice.toFixed(2)}</p>
            <div>
                <label>
                    <input
                        type="radio"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                    />
                    Cash on Delivery
                </label>
                <label>
                    <input
                        type="radio"
                        value="ONLINE"
                        checked={paymentMethod === 'ONLINE'}
                        onChange={() => setPaymentMethod('ONLINE')}
                    />
                    Online Payment
                </label>
            </div>
            {paymentMethod === 'ONLINE' && (
                <button onClick={handlePayment} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'darkGreen', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Pay with Razorpay</button>
            )}
            {paymentMethod === 'COD' && (
                <button onClick={handlePayment} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'darkGreen', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Place Order</button>
            )}
        </div>
    );
};

export default OrderConfirmationPage;