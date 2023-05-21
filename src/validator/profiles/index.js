const InvariantError = require('../../exceptions/InvariantError');
const { PostProfileScheme, ImageHeaderSchema } = require('./schema');

const ProfileValidator = {
  validatePostProfileBodyPayload: (payload) => {
    const validationBodyResult = PostProfileScheme.validate(payload);
    if (validationBodyResult.error) {
      throw new InvariantError(validationBodyResult.error.message, 'fail');
    }
  },
  validatePostProfileHeaderPayload: (payload) => {
    const validationHeaderResult = ImageHeaderSchema.validate(payload);
    if (validationHeaderResult.error) {
      throw new InvariantError(validationHeaderResult.error.message, 'fail');
    }
  },
};

module.exports = ProfileValidator;
