const { Schema, model } = require('mongoose');

const menteeProfileSchema = new Schema({
  id: { type: String, required: true, index: { unique: true } },
  fullName: { type: String, required: true },
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true },
  job: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  interests: { type: Array, required: true },
  about: { type: String, required: true },
});

const MenteeProfile = model('MenteeProfile', menteeProfileSchema);

module.exports = MenteeProfile;
