const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config(); // Load environment variables

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    const { amount, currency, receipt } = req.body;
    try {
        const order = await razorpay.orders.create({ amount, currency, receipt });
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error); // Add logging
        res.status(500).json({ message: 'Error creating Razorpay order', error });
    }
};

exports.verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    try {
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest('hex');
        if (generatedSignature === razorpay_signature) {
            res.json({ status: 'success' });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying Razorpay payment:', error); // Add logging
        res.status(500).json({ message: 'Error verifying Razorpay payment', error });
    }
};