import toast from 'react-hot-toast';
import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

function Card({ id, name, image, description, price, showEditButton, onDelete, showDetailsLink, showAddToCartButton = true }) {
    const handleAddToCart = async () => {
        const userEmail = localStorage.getItem('email');
        if (!userEmail) {
            toast('Please sign in to add products to your cart.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart`,
                { email: userEmail, productId: id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200) {
                toast('Product added to cart');
            } else {
                console.error('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const cardContent = (
        <>
            <div className="product-card-image-wrapper">
                <img
                    src={image && image.startsWith('http') ? image : `${import.meta.env.VITE_BACKEND_URL}/${image}`}
                    alt={name}
                    className="product-card-image"
                />
                <div className="product-card-overlay">
                    {showDetailsLink && (
                        <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '500' }}>
                            View Details
                        </span>
                    )}
                </div>
            </div>
            <div className="product-card-body">
                <h3 className="product-card-name">{name}</h3>
                <p className="product-card-description">{description}</p>
            </div>
        </>
    );

    return (
        <div className="product-card">
            {showDetailsLink ? (
                <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {cardContent}
                </Link>
            ) : (
                cardContent
            )}
            <div className="product-card-footer">
                <span className="product-card-price">${price.toFixed(2)}</span>
                <div className="product-card-actions">
                    {showAddToCartButton && (
                        <button onClick={handleAddToCart} className="btn btn-primary btn-sm">
                            Add to Cart
                        </button>
                    )}
                    {showEditButton && (
                        <>
                            <Link to={`/edit/${id}`} className="btn btn-secondary btn-sm">
                                Edit
                            </Link>
                            <button onClick={() => onDelete(id)} className="btn btn-danger btn-sm">
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Card;