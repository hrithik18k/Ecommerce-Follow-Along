import React, { useState } from 'react';
import axios from 'axios'
function ProductForm({setProducts}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        images.forEach((image) => {
            formData.append('images', image); // ✅ Correct format
        });
        

        try {
            const response = await axios.post('http://localhost:3000/api/addProducts',formData)
            console.log(response.data)
            setProducts(response.data.product)
            if(response.data.success){
                alert(response.data.message)
            }
        
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <label style={labelStyle}>
                Product Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
            </label>
            <label style={labelStyle}>
                Description:
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required style={inputStyle} />
            </label>
            <label style={labelStyle}>
                Price:
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={inputStyle} />
            </label>
            <label style={labelStyle}>
                Product Images:
                <input type="file" multiple onChange={handleImageChange} required style={inputStyle} />
            </label>
            <div style={previewContainerStyle}>
                {images.length > 0 && images.map((image, index) => (
                    <img key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} style={previewImageStyle} />
                ))}
            </div>
            <button type="submit" style={buttonStyle}>Submit</button>
        </form>
    );
}

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(168, 216, 144, 0.1)',
};

const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: '#000', 
};

const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
};

const previewContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px',
};

const previewImageStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #ccc',
};

export default ProductForm;