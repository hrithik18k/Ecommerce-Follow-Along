import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const userEmail = localStorage.getItem('email');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart/${userEmail}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart/quantity`, { email: userEmail, productId, action }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                const updatedCart = response.data.cart;
                setCartItems(updatedCart);
                calculateTotalPrice(updatedCart);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleDelete = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart/${userEmail}/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                const updatedCart = response.data.cart;
                setCartItems(updatedCart);
                calculateTotalPrice(updatedCart);
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
        <div className="cart-container">
            <h1 className="page-title">Shopping Cart</h1>
            <p className="page-subtitle">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>

            {cartItems.length > 0 ? (
                <>
                    {cartItems.map((item, index) => (
                        <div key={`${item.productId?._id}-${item.quantity}`} className="cart-item" style={{ animationDelay: `${index * 0.08}s` }}>
                            {item.productId?.imageUrl && item.productId.imageUrl.length > 0 && (
                                <img
                                    src={item.productId.imageUrl[0].startsWith('http')
                                        ? item.productId.imageUrl[0]
                                        : `${import.meta.env.VITE_BACKEND_URL}/${item.productId.imageUrl[0]}`}
                                    alt={item.productId?.name}
                                    className="cart-item-image"
                                />
                            )}
                            <div className="cart-item-details">
                                <div className="cart-item-name">{item.productId?.name || 'Product not available'}</div>
                                <div className="cart-item-price">Unit: ${item.productId?.price || 0}</div>
                                <div className="cart-item-total">Subtotal: ${(item.productId?.price * item.quantity).toFixed(2)}</div>
                                <div className="cart-item-quantity">
                                    <button onClick={() => handleQuantityChange(item.productId?._id, 'decrease')} className="btn btn-glass btn-icon">−</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.productId?._id, 'increase')} className="btn btn-glass btn-icon">+</button>
                                    <button onClick={() => handleDelete(item.productId?._id)} className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }}>Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="cart-summary">
                        <div className="cart-summary-row">
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Items ({cartItems.length})</span>
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Shipping</span>
                            <span style={{ color: 'var(--color-success)' }}>Free</span>
                        </div>
                        <div className="cart-summary-row cart-summary-total">
                            <span>Total</span>
                            <span className="cart-summary-total-price">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button onClick={handlePlaceOrder} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1rem' }}>
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            ) : (
                <div className="cart-empty">
                    <div className="cart-empty-icon">—</div>
                    <h3 className="empty-state-title">Your cart is empty</h3>
                    <p className="empty-state-text">Add some products to get started</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                        Browse Products
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;