const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const uploadFile = require('../middlewares/upload-file');
const ProductController = require('../controllers/ProductController');

const router = express.Router();

router.get('/', ProductController.fetchAll);

router.post('/',checkAuth, uploadFile.single('productImage'), ProductController.createProduct);

router.get('/:id', ProductController.fetchOne);

router.patch('/:id', checkAuth, ProductController.updateProduct);

router.delete('/:id', checkAuth, ProductController.deleteProduct);

module.exports = router;
