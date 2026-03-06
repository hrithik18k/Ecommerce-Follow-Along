import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const email = localStorage.getItem("email");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/users/profile/${email}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserProfile();
    }, [email]);

    const handleFileChange = (e) => { setProfilePicture(e.target.files[0]); };

    const handleEditProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('addresses', JSON.stringify(user.addresses));
        if (profilePicture) formData.append('profilePicture', profilePicture);

        try {
            const response = await axios.put(`http://localhost:3001/api/users/profile/${email}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const updatedUser = response.data.user;

            // If email changed, update localStorage
            if (updatedUser.email !== email) {
                localStorage.setItem("email", updatedUser.email);
            }

            setUser(updatedUser);
            setIsEditing(false);
            alert('Profile updated successfully');

            // Optional: If email changed, you might want to refresh the page to update all components
            if (updatedUser.email !== email) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Error updating profile');
        }
    };

    const handleDeleteAddress = async (index) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/users/profile/${email}/address`, { data: { index } });
            setUser(response.data.user);
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'role-badge role-badge-admin';
            case 'seller': return 'role-badge role-badge-seller';
            default: return 'role-badge role-badge-buyer';
        }
    };

    if (!user) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <h1 className="page-title">My Profile</h1>

            <div className="profile-card">
                <img src={`http://localhost:3001/${user.profilePicture}`} alt="Profile" className="profile-avatar" />
                <h2 className="profile-user-name">{user.name}</h2>
                <p className="profile-user-email">{user.email}</p>
                <div className="profile-user-role">
                    <span className={getRoleBadgeClass(user.role)} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                        {user.role}
                    </span>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            {isEditing && (
                <div className="form-card" style={{ maxWidth: '100%', marginBottom: '1.5rem' }}>
                    <h3 className="form-card-title">Edit Profile</h3>
                    <form onSubmit={handleEditProfile}>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required className="form-input" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required className="form-input" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Profile Picture</label>
                            <input type="file" onChange={handleFileChange} className="form-input-file" accept="image/*" />
                        </div>
                        <button type="submit" className="btn btn-primary btn-full">Save Changes</button>
                    </form>
                </div>
            )}

            <div className="address-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 className="address-section-title" style={{ marginBottom: 0 }}>Addresses</h3>
                    <button onClick={() => navigate('/add-address')} className="btn btn-primary btn-sm">Add Address</button>
                </div>
                {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((address, index) => (
                        <div key={index} className="address-card">
                            <div className="address-text">
                                <strong>{address.addressType}</strong><br />
                                {address.address1}, {address.address2 && `${address.address2}, `}
                                {address.city}, {address.country} - {address.zipCode}
                            </div>
                            <button onClick={() => handleDeleteAddress(index)} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                    ))
                ) : (
                    <div className="empty-state" style={{ padding: '2rem' }}>
                        <div className="empty-state-icon">—</div>
                        <h3 className="empty-state-title">No addresses yet</h3>
                        <p className="empty-state-text">Add a delivery address to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;