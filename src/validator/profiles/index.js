const InvariantError = require('../../exceptions/InvariantError');
const {
  PostMenteeProfile, ImageHeaderSchema, FileHeaderSchema, PostMentorProfile,
} = require('./schema');

const ProfileValidator = {
  validatePostMenteeProfileBodyPayload: (payload) => {
    const validationBodyResult = PostMenteeProfile.validate(payload);
    if (validationBodyResult.error) {
      throw new InvariantError(validationBodyResult.error.message, 'fail');
    }
  },
  validatePostMenteeProfileHeaderPayload: (payload) => {
    const validationHeaderResult = ImageHeaderSchema.validate(payload);
    if (validationHeaderResult.error) {
      throw new InvariantError(validationHeaderResult.error.message, 'fail');
    }
  },
  validatePostMentorProfileBodyPayload: (payload) => {
    const validationBodyResult = PostMentorProfile.validate(payload);
    if (validationBodyResult.error) {
      throw new InvariantError(validationBodyResult.error.message, 'fail');
    }
  },
  validatePostMentorProfileHeaderPayload: (payload) => {
    const validationHeaderResult = FileHeaderSchema.validate(payload);
    if (validationHeaderResult.error) {
      throw new InvariantError(validationHeaderResult.error.message, 'fail');
    }
  },
};

module.exports = ProfileValidator;
