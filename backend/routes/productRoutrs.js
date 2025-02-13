const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductsByUserEmail, getProductById,editProduct  } = require('../controllers/productControllers');
const { upload } = require('../middlewares/multer');

router.post('/addProducts', upload.array('images'), createProduct);
router.get('/products', getAllProducts);
router.get('/products/user/:email', getProductsByUserEmail);
router.get('/products/:id', getProductById);
router.put('/products/:id', upload.array('images'), editProduct); 
router.put('/edit/:id', editProduct);

module.exports = router;