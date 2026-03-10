const express = require('express');
const { placeOrder, getUserOrders, getSellerOrders, updateOrderStatus, getSellerStats } = require('../controllers/orderControllers');
const { protect, sellerOrAdmin } = require('../middlewares/authMiddleware');
const Order = require('../models/order');
const Notification = require('../models/notificationModel');
const { createOrder, verifyPayment } = require('../controllers/razorpayController');

const router = express.Router();

router.post('/place-order', protect, placeOrder);
router.get('/user-orders', protect, getUserOrders);
router.get('/seller-orders', protect, sellerOrAdmin, getSellerOrders);
router.get('/seller-stats', protect, sellerOrAdmin, getSellerStats);
router.patch('/:orderId/status', protect, sellerOrAdmin, updateOrderStatus);
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.patch('/:orderId/cancel', protect, async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('Order cancellation request received for order ID:', orderId); // Add logging

        const order = await Order.findById(orderId);

        if (!order) {
            console.log('Order not found for order ID:', orderId);
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'Canceled') {
            order.status = 'Canceled';
            order.statusHistory.push({ status: 'Canceled', timestamp: Date.now() });

            // Create notification
            await Notification.create({
                user: order.user,
                title: 'Order Canceled',
                message: `You have successfully canceled order #${order._id.toString().slice(-8).toUpperCase()}.`,
                link: '/my-orders'
            });
        }
        await order.save();
        res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;