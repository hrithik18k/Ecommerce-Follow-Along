const Product = require('../models/productModels');

const createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        const newProduct = new Product({
            name,
            description,
            price,
            imageUrl
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error:error.message });
    }
};

const getAllProducts = async (req,res) => {
    try{
        const Products = await Product.find();
        res.status(200).json(Products);
    }catch(error){
        res.status(500).json({message:"Error fetching products", error: error.message})
    }
}

module.exports = { createProduct , getAllProducts };