import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RazorpayButton = ({ totalPrice }) => {
    const navigate = useNavigate();
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => setRazorpayLoaded(true);
        script.onerror = () => setRazorpayLoaded(false);
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
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
    };

    return (
        <button onClick={handlePayment} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'darkGreen', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Pay with Razorpay
        </button>
    );
};

export default RazorpayButton;