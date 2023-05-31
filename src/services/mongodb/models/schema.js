const joi = require('joi');

const ImageHeaderSchema = joi.object({
  'content-type': joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpg', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

const PostMenteeProfile = joi.object({
  fullName: joi.string().required(),
  username: joi.string().required(),
  email: joi.string().email({ tlds: true }).required(),
  job: joi.string().required(),
  about: joi.string().required().max(161),
});

const PostMentorProfile = joi.object({
  expertises: joi.array().required(),
});

const Expertise = joi.string({
  learningPath: joi.string().required(),
  experienceLevel: joi.string.required(),
  skills: joi.array().required(),
  certificates: joi.array().required(),
});

module.exports = {
  PostMenteeProfile, ImageHeaderSchema, PostMentorProfile, Expertise,
};
