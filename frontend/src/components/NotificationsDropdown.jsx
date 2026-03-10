import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NotificationsDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const token = useSelector(state => state.user.token);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.isRead).length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        // Optional: Polling every 60s
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            try {
                await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${notif._id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(notifications.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error) {
                console.error('Error marking as read', error);
            }
        }
        setIsOpen(false);
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/mark-all-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read', error);
        }
    };

    if (!token) return null;

    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', padding: '0.5rem', display: 'flex', alignItems: 'center' }}
            >
                <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>🔔</div>
                {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '2px', right: '2px', background: 'var(--color-danger)', color: '#fff', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{ position: 'absolute', top: '100%', right: '0', width: '300px', background: 'var(--navbar-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000, overflow: 'hidden', marginTop: '0.5rem', animation: 'fadeIn 0.2s ease-out' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h4>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.8rem' }}>
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif._id}
                                    onClick={() => handleNotificationClick(notif)}
                                    style={{ padding: '1rem', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: notif.isRead ? 'transparent' : 'rgba(255,255,255,0.02)', transition: 'background 0.2s', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: notif.isRead ? 'normal' : 'bold', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{notif.title}</div>
                                        {!notif.isRead && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{notif.message}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.5rem', opacity: 0.7 }}>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
