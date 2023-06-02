const InvariantError = require('../../exceptions/InvariantError');
const {
  PostReview,
} = require('./schema');

const ReviewValidator = {
  validatePostReviewPayload: (payload) => {
    const validationBodyResult = PostReview.validate(payload);
    if (validationBodyResult.error) {
      throw new InvariantError(validationBodyResult.error.message, 'fail');
    }
  },
};

module.exports = ReviewValidator;
