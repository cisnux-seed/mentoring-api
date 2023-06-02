const joi = require('joi');

const PostMentor = joi.object({
  expertises: joi.array().required(),
});

const Expertise = joi.object({
  learningPath: joi.string().required(),
  experienceLevel: joi.string().required(),
  skills: joi.array().required(),
  certificates: joi.array().required(),
});

module.exports = {
  PostMentor, Expertise,
};
