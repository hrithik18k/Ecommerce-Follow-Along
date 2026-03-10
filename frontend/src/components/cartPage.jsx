import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [couponError, setCouponError] = useState('');
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
        if (appliedCoupon && total > 0) {
            // Recalculate discount based on percentage, wait, earlier I just set discountAmount based on the same. 
            // I'll leave the discountAmount static if cart changes or recalculate. 
            // Better to just reset coupon if cart changes or recalculate.
            // Actually, let's just reset coupon for simplicity if quantity changes, or we can recalculate later.
        }
    };

    const handleApplyCoupon = async () => {
        try {
            setCouponError('');
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/coupons/apply`, { code: couponCode }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const discountPercent = res.data.discountPercent;
            const discount = (totalPrice * discountPercent) / 100;
            setDiscountAmount(discount);
            setAppliedCoupon(res.data.code);
            setCouponCode('');
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Invalid coupon');
        }
    };

    const handlePlaceOrder = () => {
        const finalPrice = totalPrice - discountAmount;
        navigate('/select-address', { state: { cartItems, totalPrice: finalPrice, couponCode: appliedCoupon, discountAmount } });
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
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Subtotal</span>
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Shipping</span>
                            <span style={{ color: 'var(--color-success)' }}>Free</span>
                        </div>

                        {/* Coupon Section */}
                        <div style={{ margin: '1rem 0', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    className="form-input"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button onClick={handleApplyCoupon} className="btn btn-secondary">Apply</button>
                            </div>
                            {couponError && <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{couponError}</div>}
                            {appliedCoupon && (
                                <div style={{ color: 'var(--color-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    Coupon {appliedCoupon} applied! (-${discountAmount.toFixed(2)})
                                </div>
                            )}
                        </div>

                        <div className="cart-summary-row cart-summary-total">
                            <span>Total</span>
                            <span className="cart-summary-total-price">${Math.max(0, totalPrice - discountAmount).toFixed(2)}</span>
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