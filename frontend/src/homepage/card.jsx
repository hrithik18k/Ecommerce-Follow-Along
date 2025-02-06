import React from 'react';

function Card({ name, image, price }) {
    return (
        <div style={{ 
            border: '1px solid #ccc', 
            padding: '16px', 
            textAlign: 'center', 
            width: '150px', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px' 
        }}>
            <img src={image} alt={name} style={{ width: '100%', height: 'auto', borderRadius: '8px 8px 0 0' }} />
            <h3 style={{color:"black"}}>{name}</h3>
            <p style={{color:"black"}}>${price.toFixed(2)}</p>
        </div>
    );
}

export default Card;