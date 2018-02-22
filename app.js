const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_CONFIG);
var db = mongoose.connection
  .once('open', () => console.log('Connected to MongoDB'))
  .on('error', (error) => console.warn('Warning: ', error));

// Logging Middleware
app.use(morgan('dev'));

// body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handling CORS errors
app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*');  // gives access control to any origin
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Catch-All Routes & Error Handling
app.use((req,res,next) => {
  var error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error,req,res,next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
