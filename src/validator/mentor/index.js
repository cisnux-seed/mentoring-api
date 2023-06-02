const InvariantError = require('../../exceptions/InvariantError');
const {
  PostMentor, Expertise,
} = require('./schema');

const MenteeValidator = {
  validatePostMentorPayload: (payload) => {
    const validationBodyResult = PostMentor.validate(payload);
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

module.exports = MenteeValidator;
