import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const userEmail = localStorage.getItem('email'); // Retrieve email from local storage
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/users/cart/${userEmail}`);
                const cart = response.data.cart || [];
                setCartItems(cart);
                calculateTotalPrice(cart);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [userEmail]);

    const handleQuantityChange = async (productId, action) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/users/cart/quantity`, { email: userEmail, productId, action });
            if (response.status === 200) {
                const updatedCart = response.data.cart;
                setCartItems(updatedCart);
                calculateTotalPrice(updatedCart);
            } else {
                console.error('Failed to update cart item quantity');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleDelete = async (productId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/users/cart/${userEmail}/${productId}`);
            if (response.status === 200) {
                const updatedCart = response.data.cart;
                setCartItems(updatedCart);
                calculateTotalPrice(updatedCart);
            } else {
                console.error('Failed to delete cart item');
            }
        } catch (error) {
            console.error('Error deleting cart item:', error);
        }
    };

    const calculateTotalPrice = (cart) => {
        const total = cart.reduce((sum, item) => {
            if (item.productId && item.productId.price) {
                return sum + (item.productId.price * item.quantity);
            }
            return sum;
        }, 0);
        setTotalPrice(total);
    };

    const handlePlaceOrder = () => {
        navigate('/select-address', { state: { cartItems, totalPrice } });
    };

    return (
        <div style={{ padding: '20px', backgroundImage: "url('/military-background.jpg')", borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: "white" }}>Cart</h1>
            <ul style={{ listStyleType: 'none', padding: '0', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}>
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <li key={`${item.productId?._id}-${item.quantity}`} style={{ display: 'flex', alignItems: 'center', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#E2D7AB', border:"2px solid white" }}>
                            {item.productId?.imageUrl && item.productId.imageUrl.length > 0 && (
                                <img src={`${BASE_URL}/${item.productId.imageUrl[0]}`} alt={item.productId?.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '20px' }} />
                            )}
                            <div style={{ flex: '1' }}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.productId?.name || 'Product not available'}</span>
                                <span style={{ display: 'block', marginTop: '5px' }}>Price: ${item.productId?.price || 0}</span>
                                <span style={{ display: 'block', marginTop: '5px' }}>Quantity: {item.quantity}</span>
                                <span style={{ display: 'block', marginTop: '5px' }}>Total: ${(item.productId?.price * item.quantity).toFixed(2)}</span>
                                <div style={{ marginTop: '10px' }}>
                                    <button onClick={() => handleQuantityChange(item.productId?._id, 'increase')} style={{ padding: '5px 10px', marginRight: '5px', border: 'none', backgroundColor: 'darkGreen', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                                    <button onClick={() => handleQuantityChange(item.productId?._id, 'decrease')} style={{ padding: '5px 10px', border: 'none', backgroundColor: 'darkGreen', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                                    <button onClick={() => handleDelete(item.productId?._id)} style={{ padding: '5px 10px', marginLeft: '5px', border: 'none', backgroundColor: 'maroon', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </ul>
            <div style={{ marginTop: '20px', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                Total Price: ${totalPrice.toFixed(2)}
            </div>
            <button onClick={handlePlaceOrder} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'darkGreen', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Place Order</button>
        </div>
    );
};

export default CartPage;