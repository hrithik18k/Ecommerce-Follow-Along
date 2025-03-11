import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("email")) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3001/api/users/login', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); // Store the token in localStorage
                localStorage.setItem("email", email); // Store the email in localStorage
                navigate('/');
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundImage: "url('/military-background.jpg')", borderRadius:'8px' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%',border:"3px solid white" }}>
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
                    <button type="submit" style={{ width: '100%', backgroundColor: '#E2D7AB', color: 'black', padding: '10px', borderRadius: '4px', border: '1px solid black', cursor: 'pointer' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;