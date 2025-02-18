import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [addresses, setAddresses] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.post('http://localhost:3001/api/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.user) {
                alert('User registered successfully');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user');
        }
    };

    return (
        <div style={formContainerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <label style={labelStyle}>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                </label>
                <label style={labelStyle}>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                </label>
                <label style={labelStyle}>
                    Address:
                    <input type="text" value={addresses} onChange={(e) => setAddresses(e.target.value)} required style={inputStyle} />
                </label>
                <label style={labelStyle}>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
                </label>
                <label style={labelStyle}>
                    Profile Picture:
                    <input type="file" onChange={handleFileChange} style={inputStyle} />
                </label>
                <button type="submit" style={buttonStyle}>Sign Up</button>
            </form>
        </div>
    );
};

const formContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#E2D7AB',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
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
    backgroundColor: '#E2D7AB',
    color: '#000',
    cursor: 'pointer',
};

export default SignUp;