const express = require('express');
const { createCoupon, getAllCoupons, applyCoupon, toggleCouponStatus } = require('../controllers/couponControllers');
const { protect, sellerOrAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/apply', protect, applyCoupon);

// Admin only routes for coupons (assuming sellerOrAdmin works here, we'll restrict to admin in frontend or could create adminOnly middleware if it exists)
// Wait, the rule says "adminOnly" middleware exists. Let me use protect and adminOnly instead of sellerOrAdmin.
const { adminOnly } = require('../middlewares/authMiddleware');

router.post('/', protect, adminOnly, createCoupon);
router.get('/', protect, adminOnly, getAllCoupons);
router.patch('/:id/toggle', protect, adminOnly, toggleCouponStatus);

module.exports = router;
