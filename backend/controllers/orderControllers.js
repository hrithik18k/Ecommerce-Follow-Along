const Order = require('../models/order');
const Product = require('../models/productModels');
const User = require('../models/userModel');

const placeOrder = async (req, res) => {
    try {
        const { products, address, totalPrice } = req.body;
        const user = req.user;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const newOrder = new Order({
            user: user._id,
            products,
            address,
            totalPrice
        });

        const createdOrder = await newOrder.save();

        // Clear the user's cart
        await User.findByIdAndUpdate(user._id, { cart: [] });

        res.status(201).json({ message: 'Order placed successfully', order: createdOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('products.productId');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getSellerOrders = async (req, res) => {
    try {
        // Fetch products owned by the seller
        const sellerProducts = await Product.find({ userEmail: req.user.email }).select('_id');
        const sellerProductIds = sellerProducts.map(p => p._id);

        // Find orders containing seller's products
        const orders = await Order.find({ "products.productId": { $in: sellerProductIds } })
            .populate('user', 'name email')
            .populate('products.productId');

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { placeOrder, getUserOrders, getSellerOrders, updateOrderStatus };
