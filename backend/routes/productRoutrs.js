const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductsByUserEmail, getProductById, editProduct, deletedProduct, createProductReview } = require('../controllers/productControllers');
const { upload } = require('../middlewares/multer');
const { protect } = require('../middlewares/authMiddleware');

router.post('/products', upload.array('images', 10), createProduct); // Apply upload middleware
router.get('/products', getAllProducts);
router.get('/products/user/:email', getProductsByUserEmail);
router.get('/products/:id', getProductById);
router.put('/products/:id', upload.array('images', 10), editProduct); // Apply upload middleware
router.delete('/products/:id', deletedProduct);
router.post('/products/:id/reviews', protect, createProductReview);

module.exports = router;