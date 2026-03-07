import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useSelector(state => state.user.token);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const statsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/stats`, config);
                setStats(statsResponse.data);

                const usersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/all`, config);
                setUsers(usersResponse.data);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (token) {
            fetchAdminData();
        }
    }, [token]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/role`, { userId, role: newRole }, config);

            // Update local state
            setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
            toast("User role updated successfully!");
        } catch (err) {
            console.error("Error updating user role:", err);
            toast("Failed to update user role.");
        }
    };

    if (loading) return <div className="admin-container"><h2>Loading Admin Stats...</h2></div>;
    if (error) return <div className="admin-container"><h2>Error: {error}</h2></div>;

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Dashboard</h1>

            {stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p className="stat-value">{stats.totalUsers}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Products</h3>
                        <p className="stat-value">{stats.totalProducts}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p className="stat-value">{stats.totalOrders}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
            )}

            <div className="users-management">
                <h2>User Management</h2>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <select
                                            className="role-select"
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        >
                                            <option value="buyer">Buyer</option>
                                            <option value="seller">Seller</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm" style={{ backgroundColor: 'var(--primary-color)' }}>Save</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard
