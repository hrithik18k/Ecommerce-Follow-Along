const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductsByUserEmail, getProductById, editProduct, deletedProduct } = require('../controllers/productControllers');
const { upload } = require('../middlewares/multer');

router.post('/addProducts', upload.array('images'), createProduct);
router.get('/', getAllProducts);
router.get('/user/:email', getProductsByUserEmail);
router.get('/:id', getProductById);
router.put('/:id', upload.array('images'), editProduct);
router.put('/edit/:id', editProduct);
router.delete('/:id', deletedProduct);

module.exports = router;