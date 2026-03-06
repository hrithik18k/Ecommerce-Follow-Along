const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order');

const createOrder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: req.body.amount, // amount in the smallest currency unit
            currency: "INR",
            receipt: crypto.randomBytes(10).toString('hex'),
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("Some error occured");

        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating order', error);
        res.status(500).send(error);
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error('Error verifying signature', error);
        res.status(500).send(error);
    }
};

module.exports = { createOrder, verifyPayment };
