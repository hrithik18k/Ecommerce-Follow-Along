const Coupon = require('../models/couponModel');

const createCoupon = async (req, res) => {
    try {
        const { code, discountPercent, maxUses, expiresAt } = req.body;

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: 'Coupon already exists' });
        }

        const coupon = new Coupon({
            code,
            discountPercent,
            maxUses,
            expiresAt
        });

        const createdCoupon = await coupon.save();
        res.status(201).json({ message: 'Coupon created successfully', coupon: createdCoupon });
    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ message: 'This coupon is no longer active' });
        }

        if (coupon.usedCount >= coupon.maxUses) {
            return res.status(400).json({ message: 'This coupon has reached its usage limit' });
        }

        if (new Date() > new Date(coupon.expiresAt)) {
            return res.status(400).json({ message: 'This coupon has expired' });
        }

        res.status(200).json({
            message: 'Coupon applied successfully',
            discountPercent: coupon.discountPercent,
            code: coupon.code
        });
    } catch (error) {
        console.error('Error applying coupon:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const toggleCouponStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.status(200).json({ message: 'Coupon status updated', coupon });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createCoupon, getAllCoupons, applyCoupon, toggleCouponStatus };
