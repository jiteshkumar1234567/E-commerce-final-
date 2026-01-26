const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'dr7whwiih',
  api_key: process.env.CLOUD_API_KEY || '269978581352322',
  api_secret: process.env.CLOUD_API_SECRET || 'px1bgsJiGnCx0BUQ4-fPyeLczcI',
  secure: true,
});

// Multer storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
