const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/productControllers');

router.post('/addProducts', createProduct);

module.exports = router;