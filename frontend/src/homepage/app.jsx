import '../App.css';
import Card from './card';
import ProductForm from './ProductForm';
import { Link, Route, Routes } from 'react-router-dom';

const products = [
    { id: 1, name: 'Duck', image: 'https://images.pexels.com/photos/132464/pexels-photo-132464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', price: 212.99 },
    { id: 2, name: 'Teddy', image: 'https://images.pexels.com/photos/12211/pexels-photo-12211.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', price: 339.99 },
    { id: 3, name: 'Animals', image: 'https://images.pexels.com/photos/1319572/pexels-photo-1319572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', price: 449.99 },
    { id: 4, name: 'Rabbit', image: 'https://images.pexels.com/photos/2156261/pexels-photo-2156261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', price: 406.00 },
];

function App() {
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
                            <Card key={product.id} name={product.name} image={product.image} price={product.price} />
                        ))}
                    </div>
                } />
                <Route path="/add-product" element={<ProductForm />} />
            </Routes>
        </div>
    );
}

export default App;