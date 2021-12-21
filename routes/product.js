const express = require('express');
const productController = require('../controllers/products.controller');
const Authenticate_controller = require('../middleware/token-validation');
const fileUpload = require('../middleware/upload');
const router = express.Router();

router.post('/create', Authenticate_controller.authenticateToken(), fileUpload.single("file"), productController.saveProducts);

module.exports = router;
