const joi = require('joi');

const ImageHeaderSchema = joi.object({
  'content-type': joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpg', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

const PostProfileScheme = joi.object({
  fullName: joi.string().required(),
  username: joi.string().required(),
  email: joi.string().email({ tlds: true }).required(),
  job: joi.string().required(),
  experienceLevel: joi.string().required(),
  interests: joi.string().required(),
  motto: joi.string(),
});

module.exports = { PostProfileScheme, ImageHeaderSchema };
