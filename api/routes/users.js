const express = require('express');
const bcrypyjs = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

router.post('/register', (req,res) => {
  User.find({ email: req.body.email })
    .then(user => {
      if(user.length >= 1) {
        return res.status(409).json({
          message: 'Email Exists'
        });
      } else {
        const user = new User({
          email: req.body.email,
          password: req.body.password,
        });

        User.createUser(user, (err, user) => {
          if(err) {
            res.status(500).json({ error: err });
          } else {
            res.status(200).json({
              message: 'User Created',
              user: {
                _id: user._id,
                email: user.email,
                password: user.password,
              },
              request: {
                type: 'GET',
                url: `http://localhost:3000/products/${user._id}`
              }
            });
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.post('/login', (req,res) => {

});

router.delete('/:id', (req,res) => {
  User.remove({ _id: req.params.id })
    .then(result => {
      res.status(200).json({
        message: 'User Deleted'
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
