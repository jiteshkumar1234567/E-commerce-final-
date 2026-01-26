const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: 'dr7whwiih',
  api_key: '269978581352322',
  api_secret: 'px1bgsJiGnCx0BUQ4-fPyeLczcI',
  secure: true,
});

// Multer storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

// ✅ This is the correct Multer instance
const upload = multer({ storage: storage });

module.exports = upload;  // export the multer instance

