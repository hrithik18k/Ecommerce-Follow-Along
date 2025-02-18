const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { protect } = require('../middlewares/authMiddleware'); // Correct middleware import

// Create a new order
router.post('/', protect, async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            status: 'Pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

// Update order to delivered
router.put('/:id/deliver', protect, async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.deliveredAt = Date.now();
        order.status = 'Delivered';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

module.exports = router;