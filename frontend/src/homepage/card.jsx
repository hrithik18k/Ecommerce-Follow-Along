import React from 'react';
import { Link } from "react-router-dom";

function Card({ id, name, image, description, price, showEditButton }) {
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
            {showEditButton && <Link to={`/edit/${id}`} className="nav-link">Edit</Link>}
        </div>
    );
}

export default Card;