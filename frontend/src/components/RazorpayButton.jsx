import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config'; // Import the BASE_URL

const RazorpayButton = ({ totalPrice, cartItems, selectedAddress }) => {
    const navigate = useNavigate();
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const token = localStorage.getItem('token'); // Get the token from localStorage

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => setRazorpayLoaded(true);
        script.onerror = () => setRazorpayLoaded(false);
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        try {
            // Create an order on the backend
            const order = await axios.post(`${BASE_URL}/api/orders/create-order`, {
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
                    try {
                        // Verify the payment on the backend
                        const paymentResult = await axios.post(`${BASE_URL}/api/orders/verify-payment`, response);

                        if (paymentResult.data.status === 'success') {
                            // Place the order on the backend
                            await axios.post(`${BASE_URL}/api/orders/place-order`, {
                                products: cartItems,
                                address: selectedAddress,
                                totalPrice,
                            }, {
                                headers: {
                                    Authorization: `Bearer ${token}`, // Include the token in the request headers
                                },
                            });

                            alert('Payment Successful');
                            navigate('/order-success');
                        } else {
                            alert('Payment Failed');
                        }
                    } catch (error) {
                        console.error('Error verifying payment or placing order:', error);
                        alert('An error occurred while processing your payment.');
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
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            alert('An error occurred while initiating the payment.');
        }
    };

    return (
        <button onClick={handlePayment} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'darkGreen', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Pay with Razorpay
        </button>
    );
};

export default RazorpayButton;