const express = require('express');
const orderController = require('../controllers/order.controller');
const Authenticate_controller = require('../middleware/token-validation');
const router = express.Router();

router.post('/create', Authenticate_controller.authenticateToken(), orderController.createOrder);
router.put('/update/:id', Authenticate_controller.authenticateToken(), orderController.updateOrder);
router.put('/cancel/:id', Authenticate_controller.authenticateToken(), orderController.cancelOrder);
router.get('/getorders_customer', Authenticate_controller.authenticateToken(), orderController.getOrdersbyCustomer)
router.get('/getorderscount_date', Authenticate_controller.authenticateToken(), orderController.getOrdersCountsbyDate)
router.get('/getcustomer_product', Authenticate_controller.authenticateToken(), orderController.getCustomersbasedonCount)
router.get('/getcustomer_givenproduct', Authenticate_controller.authenticateToken(), orderController.getCustomersbasedonGivenCount)

module.exports = router;
