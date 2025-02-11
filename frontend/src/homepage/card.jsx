import React from 'react';

function Card({ name, image,description, price }) {
    return (
        <div style={{ 
            border: '1px solid #ccc', 
            padding: '16px', 
            textAlign: 'center', 
            width: '150px', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px' 
        }}>
            <img src={`http://localhost:3000/${image}`} alt={name} style={{ width: '100%', height: 'auto', borderRadius: '8px 8px 0 0' }} />
            <h3>{name}</h3>
            <p>{description}</p>
            <p>${price.toFixed(2)}</p>
        </div>
    );
}

export default Card;