import { Link, useNavigate } from "react-router-dom";
import Card from "./card";
import './home.css'; 

const Home = ({ products }) => {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const handleLogout = () => {
        localStorage.removeItem("email");
        navigate('/login');
    };

    return (
        <div className="home-container">
            <div className="products-grid">
                {products && products.map(prod => (
                    <Card key={prod._id} id={prod._id} name={prod.name} image={prod.imageUrl[0]} description={prod.description} price={prod.price} showDetailsLink={true} />
                ))}
            </div>
        </div>
    );
};

export default Home;