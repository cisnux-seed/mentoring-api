const joi = require('joi');

const ImageHeaderSchema = joi.object({
  'content-type': joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpg', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

const PostMentee = joi.object({
  fullName: joi.string().required(),
  username: joi.string().required(),
  email: joi.string().email({ tlds: true }).required(),
  job: joi.string().required(),
  about: joi.string().required().max(161),
});

module.exports = {
  PostMentee, ImageHeaderSchema,
};
