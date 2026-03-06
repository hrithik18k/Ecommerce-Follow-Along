import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

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
                const response = await axios.get(`http://localhost:3001/api/users/profile/${userEmail}`);
                setAddresses(response.data.addresses || []);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };
        fetchAddresses();
    }, [userEmail]);

    const handleConfirmOrder = () => {
        if (selectedAddress) {
            navigate('/order-confirmation', { state: { cartItems, selectedAddress, totalPrice } });
        } else {
            alert('Please select an address');
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="page-title">Select Delivery Address</h1>
            <p className="page-subtitle">Choose where you'd like your order delivered</p>

            {addresses.length > 0 ? (
                <div>
                    {addresses.map((address, index) => (
                        <div key={index} className={`address-select-card ${selectedAddress === address ? 'selected' : ''}`} onClick={() => setSelectedAddress(address)}>
                            <input type="radio" name="address" className="address-radio" checked={selectedAddress === address} onChange={() => setSelectedAddress(address)} />
                            <div className="address-text">
                                <strong>{address.addressType || 'Address'}</strong><br />
                                {address.address1}, {address.address2 && `${address.address2}, `}
                                {address.city}, {address.country} - {address.zipCode}
                            </div>
                        </div>
                    ))}
                    <button onClick={handleConfirmOrder} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1.5rem' }}>
                        Continue to Confirmation
                    </button>
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">—</div>
                    <h3 className="empty-state-title">No addresses found</h3>
                    <p className="empty-state-text">Please add an address in your profile first</p>
                    <button onClick={() => navigate('/add-address')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Add Address</button>
                </div>
            )}
        </div>
    );
};

export default SelectAddressPage;