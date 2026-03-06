import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const userEmail = localStorage.getItem("email");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "https://ecommerce-follow-along-1-1fss.onrender.com"}/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!userEmail) { alert('Please sign in to add to cart'); return; }
        if (quantity > product.stock) { alert('Quantity exceeds available stock'); return; }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "https://ecommerce-follow-along-1-1fss.onrender.com"}/api/users/cart`, {
                email: userEmail, productId: product._id, quantity: parseInt(quantity)
            });
            if (response.status === 200) {
                alert(`Added ${quantity} to cart`);
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${import.meta.env.VITE_BACKEND_URL || "https://ecommerce-follow-along-1-1fss.onrender.com"}/${url}`;
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
                    <button onClick={handleAddToCart} className="btn btn-primary btn-lg" disabled={product.stock === 0} style={{ alignSelf: 'flex-start' }}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;