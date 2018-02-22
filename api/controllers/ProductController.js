const Product = require('../models/product');

exports.fetchAll = (req,res) => {
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
};

exports.createProduct = (req,res) => {
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
};

exports.fetchOne = (req,res) => {
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

};

exports.updateProduct = (req,res) => {
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
};

exports.deleteProduct = (req,res) => {
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
};
