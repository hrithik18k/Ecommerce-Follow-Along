import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);

    const userEmail = useSelector(state => state.user.email);
    const token = useSelector(state => state.user.token);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        const checkWishlist = async () => {
            if (!userEmail) return;
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist/${userEmail}`);
                const wishlistedIds = response.data.map(product => typeof product === 'string' ? product : product._id);
                setIsWishlisted(wishlistedIds.includes(id));
            } catch (error) {
                console.error("Error checking wishlist", error);
            }
        };

        fetchProduct();
        checkWishlist();
    }, [id, userEmail]);

    const handleAddToCart = async () => {
        if (!userEmail) { toast('Please sign in to add to cart'); return; }
        if (quantity > product.stock) { toast('Quantity exceeds available stock'); return; }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart`, {
                email: userEmail, productId: product._id, quantity: parseInt(quantity)
            }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.status === 200) {
                toast(`Added ${quantity} to cart`);
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${import.meta.env.VITE_BACKEND_URL}/${url}`;
    };

    const handleWishlistToggle = async () => {
        if (!userEmail) { toast('Please sign in to wishlist products'); return; }
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist/${userEmail}`, { productId: id });
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.error('Error toggling wishlist', error);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/reviews`, { rating, comment }, config);
            if (response.status === 201) {
                toast("Review submitted successfully");
                setComment("");
                // Reload product to show recent review
                const productRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
                setProduct(productRes.data);
            }
        } catch (error) {
            toast(error.response?.data?.message || 'Error submitting review');
        }
    };

    if (!product) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="product-details-page">
                <div className="product-details-gallery">
                    <img src={getImageUrl(product.imageUrl[selectedImage] || product.imageUrl[0])} alt={product.name} />
                    {product.imageUrl.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', overflowX: 'auto' }}>
                            {product.imageUrl.map((img, i) => (
                                <img key={i} src={getImageUrl(img)} alt={`Thumb ${i}`} onClick={() => setSelectedImage(i)}
                                    style={{
                                        width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer',
                                        border: selectedImage === i ? '2px solid var(--color-accent)' : '2px solid transparent',
                                        opacity: selectedImage === i ? 1 : 0.5, transition: 'all 0.2s ease'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="product-details-info">
                    <h1 className="product-details-name">{product.name}</h1>
                    <p className="product-details-description">{product.description}</p>
                    <div className="product-details-price">${product.price.toFixed(2)}</div>
                    <span className={`product-details-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                    <div className="section-divider"></div>
                    <div className="quantity-selector">
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Quantity:</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" max={product.stock} className="quantity-input" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button onClick={handleAddToCart} className="btn btn-primary btn-lg" disabled={product.stock === 0}>
                            Add to Cart
                        </button>
                        <button onClick={handleWishlistToggle} className="btn btn-secondary btn-lg" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: isWishlisted ? 'red' : 'var(--text-color)' }}>
                            {isWishlisted ? '♥ Wishlisted' : '♡ Add to Wishlist'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="product-reviews-section" style={{ marginTop: '3rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: '15px' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Reviews ({product.numReviews}) - ⭐ {(product.rating || 0).toFixed(1)}</h2>

                <div className="reviews-list" style={{ marginBottom: '2rem' }}>
                    {product.reviews && product.reviews.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review this product!</p>
                    ) : (
                        product.reviews?.map(review => (
                            <div key={review._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong>{review.name}</strong>
                                    <span style={{ color: '#ffb400' }}>{'⭐'.repeat(review.rating)}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {userEmail && (
                    <div className="write-review">
                        <h3>Write a Customer Review</h3>
                        <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <div className="form-group">
                                <label>Rating</label>
                                <select value={rating} onChange={(e) => setRating(e.target.value)} className="form-input" style={{ width: '100px' }}>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="form-input"
                                    rows="4"
                                    required
                                    placeholder="Share your thoughts about this product..."
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Submit Review</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;