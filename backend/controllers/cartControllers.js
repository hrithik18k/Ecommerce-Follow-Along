const User = require('../models/userModel');
const Product = require('../models/productModels');

const addToCart = async (req, res) => {
    const { email, productId, quantity } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        const totalQuantity = cartItem ? cartItem.quantity + quantity : quantity;

        if (totalQuantity > product.stock) {
            return res.status(400).json({ message: 'Quantity exceeds available stock' });
        }

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }

        await user.save();
        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCartItems = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email }).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateCartItemQuantity = async (req, res) => {
    const { email, productId, action } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        if (action === 'increase') {
            cartItem.quantity += 1;
        } else if (action === 'decrease') {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                return res.status(400).json({ message: 'Quantity cannot be less than 1' });
            }
        }

        await user.save();
        await user.populate('cart.productId');
        res.status(200).json({ message: 'Cart item quantity updated', cart: user.cart });
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteCartItem = async (req, res) => {
    const { email, productId } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        await user.save();
        await user.populate('cart.productId');
        res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { addToCart, getCartItems, updateCartItemQuantity, deleteCartItem };