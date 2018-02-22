const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'SECRET_KEY');
    req.userData = decodedToken;
    next();
  } catch(err) {
    return res.status(401).json({ message: 'Auth failed' });
  }
};
