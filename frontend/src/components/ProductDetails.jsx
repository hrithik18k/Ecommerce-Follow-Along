import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { BASE_URL } from '../config';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const userEmail = localStorage.getItem("email");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (quantity > product.stock) {
            alert('Quantity exceeds available stock');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/users/cart`, {
                email: userEmail,
                productId: product._id,
                quantity: parseInt(quantity)
            });
            if (response.status === 200) {
                alert(`Added ${quantity} of ${product.name} to cart`);
            } else {
                alert('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Error adding product to cart');
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#E2D7AB', borderRadius: '8px', textAlign: 'left' }}>
            <img src={`${BASE_URL}/${product.imageUrl[0]}`} alt={product.name} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            <h2>Name: {product.name}</h2>
            <p>Description: {product.description}</p>
            <p>Price: <b>{product.price.toFixed(2)}M $</b></p>
            <p>Stock: {product.stock}</p> 
            <div>
                <label>Quantity: </label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" max={product.stock} style={{ width: '50px', marginRight: '10px' }} />
                <button onClick={handleAddToCart} style={{ padding: '10px 20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid black', borderRadius: '4px', cursor: 'pointer' }}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductDetails;