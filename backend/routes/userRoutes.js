const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, addAddress, deleteAddress, getAllUsers, updateUserRole, toggleWishlist, getWishlist, getAdminStats } = require('../controllers/userControllers');
const { addToCart, getCartItems, updateCartItemQuantity, deleteCartItem } = require('../controllers/cartControllers');
const { upload } = require('../middlewares/multer');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);
router.get('/profile/:email', getUserProfile);
router.put('/profile/:email', upload.single('profilePicture'), updateUserProfile);
router.post('/cart', protect, addToCart);
router.get('/cart/:email', protect, getCartItems);
router.post('/cart/quantity', protect, updateCartItemQuantity);
router.delete('/cart/:email/:productId', protect, deleteCartItem);
router.put('/profile/:email/address', addAddress);
router.delete('/profile/:email/address', deleteAddress);

// Admin routes
router.get('/all', protect, adminOnly, getAllUsers);
router.put('/role', protect, adminOnly, updateUserRole);
router.get('/stats', protect, adminOnly, getAdminStats);

// Wishlist routes
router.get('/wishlist/:email', getWishlist);
router.post('/wishlist/:email', toggleWishlist);

module.exports = router;