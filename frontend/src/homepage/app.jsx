import '../App.css';
import Card from './card';
import ProductForm from './ProductForm';
import { Link, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <nav>
                <button style={{color:"'#f9f9f9'"}}>
                <Link to="/"style={{color:"white"}}>Home</Link>
                </button>
                <br />
                <button style={{color:"'#f9f9f9'"}}>
                    <Link to="/add-product" style={{color:"white"}}>
                        Add Product
                    </Link></button>
            </nav>
            <Routes>
                <Route path="/" element={
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        {products.map(product => (
                            <Card key={product._id} name={product.name} image={product.imageUrl} price={product.price} />
                        ))}
                    </div>
                } />
                <Route path="/add-product" element={<ProductForm />} />
            </Routes>
        </div>
    );
}

export default App;