import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from '../config';

function Card({ id, name, image, description, price, showEditButton, onDelete, showDetailsLink, showAddToCartButton = true }) {
    const [isHovered, setIsHovered] = useState(false);

    const linkStyle = {
        color: 'black',
        textDecoration: 'none'
    };

    const handleAddToCart = async () => {
        const userEmail = localStorage.getItem('email'); 
        if (!userEmail) {
            alert('Please sign in or log in to add products to the cart.');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/users/cart`, { email: userEmail, productId: id, quantity: 1 });
            if (response.status === 200) {
                alert('Product added to cart');
            } else {
                console.error('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const cardContent = (
        <>
            <img src={`${BASE_URL}/${image}`} alt={name} style={{ width: '100%', height: 'auto', borderRadius: '8px 8px 0 0' }} />
            <h3>{name}</h3>
            <p>{description}</p>
            <p><b>{price.toFixed(2)}M $</b></p>
        </>
    );

    return (
        <div 
            style={{ 
                border: '1px solid #ccc', 
                padding: '16px', 
                textAlign: 'center', 
                width: '150px', 
                backgroundColor: '#E2D7AB', 
                borderRadius: '8px' ,
                border: isHovered ? "2px solid #000" : "2px solid white", 
                transition: "border-color 0.3s ease"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {showDetailsLink ? (
                <Link to={`/product/${id}`} style={linkStyle}>
                    {cardContent}
                </Link>
            ) : (
                cardContent
            )}
            {showAddToCartButton && (
                <button onClick={handleAddToCart} style={{ marginTop: '10px', backgroundColor: 'darkGreen', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Add to Cart</button>
            )}
            {showEditButton && (
                <>
                    <Link style={{marginRight: '10px', backgroundColor: 'darkGreen', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }} to={`/edit/${id}`} className="nav-link">Edit</Link>
                    <button onClick={() => onDelete(id)} style={{ marginLeft: '10px', backgroundColor: 'maroon', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Delete</button>
                </>
            )}
        </div>
    );
}

export default Card;