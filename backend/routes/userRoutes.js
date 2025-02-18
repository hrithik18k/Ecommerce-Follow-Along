const express = require('express');
const { registerUser, loginUser } = require('../controllers/userControllers');
const { addToCart, getCartItems, updateCartItemQuantity, deleteCartItem } = require('../controllers/cartControllers');
const { upload } = require('../middlewares/multer');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/cart', addToCart);
router.get('/cart/:email', getCartItems);
router.post('/cart/quantity', updateCartItemQuantity);
router.delete('/cart/:email/:productId', deleteCartItem); 

module.exports = router;