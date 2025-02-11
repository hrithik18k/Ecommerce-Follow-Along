import './App.css';
import  {Route, Routes, BrowserRouter} from 'react-router-dom'
import ProductForm from './homepage/productform';
import { useEffect, useState } from 'react';
import Home from './homepage/Home';
import axios from 'axios';
import Login from './components/Login';
import SignUp from './components/signUp';
import MyProducts from './components/MyProducts';
function App() {
  const [products, setProducts] = useState([])

  const fetch = async () =>{
    try {
      let res = await axios.get('http://localhost:3000/api/products')
      setProducts(res.data)
    } catch (error) {
      console.log("Error: ", error.message)
    }
  }
  useEffect(() =>{
    fetch()
  }, [products])
  return (
      
    <BrowserRouter>
    <Routes>
    <Route path="/"   element={<Home products={products}/>}/>
    <Route path="/create" element={<ProductForm setProducts={setProducts}/>}/>
    <Route path="/login" element={<Login />}/>
    <Route path="/signup" element={<SignUp />}/>
    <Route path="/my-products" element={<MyProducts products={products} />}/>

    </Routes>
    </BrowserRouter>

  );
}

export default App;