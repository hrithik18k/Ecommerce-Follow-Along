import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import ProductForm from './homepage/productform';
import { useEffect, useState } from 'react';
import Home from './homepage/Home';
import axios from 'axios';
import Login from './components/Login';
import SignUp from './components/signUp';
import MyProducts from './components/MyProducts';
import ProductDetails from './components/ProductDetails';
import CartPage from './components/cartPage';
import Profile from './components/profile';
import AddAddressForm from './components/addAddressFrom';
import SelectAddressPage from './components/SelectAddressPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import OrderSuccessPage from './components/OrderSuccessPage';
import MyOrdersPage from './components/MyOrdersPage';
import AdminDashboard from './components/AdminDashboard';
import SellerOrdersPage from './components/SellerOrdersPage';

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/userSlice';

function App() {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const email = useSelector((state) => state.user.email);
    const role = useSelector((state) => state.user.role);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const fetchProducts = async () => {
        try {
            let res = await axios.get('http://localhost:3001/api/products');
            setProducts(res.data);
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/users/profile/${email}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        if (email) {
            fetchUserProfile();
        }
    }, [email]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    const getRoleBadgeClass = (r) => {
        switch (r) {
            case 'admin': return 'role-badge role-badge-admin';
            case 'seller': return 'role-badge role-badge-seller';
            default: return 'role-badge role-badge-buyer';
        }
    };

    return (
        <div>
            {!isAuthPage && (
                <nav className="navbar">
                    <div className="navbar-left">
                        <Link to="/">
                            <h1 className="web-name">LuxeMart</h1>
                        </Link>
                    </div>
                    <div className="navbar-right">
                        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}>
                            Home
                        </Link>
                        {email ? (
                            <>
                                {(role === 'seller' || role === 'admin') && (
                                    <>
                                        <Link to="/create" className={`nav-link ${location.pathname === '/create' ? 'nav-link-active' : ''}`}>
                                            Add Product
                                        </Link>
                                        <Link to="/my-products" className={`nav-link ${location.pathname === '/my-products' ? 'nav-link-active' : ''}`}>
                                            My Products
                                        </Link>
                                    </>
                                )}
                                <Link to="/cart" className={`nav-link ${location.pathname === '/cart' ? 'nav-link-active' : ''}`}>
                                    Cart
                                </Link>
                                <Link to="/my-orders" className={`nav-link ${location.pathname === '/my-orders' ? 'nav-link-active' : ''}`}>
                                    Orders
                                </Link>
                                {(role === 'seller' || role === 'admin') && (
                                    <Link to="/seller-orders" className={`nav-link ${location.pathname === '/seller-orders' ? 'nav-link-active' : ''}`}>
                                        Seller Orders
                                    </Link>
                                )}
                                {role === 'admin' && (
                                    <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'nav-link-active' : ''}`}>
                                        Admin
                                    </Link>
                                )}
                                {user && (
                                    <Link to="/profile" className="profile-info">
                                        <img src={`http://localhost:3001/${user.profilePicture}`} alt="Profile" className="profile-image" />
                                        <span className="profile-name">{user.name}</span>
                                        <span className={getRoleBadgeClass(role)}>{role}</span>
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
                            </>
                        )}
                        <button onClick={toggleTheme} className="theme-toggle" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                            {theme === 'dark' ? '☀' : '☾'}
                        </button>
                    </div>
                </nav>
            )}
            <Routes>
                <Route path="/" element={<Home products={products} />} />
                <Route path="/create" element={<ProductForm setProducts={setProducts} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/my-products" element={<MyProducts products={products} />} />
                <Route path="/edit/:id" element={<ProductForm setProducts={setProducts} />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-address" element={<AddAddressForm />} />
                <Route path="/select-address" element={<SelectAddressPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/seller-orders" element={<SellerOrdersPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </div>
    );
}

export default App;