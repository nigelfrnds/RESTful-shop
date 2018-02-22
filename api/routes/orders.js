const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const OrderController = require('../controllers/OrderController');

const router = express.Router();

router.get('/', checkAuth, OrderController.fetchAll);

router.post('/', checkAuth, OrderController.createOrder);

router.get('/:id', checkAuth, OrderController.fetchOne);

router.delete('/:id', checkAuth, OrderController.deleteOrder);

module.exports = router;
