const express = require('express');
const multer = require('multer');
const upload = multer();

const checkAuth = require('../middlewares/check-auth');
const uploadFile = require('../middlewares/upload-file');
const uploadToAWS = require('../middlewares/upload-to-aws');
const ProductController = require('../controllers/ProductController');

const router = express.Router();

router.get('/', ProductController.fetchAll);

router.post('/',checkAuth, upload.single('productImage'), uploadToAWS, ProductController.createProduct);

router.get('/:id', ProductController.fetchOne);

router.patch('/:id', checkAuth, ProductController.updateProduct);

router.delete('/:id', checkAuth, ProductController.deleteProduct);

module.exports = router;
