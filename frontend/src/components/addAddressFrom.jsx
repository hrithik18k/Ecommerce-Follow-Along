import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './address.css'; // Import the CSS file
import { BASE_URL } from '../config';

const AddAddressForm = () => {
    const [address, setAddress] = useState({
        country: '',
        city: '',
        address1: '',
        address2: '',
        zipCode: '',
        addressType: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem("email");
            await axios.put(`${BASE_URL}/api/users/profile/${email}/address`, address);
            navigate('/profile');
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
                <label>Country:</label>
                <input type="text" name="country" value={address.country} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>City:</label>
                <input type="text" name="city" value={address.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Address 1:</label>
                <input type="text" name="address1" value={address.address1} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Address 2:</label>
                <input type="text" name="address2" value={address.address2} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Zip Code:</label>
                <input type="text" name="zipCode" value={address.zipCode} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Address Type:</label>
                <input type="text" name="addressType" value={address.addressType} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <button type="submit">Add Address</button>
            </div>
        </form>
    );
};

export default AddAddressForm;