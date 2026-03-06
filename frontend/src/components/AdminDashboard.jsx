import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = useSelector((state) => state.user.token);
    const role = useSelector((state) => state.user.role);
    const navigate = useNavigate();

    useEffect(() => {
        if (role !== 'admin') { navigate('/'); return; }

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}`}/api/users/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [token, role, navigate]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}`}/api/users/role`, { userId, role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Error updating user role');
        }
    };

    const getRoleBadgeClass = (r) => {
        switch (r) {
            case 'admin': return 'role-badge role-badge-admin';
            case 'seller': return 'role-badge role-badge-seller';
            default: return 'role-badge role-badge-buyer';
        }
    };

    const adminCount = users.filter(u => u.role === 'admin').length;
    const sellerCount = users.filter(u => u.role === 'seller').length;
    const buyerCount = users.filter(u => u.role === 'buyer').length;

    if (isLoading) {
        return (<div className="loading-container"><div className="loading-spinner"></div></div>);
    }

    return (
        <div className="admin-container">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Manage users and platform settings</p>

            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-value">{users.length}</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{adminCount}</div>
                    <div className="stat-label">Admins</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--color-warning)' }}>{sellerCount}</div>
                    <div className="stat-label">Sellers</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--color-success)' }}>{buyerCount}</div>
                    <div className="stat-label">Buyers</div>
                </div>
            </div>

            <div className="glass-panel-solid" style={{ padding: '1.5rem', overflow: 'auto' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>
                    All Users
                </h3>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Current Role</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} style={{ animationDelay: `${index * 0.05}s` }}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {user.profilePicture && (
                                            <img src={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}/${user.profilePicture}`} alt={user.name}
                                                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                                            />
                                        )}
                                        <span style={{ fontWeight: '500' }}>{user.name}</span>
                                    </div>
                                </td>
                                <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                                <td><span className={getRoleBadgeClass(user.role)}>{user.role}</span></td>
                                <td>
                                    <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} className="role-select">
                                        <option value="buyer">Buyer</option>
                                        <option value="seller">Seller</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
