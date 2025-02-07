import './App.css';
import  {Route, Routes, BrowserRouter} from 'react-router-dom'
import ProductForm from './homepage/productform';
import { useState } from 'react';
import Home from './homepage/Home';
function App() {
  const [products, setProducts] = useState([])
  return (
      
    <BrowserRouter>
    <Routes>
    <Route index   element={<Home products={products}/>}/>
    <Route path="/create" element={<ProductForm setProducts={setProducts}/>}/>
    </Routes>
    </BrowserRouter>

  );
}

export default App;