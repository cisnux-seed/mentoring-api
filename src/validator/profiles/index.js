const InvariantError = require('../../exceptions/InvariantError');
const {
  PostMenteeProfile, ImageHeaderSchema, PostMentorProfile, Expertise,
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
  validatePostMentorProfilePayload: (payload) => {
    const validationBodyResult = PostMentorProfile.validate(payload);
    if (validationBodyResult.error) {
      throw new InvariantError(validationBodyResult.error.message, 'fail');
    }
  },
  validateExpertisePayload: (payload) => {
    const validationResult = Expertise.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, 'fail');
    }
  },
};

module.exports = ProfileValidator;
