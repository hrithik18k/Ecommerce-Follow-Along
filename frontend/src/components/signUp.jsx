import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRoleInput] = useState('buyer');
    const [profilePicture, setProfilePicture] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.user) {
                toast('Account created successfully!');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            toast('Error registering user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <button onClick={toggleTheme} className="theme-toggle" style={{ position: 'fixed', top: '1rem', right: '1rem' }} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                {theme === 'dark' ? '☀' : '☾'}
            </button>
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">LuxeMart</div>
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join our marketplace</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" placeholder="Enter your password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role" className="form-label">Register as</label>
                        <select id="role" value={role} onChange={(e) => setRoleInput(e.target.value)} className="form-select">
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                        <input id="profilePicture" type="file" onChange={handleFileChange} className="form-input-file" accept="image/*" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>
                <div className="auth-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
