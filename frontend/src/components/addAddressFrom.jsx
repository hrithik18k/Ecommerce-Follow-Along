import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddAddressForm = () => {
    const [address, setAddress] = useState({ country: '', city: '', address1: '', address2: '', zipCode: '', addressType: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem("email");
            await axios.put(`${import.meta.env.VITE_BACKEND_URL || "https://ecommerce-follow-along-1-1fss.onrender.com"}/api/users/profile/${email}/address`, address);
            navigate('/profile');
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    return (
        <div className="form-page">
            <div className="form-card">
                <h2 className="form-card-title">Add New Address</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Country</label>
                        <input type="text" name="country" value={address.country} onChange={handleChange} required className="form-input" placeholder="e.g. India" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">City</label>
                        <input type="text" name="city" value={address.city} onChange={handleChange} required className="form-input" placeholder="e.g. Mumbai" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Address Line 1</label>
                        <input type="text" name="address1" value={address.address1} onChange={handleChange} required className="form-input" placeholder="Street address" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Address Line 2</label>
                        <input type="text" name="address2" value={address.address2} onChange={handleChange} className="form-input" placeholder="Apartment, suite, etc. (optional)" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Zip Code</label>
                            <input type="text" name="zipCode" value={address.zipCode} onChange={handleChange} required className="form-input" placeholder="e.g. 400001" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select name="addressType" value={address.addressType} onChange={handleChange} required className="form-select">
                                <option value="">Select type</option>
                                <option value="Home">Home</option>
                                <option value="Office">Office</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-full btn-lg">Save Address</button>
                </form>
            </div>
        </div>
    );
};

export default AddAddressForm;