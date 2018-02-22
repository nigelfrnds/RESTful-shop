const express = require('express');

const Order = require('../models/order');
const Product = require('../models/product');
const router = express.Router();

router.get('/', (req,res) => {
  Order.find()
    .select('_id product quantity')
    .populate('product', 'name')
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${doc._id}`
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.post('/', (req,res) => {
  Product.findById(req.body.productId)
    .then(product => {
      if(!product) {
        return res.status(404).json({
          message: 'Product Not Found!'
        });
      }
      const order = new Order({
        product: req.body.productId,
        quantity: req.body.quantity
      });

      return order.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Order Stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${result._id}`
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.get('/:id', (req,res) => {
  const { id } = req.params;
  Order.findById(id)
    .select('_id product quantity')
    .populate('product', '_id name price')
    .then(order => {
      if(!order) {
        return res.status(404).json({
          message: 'Order Not Found',
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders`
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.delete('/:id', (req,res) => {
  const { id } = req.params;
  Order.remove({ _id: id })
    .then(result => {
      res.status(200).json({
        message: 'Order Deleted',
        request: {
          type: 'POST',
          url: `http://localhost:3000/orders`,
          body: { productId: "String", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
