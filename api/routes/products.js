const express = require('express');
const multer = require('multer');
const Product = require('../models/product');

const router = express.Router();
//Uploads images here
const storage = multer.diskStorage({
  destination: function(req,file,callback) {
    callback(null,'./uploads/');
  },
  filename: function(req,file,callback) {
    callback(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req,file,callback) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // accept file
    callback(null,true);
  } else {
    // reject a file
    callback(null,false);
  }
};
const upload = multer({
   storage: storage,
   limits: { fileSize: 1024*1024*5 },
   fileFilter: fileFilter
 });

router.get('/', (req,res) => {
  Product.find({})
    .select('_id name price productImage')
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: `http://localhost:3000/products/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.post('/', upload.single('productImage'), (req,res) => {
  console.log(req.file);
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path.replace(/\\/,'/')
  });

  product.save()
    .then((result) => {
      res.status(200).json({
        message: 'Created Product',
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`
          }
        },
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:id', (req,res) => {
  const { id } = req.params;
  Product.findById(id)
    .select('_id name price productImage')
    .then((result) => {
      if(result) {
        res.status(200).json({
          product: result,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products`
          }
        });
      } else {
        res.status(404).json({ message: 'No valid entry for ID' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });

});

router.patch('/:id', (req,res) => {
  const { id } = req.params;
  const updateOps = {};
  for(const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({ _id: id }, { $set: updateOps })
    .then(result => {
      res.status(200).json({
        message: 'Product Updated',
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${id}`
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.delete('/:id', (req,res) => {
  const { id } = req.params;

  Product.remove({ _id: id })
    .then((result) => {
      res.status(200).json({
        message: 'Product Deleted',
        request: {
          type: 'POST',
          url: `http://localhost:3000/products`,
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
