const Order = require('../models/order');
const User = require('../models/userModel');
const Product = require('../models/productModels');

const placeOrder = async (req, res) => {
    try {
        const { products, address, totalPrice } = req.body;
        const userEmail = req.user.email;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const order = new Order({
            user: user._id,
            products,
            address,
            totalPrice
        });

        await order.save();

        // Clear the user's cart after matching the purchase
        user.cart = [];
        await user.save();

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const orders = await Order.find({ user: user._id }).populate('products.productId');
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getSellerOrders = async (req, res) => {
    try {
        const sellerEmail = req.user.email;

        // Find all products belonging to this seller
        const productsList = await Product.find({ userEmail: sellerEmail });
        const productIds = productsList.map(p => p._id);

        // Find orders containing any of these products
        const orders = await Order.find({
            'products.productId': { $in: productIds }
        }).populate('user', 'name email').populate('products.productId');

        // Filter product items in each order to only show that seller's products
        const sellerSpecificOrders = orders.map(order => {
            const ord = order.toObject();
            ord.products = ord.products.filter(p => productIds.some(id => id.equals(p.productId._id)));
            return ord;
        });

        res.status(200).json({ orders: sellerSpecificOrders });
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({ message: 'Server error', error });
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
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { placeOrder, getUserOrders, getSellerOrders, updateOrderStatus };