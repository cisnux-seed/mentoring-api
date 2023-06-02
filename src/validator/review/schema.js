const joi = require('joi');

const PostReview = joi.object({
  mentorId: joi.string().required(),
  comment: joi.string().required(),
  rating: joi.number().required(),
});

module.exports = {
  PostReview,
};
