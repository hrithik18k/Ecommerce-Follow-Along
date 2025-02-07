const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts } = require('../controllers/productControllers');

router.post('/addProducts', createProduct);
router.get("/products", getAllProducts);
module.exports = router;