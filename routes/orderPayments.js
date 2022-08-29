const express = require('express');
const router = express.Router();
const orderPaymentsHandler = require('./handler/order-payment');

router.get('/', orderPaymentsHandler.orderPayments);

module.exports = router;