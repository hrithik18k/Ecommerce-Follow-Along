const express = require('express');
const { placeOrder, getUserOrders } = require('../controllers/orderControllers');
const { protect } = require('../middlewares/authMiddleware');
const Order = require('../models/order'); // Ensure the Order model is imported

const router = express.Router();

router.post('/place-order', protect, placeOrder);
router.get('/user-orders', protect, getUserOrders);
router.patch('/:orderId/cancel', protect, async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('Order cancellation request received for order ID:', orderId); // Add logging

        const order = await Order.findById(orderId);

        if (!order) {
            console.log('Order not found for order ID:', orderId); // Add logging
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = 'Canceled';
        await order.save();
        res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;