import React from 'react';
import { Link } from "react-router-dom";

function Card({ id, name, image, description, price, showEditButton , onDelete }) {
    return (
        <div style={{ 
            border: '1px solid #ccc', 
            padding: '16px', 
            textAlign: 'center', 
            width: '150px', 
            backgroundColor: '#E2D7AB', 
            borderRadius: '8px' 
        }}>
            <img src={`http://localhost:3001/${image}`} alt={name} style={{ width: '100%', height: 'auto', borderRadius: '8px 8px 0 0' }} />
            <h3 >{name}</h3>
            <p>{description}</p>
            <p> <b>{price.toFixed(2)}M $</b></p>
            {showEditButton && (
                <>
                    <Link to={`/edit/${id}`} className="nav-link">Edit</Link>
                    <button onClick={() => onDelete(id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'white', padding: '5px 10px', borderRadius: '4px' }}>Delete</button>
                </>
            )}
        </div>
    );
}

export default Card;