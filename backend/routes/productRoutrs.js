const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductsByUserEmail, getProductById, editProduct, deletedProduct } = require('../controllers/productControllers');
const { upload } = require('../middlewares/multer');

router.post('/products', upload.array('images', 10), createProduct); // Apply upload middleware
router.get('/products', getAllProducts);
router.get('/products/user/:email', getProductsByUserEmail);
router.get('/products/:id', getProductById);
router.put('/products/:id', upload.array('images', 10), editProduct); // Apply upload middleware
router.delete('/products/:id', deletedProduct);

module.exports = router;