const { Schema, model } = require('mongoose');

const mentorProfileSchema = new Schema({
  id: { type: String, required: true, index: { unique: true } },
  skills: { type: Array, required: true },
  learningPaths: { type: Array, required: true, index: true },
  certificateUrl: { type: String, required: true },
  isMentor: { type: Boolean, required: true },
});

const MentorProfile = model('MentorProfile', mentorProfileSchema);

module.exports = MentorProfile;
