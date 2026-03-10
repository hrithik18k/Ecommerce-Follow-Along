const Product = require('../models/productModels');
const User = require('../models/userModel');
const Order = require('../models/order');
const path = require('path');

const createProduct = async (req, res) => {
    try {
        const { name, description, price, userEmail, stock, category } = req.body;
        const imageUrls = req.files.map(file => path.join('uploads', file.filename));

        const newProduct = new Product({
            name,
            description,
            price,
            userEmail,
            imageUrl: imageUrls,
            stock,
            category
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', success: true, product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: 'Error creating product', error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { minPrice, maxPrice, sort, page, limit, keyword } = req.query;

        let queryObj = {};

        if (keyword) {
            queryObj.name = { $regex: keyword, $options: 'i' };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            queryObj.price = {};
            if (minPrice !== undefined && minPrice !== '') queryObj.price.$gte = Number(minPrice);
            if (maxPrice !== undefined && maxPrice !== '') queryObj.price.$lte = Number(maxPrice);
        }

        let sortObj = {};
        if (sort === 'price_asc') sortObj.price = 1;
        else if (sort === 'price_desc') sortObj.price = -1;
        else if (sort === 'newest') sortObj.createdAt = -1;
        else if (sort === 'top_rated') sortObj.rating = -1;

        if (!page && !keyword && !minPrice && !maxPrice && !sort) {
            const products = await Product.find();
            return res.status(200).json(products);
        }

        // Always apply sortObj if sort is provided, even without pagination
        if (!page && !limit && sort) {
            const products = await Product.find(queryObj).sort(sortObj);
            return res.status(200).json(products);
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;

        const count = await Product.countDocuments(queryObj);
        let productsQuery = Product.find(queryObj);

        if (Object.keys(sortObj).length > 0) {
            productsQuery = productsQuery.sort(sortObj);
        }

        const products = await productsQuery
            .limit(limitNum)
            .skip(skip);

        res.status(200).json({ products, page: pageNum, pages: Math.ceil(count / limitNum), total: count });
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
        const { name, description, price, userEmail, stock, category } = req.body;
        let imageUrls = req.files.map(file => path.join('uploads', file.filename));

        if (imageUrls.length === 0) {
            const existingProduct = await Product.findById(id);
            imageUrls = existingProduct.imageUrl;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, userEmail, imageUrl: imageUrls, stock, category },
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

const deletedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Remove the product from all users' carts
        await User.updateMany(
            { "cart.productId": id },
            { $pull: { cart: { productId: id } } }
        );

        res.status(200).json({ message: 'Product deleted successfully', success: true });
    } catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).json({ message: "Error in deleting product", error: error.message });
    }
};

const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;
        const user = req.user; // from protect middleware

        // Check if the user has purchased this product
        const order = await Order.findOne({
            user: user._id,
            "products.productId": productId,
            status: { $ne: 'Canceled' } // Make sure the order isn't canceled
        });

        if (!order) {
            return res.status(400).json({ message: 'You must purchase this product before reviewing it.' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if already reviewed by user
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed by you' });
        }

        const review = {
            name: user.name,
            rating: Number(rating),
            comment,
            user: user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        // Calculate new average rating
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added successfully', success: true });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};

module.exports = { createProduct, getAllProducts, getProductsByUserEmail, editProduct, getProductById, deletedProduct, createProductReview };