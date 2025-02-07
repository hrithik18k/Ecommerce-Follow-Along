const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductsByUserEmail } = require('../controllers/productControllers');
const { upload } = require('../middlewares/multer');

router.post('/addProducts', upload.array('images'), createProduct);
router.get('/products', getAllProducts);
router.get('/products/user/:email', getProductsByUserEmail);

module.exports = router;