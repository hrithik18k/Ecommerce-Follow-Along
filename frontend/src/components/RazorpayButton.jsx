import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RazorpayButton = ({ totalPrice, cartItems, selectedAddress }) => {
    const navigate = useNavigate();
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => setRazorpayLoaded(true);
        script.onerror = () => setRazorpayLoaded(false);
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        const order = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "https://ecommerce-follow-along-1-1fss.onrender.com"}/api/orders/create-order`, {
            amount: totalPrice * 100, currency: 'INR', receipt: 'receipt#1',
        });

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.data.amount,
            currency: order.data.currency,
            name: 'LuxeMart',
            description: 'Marketplace',
            order_id: order.data.id,
            handler: async (response) => {
                const paymentResult = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "https://ecommerce-follow-along-1-1fss.onrender.com"}/api/orders/verify-payment`, response);
                if (paymentResult.data.status === 'success') {
                    await axios.post(`${import.meta.env.VITE_BACKEND_URL || "https://ecommerce-follow-along-1-1fss.onrender.com"}/api/orders/place-order`, {
                        products: cartItems, address: selectedAddress, totalPrice
                    }, { headers: { Authorization: `Bearer ${token}` } });
                    alert('Payment Successful');
                    navigate('/order-success');
                } else {
                    alert('Payment Failed');
                }
            },
            prefill: { name: 'Customer', email: localStorage.getItem('email') || '', contact: '9999999999' },
            theme: { color: '#818cf8' },
        };

        if (razorpayLoaded) {
            const rzp = new window.Razorpay(options);
            rzp.open();
        } else {
            alert('Razorpay SDK failed to load.');
        }
    };

    return (
        <button onClick={handlePayment} className="btn btn-primary btn-full btn-lg">
            Pay with Razorpay
        </button>
    );
};

export default RazorpayButton;