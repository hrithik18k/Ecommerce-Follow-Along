import { useEffect, useState } from "react";
import Card from "../homepage/card";

const MyProducts = ({ products }) => {
    const [myProducts, setMyProducts] = useState([]);
    const email = localStorage.getItem("email");

    useEffect(() => {
        if (Array.isArray(products)) {
            const filteredProducts = products.filter((el) => el.userEmail === email);
            setMyProducts(filteredProducts);
        }
    }, [products, email]);

    return (
        <div>
            {myProducts && myProducts.map(prod => (
                <Card 
                    key={prod._id} 
                    id={prod._id} 
                    name={prod.name} 
                    image={prod.imageUrl[0]} 
                    description={prod.description} 
                    price={prod.price} 
                    showEditButton={true} 
                />
            ))}
        </div>
    );
}

export default MyProducts;