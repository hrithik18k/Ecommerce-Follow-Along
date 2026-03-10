const Order = require('../models/order');
const Product = require('../models/productModels');
const User = require('../models/userModel');
const Coupon = require('../models/couponModel');
const Notification = require('../models/notificationModel');

const placeOrder = async (req, res) => {
    try {
        const { products, address, totalPrice, couponCode, discountAmount } = req.body;
        const user = req.user;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const newOrder = new Order({
            user: user._id,
            products,
            address,
            totalPrice,
            couponCode,
            discountAmount,
            statusHistory: [{ status: 'Pending', timestamp: Date.now() }]
        });

        const createdOrder = await newOrder.save();

        // If coupon exists, increment usedCount
        if (couponCode) {
            await Coupon.findOneAndUpdate(
                { code: couponCode.toUpperCase() },
                { $inc: { usedCount: 1 } }
            );
        }

        // After saving the order, update stock
        for (const item of products) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

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

        if (order.status !== status) {
            order.status = status;
            order.statusHistory.push({ status, timestamp: Date.now() });

            // Create notification
            await Notification.create({
                user: order.user,
                title: 'Order Status Update',
                message: `Your order #${order._id.toString().slice(-8).toUpperCase()} is now ${status}.`,
                link: '/my-orders'
            });
        }

        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getSellerStats = async (req, res) => {
    try {
        const userEmail = req.user.email;

        // Find products belonging to seller
        const sellerProducts = await Product.find({ userEmail });
        const sellerProductIds = sellerProducts.map(p => p._id);

        if (sellerProductIds.length === 0) {
            return res.status(200).json({
                totalRevenue: 0,
                totalOrders: 0,
                totalProducts: 0,
                averageRating: 0,
                topProducts: [],
                recentOrders: []
            });
        }

        const matchingOrders = await Order.find({
            "products.productId": { $in: sellerProductIds }
        }).populate('products.productId').sort({ createdAt: -1 });

        let totalRevenue = 0;
        let totalOrders = matchingOrders.length;
        let productSales = {};
        let recentOrders = matchingOrders.slice(0, 5);

        matchingOrders.forEach(order => {
            order.products.forEach(item => {
                if (item.productId && sellerProductIds.some(id => id.toString() === item.productId._id.toString())) {
                    if (order.status === 'Delivered') {
                        totalRevenue += item.quantity * item.productId.price;
                    }
                    if (!productSales[item.productId._id]) {
                        productSales[item.productId._id] = { product: item.productId, count: 0 };
                    }
                    productSales[item.productId._id].count += item.quantity;
                }
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        let totalRating = 0;
        let ratedProductsCount = 0;
        sellerProducts.forEach(p => {
            if (p.rating > 0) {
                totalRating += p.rating;
                ratedProductsCount++;
            }
        });
        const averageRating = ratedProductsCount > 0 ? (totalRating / ratedProductsCount).toFixed(1) : 0;

        res.status(200).json({
            totalRevenue,
            totalOrders,
            totalProducts: sellerProducts.length,
            averageRating: Number(averageRating),
            topProducts,
            recentOrders
        });
    } catch (error) {
        console.error('Error fetching seller stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { placeOrder, getUserOrders, getSellerOrders, updateOrderStatus, getSellerStats };
