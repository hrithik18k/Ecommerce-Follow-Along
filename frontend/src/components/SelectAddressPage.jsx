import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../config';

const SelectAddressPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const userEmail = localStorage.getItem('email');
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, totalPrice } = location.state;

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/users/profile/${userEmail}`);
                setAddresses(response.data.addresses || []);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
    }, [userEmail]);

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
    };

    const handleConfirmOrder = () => {
        if (selectedAddress) {
            navigate('/order-confirmation', { state: { cartItems, selectedAddress, totalPrice } });
        } else {
            alert('Please select an address');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#E2D7AB', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Select Delivery Address</h1>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {addresses.length > 0 ? (
                    addresses.map((address, index) => (
                        <li key={index} style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: selectedAddress === address ? '#d1c49a' : '#fff' }}>
                            <input type="radio" name="address" value={index} onChange={() => handleSelectAddress(address)} />
                            <span>{address.country}, {address.city}, {address.address1}, {address.address2}, {address.zipCode}, {address.addressType}</span>
                        </li>
                    ))
                ) : (
                    <p>No addresses found. Please add an address in your profile.</p>
                )}
            </ul>
            <button onClick={handleConfirmOrder} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'darkGreen', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Confirm Order</button>
        </div>
    );
};

export default SelectAddressPage;