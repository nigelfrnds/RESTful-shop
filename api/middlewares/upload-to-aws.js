const AWS = require('aws-sdk');
const S3 = AWS.S3;
//URL for the bucket server
const BUCKET_URL = 'https://s3.ca-central-1.amazonaws.com/restfulshopbucket1/';

//AWS config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});


module.exports = (req,res,next) => {
  var s3 = new S3();
  const filename = `${Date.now()}${req.file.originalname}`;

  const params = {
    Bucket: 'restfulshopbucket1',
    Key: filename,
    Body: req.file.buffer
  };

  s3.putObject(params, (err, data) => {
    if(err) {
      return res.status(500).json({ error: err });
    } else {
      req.fileUrl = `${BUCKET_URL}${filename}`;
      next();
    }
  });
};
