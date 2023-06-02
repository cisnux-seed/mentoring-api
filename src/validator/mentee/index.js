const InvariantError = require('../../exceptions/InvariantError');
const {
  PostMentee, ImageHeaderSchema,
} = require('./schema');

const MenteeValidator = {
  validatePostMenteeBodyPayload: (payload) => {
    const validationBodyResult = PostMentee.validate(payload);
    if (validationBodyResult.error) {
      throw new InvariantError(validationBodyResult.error.message, 'fail');
    }
  },
  validatePostMenteeHeaderPayload: (payload) => {
    const validationHeaderResult = ImageHeaderSchema.validate(payload);
    if (validationHeaderResult.error) {
      throw new InvariantError(validationHeaderResult.error.message, 'fail');
    }
  },
};

module.exports = MenteeValidator;
