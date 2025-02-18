import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';

function ProductForm({ setProducts }) {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(''); 
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const email = localStorage.getItem("email");
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/products/${id}`);
                    const product = response.data;
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price);
                    setStock(product.stock);
                    setExistingImages(product.imageUrl);
                } catch (error) {
                    console.error("Error fetching product:", error);
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock); 
        formData.append('userEmail', email);
        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            let response;
            if (id) {
                response = await axios.put(`http://localhost:3001/api/products/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await axios.post('http://localhost:3001/api/products', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            console.log(response.data);
            setProducts(prevProducts => {
                if (id) {
                    return prevProducts.map(prod => prod._id === id ? response.data.product : prod);
                } else {
                    return [...prevProducts, response.data.product];
                }
            });
            if (response.data.success) {
                alert(response.data.message);
                navigate('/');
            }
        } catch (error) {
            console.error('Error in adding or editing the product:', error);
            alert('Error in adding or editing the product');
        }
    };

    return (
        <div style={backgroundStyle}>
            <div style={overlayStyle}>
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
                        Stock:
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required style={inputStyle} />
                    </label>
                    <label style={labelStyle}>
                        Product Images:
                        <input type="file" multiple onChange={handleImageChange} style={inputStyle} />
                    </label>
                    <div style={previewContainerStyle}>
                        {existingImages.length > 0 && existingImages.map((image, index) => (
                            <img key={index} src={`http://localhost:3001/${image}`} alt={`Preview ${index}`} style={previewImageStyle} />
                        ))}
                        {images.length > 0 && images.map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} style={previewImageStyle} />
                        ))}
                    </div>
                    <button type="submit" style={buttonStyle}>Submit</button>
                </form>
            </div>
        </div>
    );
}

const backgroundStyle = {
    backgroundColor: "red",
    backgroundImage: "url('/military-background.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '20px',
};
const overlayStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#E2D7AB',
    color: '#000',
    cursor: 'pointer',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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