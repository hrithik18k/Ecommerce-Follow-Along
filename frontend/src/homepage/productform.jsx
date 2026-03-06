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
    const [isLoading, setIsLoading] = useState(false);
    const email = localStorage.getItem("email");
    const navigate = useNavigate();

    const [category, setCategory] = useState('');
    const categories = [
        'Electronics',
        'Fashion',
        'Home & Kitchen',
        'Beauty & Personal Care',
        'Sports & Outdoors',
        'Books',
        'Toys & Games',
        'Other'
    ];

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}/api/products/${id}`);
                    const product = response.data;
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price);
                    setStock(product.stock);
                    setCategory(product.category || '');
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
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category', category);
        formData.append('userEmail', email);
        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            let response;
            if (id) {
                response = await axios.put(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}/api/products/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}`}/api/products`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-page">
            <div className="form-card">
                <h2 className="form-card-title">
                    {id ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Product Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" placeholder="Enter product name" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="form-input" placeholder="Describe your product" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="form-input"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Price ($)</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="form-input" placeholder="0.00" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stock</label>
                            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="form-input" placeholder="0" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Product Images</label>
                        <input type="file" multiple onChange={handleImageChange} className="form-input-file" accept="image/*" />
                    </div>
                    {(existingImages.length > 0 || images.length > 0) && (
                        <div className="image-preview-grid">
                            {existingImages.map((image, index) => (
                                <img key={`existing-${index}`} src={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}/${image}`} alt={`Preview ${index}`} className="image-preview-item" />
                            ))}
                            {images.map((image, index) => (
                                <img key={`new-${index}`} src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="image-preview-item" />
                            ))}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isLoading}>
                        {isLoading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProductForm;