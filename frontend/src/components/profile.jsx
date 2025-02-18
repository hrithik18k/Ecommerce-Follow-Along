import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newAddress, setNewAddress] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const email = localStorage.getItem("email");

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

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleAddAddress = async () => {
        if (newAddress.trim() !== '') {
            const updatedAddresses = [...user.addresses, newAddress];
            setUser(prevUser => ({
                ...prevUser,
                addresses: updatedAddresses
            }));
            setNewAddress('');

            // Update addresses in the database
            try {
                await axios.put(`http://localhost:3001/api/users/profile/${email}`, {
                    name: user.name,
                    email: user.email,
                    addresses: JSON.stringify(updatedAddresses)
                });
            } catch (error) {
                console.error('Error updating addresses:', error);
                alert('Error updating addresses');
            }
        }
    };

    const handleEditProfile = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('addresses', JSON.stringify(user.addresses));
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.put(`http://localhost:3001/api/users/profile/${email}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser(response.data.user);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={profileContainerStyle}>
            <div style={profileSectionStyle}>
                <img src={`http://localhost:3001/${user.profilePicture}`} alt="Profile" style={profileImageStyle} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <button onClick={() => setIsEditing(true)} style={buttonStyle}>Edit Profile</button>
            </div>
            <div style={addressSectionStyle}>
                <h3>Addresses</h3>
                {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((address, index) => (
                        <div key={index} style={addressStyle}>
                            <p>{address}</p>
                        </div>
                    ))
                ) : (
                    <p>No address found</p>
                )}
                <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Add new address"
                    style={inputStyle}
                />
                <button onClick={handleAddAddress} style={buttonStyle}>Add Address</button>
            </div>
            {isEditing && (
                <form onSubmit={handleEditProfile} style={formStyle}>
                    <label style={labelStyle}>
                        Name:
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            required
                            style={inputStyle}
                        />
                    </label>
                    <label style={labelStyle}>
                        Email:
                        <input
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            required
                            style={inputStyle}
                        />
                    </label>
                    <label style={labelStyle}>
                        Profile Picture:
                        <input type="file" onChange={handleFileChange} style={inputStyle} />
                    </label>
                    <button type="submit" style={buttonStyle}>Save Changes</button>
                </form>
            )}
        </div>
    );
};

const profileContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E2D7AB',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '0 auto',
    border:"2px solid black"
};

const profileSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
};

const profileImageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
};

const addressSectionStyle = {
    width: '100%',
    textAlign: 'left',
};

const addressStyle = {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
    border: '1px solid #ccc',
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
    backgroundColor: 'darkGreen',
    color: 'white',
    cursor: 'pointer',
};

export default Profile;