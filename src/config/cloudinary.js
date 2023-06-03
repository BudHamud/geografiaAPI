import cloudinary from 'cloudinary';
import config from './config.js';

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudKey,
  api_secret: config.cloudSecret
});