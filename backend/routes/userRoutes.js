const express = require('express');
const { registerUser, loginUser } = require('../controllers/userControllers');
const { addToCart,getCartItems } = require('../controllers/cartControllers');
const { upload } = require('../middlewares/multer');

const router = express.Router();

router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);
router.post('/cart', addToCart);
router.get('/cart/:email', getCartItems);

module.exports = router;