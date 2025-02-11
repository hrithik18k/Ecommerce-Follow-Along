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
        console.error('Error creating product:', error); // Add logging
        res.status(400).json({ message: 'Error creating product', error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error); // Add logging
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

const getProductsByUserEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const products = await Product.find({ userEmail: email });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by user email:', error); // Add logging
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

module.exports = { createProduct, getAllProducts, getProductsByUserEmail };