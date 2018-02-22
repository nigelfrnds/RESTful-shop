const multer = require('multer');

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

 module.exports = upload;
