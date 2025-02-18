const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userControllers');
const { addToCart, getCartItems, updateCartItemQuantity, deleteCartItem } = require('../controllers/cartControllers'); // Import cart controllers
const { upload } = require('../middlewares/multer');

const router = express.Router();

router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);
router.get('/profile/:email', getUserProfile);
router.put('/profile/:email', upload.single('profilePicture'), updateUserProfile); // Apply upload middleware
router.post('/cart', addToCart); // Add to cart route
router.get('/cart/:email', getCartItems); // Get cart items route
router.post('/cart/quantity', updateCartItemQuantity); // Update cart item quantity route
router.delete('/cart/:email/:productId', deleteCartItem); // Delete cart item route

module.exports = router;