import { Link } from "react-router-dom";
import Card from "./card";
import './home.css'; 

const Home = ({ products }) => {
    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="navbar-left">
                    <h1 className="web-name">War-Mart</h1>
                </div>
                <div className="navbar-right">
                    <Link to={'/create'} className="nav-link">Add Product</Link>
                    <Link to={'/login'} className="nav-link">Login</Link>
                    <Link to={'/signup'} className="nav-link">Signup</Link>
                    <Link to={'/my-products'} className="nav-link">My Products</Link>
                </div>
            </nav>
            <div className="products-grid">
                {products && products.map(prod => (
                    <Card key={prod._id} id={prod._id} name={prod.name} image={prod.imageUrl[0]} description={prod.description} price={prod.price} />
                ))}
            </div>
        </div>
    );
};

export default Home;