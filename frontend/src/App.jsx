import './App.css';
import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom';
import ProductForm from './homepage/productform';
import { useEffect, useState } from 'react';
import Home from './homepage/Home';
import axios from 'axios';
import Login from './components/Login';
import SignUp from './components/signUp';
import MyProducts from './components/MyProducts';
import ProductDetails from './components/ProductDetails';
import CartPage from './components/cartPage'; 
import Profile from './components/profile'; // Import Profile component
import AddAddressForm from './components/addAddressFrom'; // Import AddAddressForm component
import SelectAddressPage from './components/SelectAddressPage'; // Import SelectAddressPage component
import OrderConfirmationPage from './components/OrderConfirmationPage'; // Import OrderConfirmationPage component
import OrderSuccessPage from './components/OrderSuccessPage'; // Import OrderSuccessPage component
import MyOrdersPage from './components/MyOrdersPage'; // Import MyOrdersPage component
import { BASE_URL } from '../src/config';

import { Link, useNavigate } from "react-router-dom";

function App() {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const fetchProducts = async () => {
        try {
            let res = await axios.get(`${BASE_URL}/api/products`); // Correct URL
            setProducts(res.data);
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };
    
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/users/profile/${email}`); // Correct URL
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
        localStorage.removeItem("email");
        navigate('/login');
    };

    return (
        <div>
            {location.pathname !== '/login' && location.pathname !== '/signup' && (
                <nav className="navbar">
                    <div className="navbar-left">
                        <h1 className="web-name">War-Mart</h1>
                    </div>
                    <div className="navbar-right">
                        <Link to={'/'} className="nav-link">Home</Link>
                        {email ? (
                            <>
                                <Link to={'/create'} className="nav-link">Add Product</Link>
                                <Link to={'/my-products'} className="nav-link">My Products</Link>
                                <Link to={'/cart'} className="nav-link">Cart</Link>
                                <Link to={'/my-orders'} className="nav-link">My Orders</Link>
                                {user && (
                                    <Link to={'/profile'} className="profile-info">
                                        <img src={`${BASE_URL}/${user.profilePicture}`} alt="Profile" className="profile-image" />
                                        <span className="profile-name">{user.name}</span>
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="nav-link">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to={'/login'} className="nav-link">Login</Link>
                                <Link to={'/signup'} className="nav-link">Signup</Link>
                            </>
                        )}
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
            </Routes>
        </div>
    );
}

export default App;