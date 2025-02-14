import './App.css';
import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom';
import ProductForm from './homepage/productform';
import { useEffect, useState } from 'react';
import Home from './homepage/Home';
import axios from 'axios';
import Login from './components/Login';
import SignUp from './components/signUp';
import MyProducts from './components/MyProducts';
import ProductDetails from './components/ProductDetails'; // Import the new component
import { Link, useNavigate } from "react-router-dom";

function App() {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const fetchProducts = async () => {
        try {
            let res = await axios.get('http://localhost:3001/api/products');
            setProducts(res.data);
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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
                <Route path="/product/:id" element={<ProductDetails />} /> {/* Add this route */}
            </Routes>
        </div>
    );
}

export default App;