const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.register = (req,res) => {
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
};

exports.login = (req,res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if(user.length < 1) {
        return res.status(401).json({ message: 'Auth failed' });
      }

      User.comparePassword(req.body.password,user.password, (err, isMatch) => {
        if(err) {
          return res.status(401).json({ message: 'Auth failed' });
        }
        if(isMatch) {
          const token = jwt.sign(
            {
              email: user.email,
              _id: user._id,
            },
            'SECRET_KEY',
            { expiresIn: "1h" }
          );
          return res.status(200).json({ message: 'Auth successful', token: token });
        }

        res.status(401).json({ message: 'Auth Failed' });
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.deleteUser = (req,res) => {
  User.remove({ _id: req.params.id })
    .then(result => {
      res.status(200).json({
        message: 'User Deleted'
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
