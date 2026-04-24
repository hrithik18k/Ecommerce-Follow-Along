import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import './AdminDashboard.css';

const UserManagement = ({ users, handleRoleChange }) => (
    <div className="users-management">
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
);

UserManagement.propTypes = {
    users: PropTypes.array.isRequired,
    handleRoleChange: PropTypes.func.isRequired
};

const CouponManagement = ({ coupons, newCoupon, setNewCoupon, handleCreateCoupon, handleToggleCoupon }) => (
    <div className="coupons-management">
        <div className="form-card" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Create New Coupon</h3>
            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                    <label htmlFor="coupon-code" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Code</label>
                    <input id="coupon-code" type="text" required value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} className="form-input" style={{ width: '150px' }} />
                </div>
                <div>
                    <label htmlFor="coupon-discount" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Discount %</label>
                    <input id="coupon-discount" type="number" required min="1" max="100" value={newCoupon.discountPercent} onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: e.target.value })} className="form-input" style={{ width: '100px' }} />
                </div>
                <div>
                    <label htmlFor="coupon-maxUses" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Max Uses</label>
                    <input id="coupon-maxUses" type="number" required min="1" value={newCoupon.maxUses} onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })} className="form-input" style={{ width: '100px' }} />
                </div>
                <div>
                    <label htmlFor="coupon-expiresAt" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expiry Date</label>
                    <input id="coupon-expiresAt" type="date" required value={newCoupon.expiresAt} onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })} className="form-input" />
                </div>
                <button type="submit" className="btn btn-primary">Create Coupon</button>
            </form>
        </div>

        <div className="table-responsive">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Uses</th>
                        <th>Expires At</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map(coupon => (
                        <tr key={coupon._id}>
                            <td style={{ fontWeight: 'bold' }}>{coupon.code}</td>
                            <td>{coupon.discountPercent}%</td>
                            <td>{coupon.usedCount} / {coupon.maxUses}</td>
                            <td>{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                            <td>{coupon.isActive ? <span style={{ color: 'var(--color-success)' }}>Active</span> : <span style={{ color: 'var(--color-danger)' }}>Inactive</span>}</td>
                            <td>
                                <button
                                    className={`btn btn-sm ${coupon.isActive ? 'btn-danger' : 'btn-success'}`}
                                    onClick={() => handleToggleCoupon(coupon._id)}
                                >
                                    {coupon.isActive ? 'Disable' : 'Enable'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {coupons.length === 0 && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No coupons found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

CouponManagement.propTypes = {
    coupons: PropTypes.array.isRequired,
    newCoupon: PropTypes.object.isRequired,
    setNewCoupon: PropTypes.func.isRequired,
    handleCreateCoupon: PropTypes.func.isRequired,
    handleToggleCoupon: PropTypes.func.isRequired
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [coupons, setCoupons] = useState([]);

    // Form state for new coupon
    const [newCoupon, setNewCoupon] = useState({ code: '', discountPercent: '', maxUses: '', expiresAt: '' });

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

                // Fetch coupons
                const couponsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/coupons`, config);
                setCoupons(couponsResponse.data);

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

            setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
            toast.success("User role updated successfully!");
        } catch (err) {
            console.error("Error updating user role:", err);
            toast.error("Failed to update user role.");
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/coupons`, newCoupon, config);
            setCoupons([res.data.coupon, ...coupons]);
            setNewCoupon({ code: '', discountPercent: '', maxUses: '', expiresAt: '' });
            toast.success("Coupon created successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating coupon');
        }
    };

    const handleToggleCoupon = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/coupons/${id}/toggle`, {}, config);
            setCoupons(coupons.map(c => c._id === id ? res.data.coupon : c));
            toast.success("Coupon status updated");
        } catch (err) {
            toast.error("Error updating coupon");
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

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <button
                    style={{ padding: '0.8rem 1.5rem', background: 'transparent', color: activeTab === 'users' ? 'var(--color-accent)' : 'var(--text-secondary)', border: 'none', borderBottom: activeTab === 'users' ? '2px solid var(--color-accent)' : 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
                    onClick={() => setActiveTab('users')}
                >
                    User Management
                </button>
                <button
                    style={{ padding: '0.8rem 1.5rem', background: 'transparent', color: activeTab === 'coupons' ? 'var(--color-accent)' : 'var(--text-secondary)', border: 'none', borderBottom: activeTab === 'coupons' ? '2px solid var(--color-accent)' : 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
                    onClick={() => setActiveTab('coupons')}
                >
                    Coupons System
                </button>
            </div>

            {activeTab === 'users' && (
                <UserManagement users={users} handleRoleChange={handleRoleChange} />
            )}

            {activeTab === 'coupons' && (
                <CouponManagement coupons={coupons} newCoupon={newCoupon} setNewCoupon={setNewCoupon} handleCreateCoupon={handleCreateCoupon} handleToggleCoupon={handleToggleCoupon} />
            )}
        </div>
    );
};

export default AdminDashboard

