import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, selectedAddress, totalPrice } = location.state;

    const handlePlaceOrder = () => {
        // Implement order placement logic here
        console.log('Order placed');
        navigate('/order-success');
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
            <button onClick={handlePlaceOrder} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'darkGreen', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Place Order</button>
        </div>
    );
};

export default OrderConfirmationPage;