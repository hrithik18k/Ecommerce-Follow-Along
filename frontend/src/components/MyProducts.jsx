import { useEffect, useState } from "react";
import Card from "../homepage/card";
import axios from 'axios';

const MyProducts = ({ products }) => {
    const [myProducts, setMyProducts] = useState([]);
    const email = localStorage.getItem("email");

    useEffect(() => {
        if (Array.isArray(products)) {
            setMyProducts(products.filter((el) => el.userEmail === email));
        }
    }, [products, email]);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}/api/products/${id}`);
            if (response.data.success) {
                setMyProducts(myProducts.filter(product => product._id !== id));
                alert(response.data.message);
            }
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}/api/users/cart/${email}/${id}`);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">My Products</h1>
            <p className="page-subtitle">Manage your listed products ({myProducts.length} total)</p>
            <div className="products-grid">
                {myProducts.length > 0 ? (
                    myProducts.map((prod, index) => (
                        <div key={prod._id} style={{ animationDelay: `${index * 0.05}s` }}>
                            <Card id={prod._id} name={prod.name} image={prod.imageUrl[0]} description={prod.description} price={prod.price} showEditButton={true} onDelete={handleDelete} showDetailsLink={false} showAddToCartButton={false} />
                        </div>
                    ))
                ) : (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <div className="empty-state-icon">—</div>
                        <h3 className="empty-state-title">No products yet</h3>
                        <p className="empty-state-text">Start selling by adding your first product</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyProducts;