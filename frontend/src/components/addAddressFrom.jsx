import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


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
            await axios.put(`http://localhost:3001/api/users/profile/${email}/address`, address);
            navigate('/profile');
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Country:</label>
                <input type="text" name="country" value={address.country} onChange={handleChange} required />
            </div>
            <div>
                <label>City:</label>
                <input type="text" name="city" value={address.city} onChange={handleChange} required />
            </div>
            <div>
                <label>Address 1:</label>
                <input type="text" name="address1" value={address.address1} onChange={handleChange} required />
            </div>
            <div>
                <label>Address 2:</label>
                <input type="text" name="address2" value={address.address2} onChange={handleChange} />
            </div>
            <div>
                <label>Zip Code:</label>
                <input type="text" name="zipCode" value={address.zipCode} onChange={handleChange} required />
            </div>
            <div>
                <label>Address Type:</label>
                <input type="text" name="addressType" value={address.addressType} onChange={handleChange} required />
            </div>
            <button type="submit">Add Address</button>
        </form>
    );
};

export default AddAddressForm;