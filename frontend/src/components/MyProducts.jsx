import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../homepage/card";
import axios from 'axios';

const MyProducts = ({ products }) => {
    const [myProducts, setMyProducts] = useState([]);
    const email = localStorage.getItem("email");

    useEffect(() => {
        if (Array.isArray(products)) {
            const filteredProducts = products.filter((el) => el.userEmail === email);
            setMyProducts(filteredProducts);
        }
    }, [products, email]);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/products/${id}`);
            if (response.data.success) {
                setMyProducts(myProducts.filter(product => product._id !== id));
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        }
    };

    const containerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'center',
        backgroundImage: 'url("/military-background.jpg")', 
        backgroundSize: 'cover',
        padding: '20px',
    };

    const cardStyle = {
        flex: '1 1 calc(25% - 32px)', 
        boxSizing: 'border-box',
        maxWidth: '300px',
    };

    const mediaQueries = `
        @media (max-width: 1200px) {
            .card {
                flex: 1 1 calc(33.33% - 32px); /* 3 items per row on medium screens */
            }
        }
        @media (max-width: 768px) {
            .card {
                flex: 1 1 calc(50% - 32px); /* 2 items per row on small screens */
            }
        }
        @media (max-width: 480px) {
            .card {
                flex: 1 1 100%; /* 1 item per row on extra small screens */
            }
        }
    `;

    return (
        <div style={containerStyle}>
            <style>{mediaQueries}</style>
            <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
                <Link to="/" style={{ 
                    textDecoration: 'none', 
                    color: 'black', 
                    backgroundColor: '#E2D7AB', 
                    padding: '10px 20px', 
                    borderRadius: '5px' ,
                    border: '1px solid #ccc', 
                }}>
                    Home
                </Link>
            </div>
            {myProducts && myProducts.map(prod => (
                <div key={prod._id} style={cardStyle} className="card">
                    <Card 
                        id={prod._id} 
                        name={prod.name} 
                        image={prod.imageUrl[0]} 
                        description={prod.description} 
                        price={prod.price} 
                        showEditButton={true} 
                        onDelete={handleDelete} 
                    />
                </div>
            ))}
        </div>
    );
}

export default MyProducts;