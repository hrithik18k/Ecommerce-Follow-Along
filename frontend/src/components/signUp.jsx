import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const SignUp = () => {
    const [name, setName] = useState('');
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

        if (!email || !password || !name) {
            alert('Please fill out all fields');
            return;
        }
        
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        if(response.ok){
            navigate('/login');
        }
        const data = await response.json(); 
        alert(data.message);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundImage: "url('/military-background.jpg')",borderRadius:"8px" }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' , border:"3px solid white"}}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: '1.5rem' }}>Sign Up</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555' }}>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555' }}>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555' }}>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }} required />
                    </div>
                    <button type="submit" style={{ width: '100%', backgroundColor: '#E2D7AB', color: 'black', padding: '10px', borderRadius: '4px', border: '1px solid black', cursor: 'pointer' }}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;