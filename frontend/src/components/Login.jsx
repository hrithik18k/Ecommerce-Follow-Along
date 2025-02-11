import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if(response.ok){
        localStorage.setItem("email", email)
        navigate('/')
    }
    const data = await response.json(); 
    alert(data.message);
};

return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f3f3' }}>
    <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: '1.5rem' }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555' }}>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: '4px', padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} required />
        </div>
        <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555' }}>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: '4px', padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} required />
        </div>
        <button type="submit" style={{ width: '100%', backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
            Login
        </button>
        </form>
    </div>
    </div>
);
};

export default Login;
