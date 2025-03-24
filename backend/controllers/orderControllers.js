const Order = require('../models/order');
const User = require('../models/userModel');

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
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
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

module.exports = { placeOrder, getUserOrders };