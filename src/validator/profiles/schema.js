const joi = require('joi');

const ImageHeaderSchema = joi.object({
  'content-type': joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpg', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

const FileHeaderSchema = joi.object({
  'content-type': joi.string().valid('application/pdf').required(),
}).unknown();

const PostMenteeProfile = joi.object({
  fullName: joi.string().required(),
  username: joi.string().required(),
  email: joi.string().email({ tlds: true }).required(),
  job: joi.string().required(),
  experienceLevel: joi.string().required(),
  interests: joi.string().required(),
  about: joi.string().required().max(80),
});

const PostMentorProfile = joi.object({
  certificate: joi.required(),
  skills: joi.string().required(),
});

module.exports = {
  PostMenteeProfile, ImageHeaderSchema, PostMentorProfile, FileHeaderSchema,
};
