const Product = require('../models/productModels');
const path = require('path');

const createProduct = async (req, res) => {
    try {
        const { name, description, price, userEmail } = req.body;
        const imageUrls = req.files.map(file => path.join('uploads', file.filename));

        const newProduct = new Product({
            name,
            description,
            price,
            userEmail,
            imageUrl: imageUrls,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully',success:true, product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error); 
        res.status(400).json({ message: 'Error creating product', error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error); 
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

const getProductsByUserEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const products = await Product.find({ userEmail: email });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by user email:', error); 
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};


const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product: ", error);
        res.status(500).json({ message: "Error in fetching product", error: error.message });
    }
};

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, userEmail } = req.body;
        let imageUrls = req.files.map(file => path.join('uploads', file.filename));

        if (imageUrls.length === 0) {
            const existingProduct = await Product.findById(id);
            imageUrls = existingProduct.imageUrl;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, userEmail, imageUrl: imageUrls },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: 'Product updated successfully', success: true, product: updatedProduct });
    } catch (error) {
        console.error("Error updating product: ", error);
        res.status(500).json({ message: "Error in updating product", error: error.message });
    }
};

const deletedProduct = async (req,res) => {
    try {
        const {id} = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: 'Product deleted successfully', success: true });
    } catch (error) {
        console.error("Error updating product: ", error);
        res.status(500).json({ message: "Error in deleting product", error: error.message });
    }
}

module.exports = { createProduct, getAllProducts, getProductsByUserEmail ,editProduct,getProductById, deletedProduct };