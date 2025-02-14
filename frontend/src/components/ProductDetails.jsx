import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {

        alert(`Added ${quantity} of ${product.name} to cart`);
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#E2D7AB', borderRadius: '8px', textAlign: 'left' }}>
            <img src={`http://localhost:3001/${product.imageUrl[0]}`} alt={product.name} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            <h2>Name: {product.name}</h2>
            <p>Description: {product.description}</p>
            <p>Price: <b>{product.price.toFixed(2)}M $</b></p>
            <div>
                <label>Quantity: </label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" style={{ width: '50px', marginRight: '10px' }} />
                <button onClick={handleAddToCart} style={{ padding: '10px 20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid black', borderRadius: '4px', cursor: 'pointer' }}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductDetails;