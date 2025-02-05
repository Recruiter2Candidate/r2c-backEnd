const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");


const avatarStorage = new CloudinaryStorage({
  filename: (req,file,cb)=>{
    cb(null , Date.now() + path.extname(file.originalname))
  }
});




const avatar = multer({storage: avatarStorage})

module.exports = {
  
  avatar,
  
};
