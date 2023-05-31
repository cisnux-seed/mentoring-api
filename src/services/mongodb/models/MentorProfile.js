const { Schema, model } = require('mongoose');

const mentorProfileSchema = new Schema({
  id: { type: String, required: true, index: { unique: true } },
  expertises: [
    {
      learningPath: { type: String, required: true },
      experienceLevel: { type: String, required: true },
      skills: { type: Array, required: true },
      certificates: { type: Array, required: true },
    },
  ],
});
mentorProfileSchema.index({ 'expertises.learningPath': 'text', 'expertises.experienceLevel': 'text', 'expertises.skills': 'text' });

const MentorProfile = model('MentorProfile', mentorProfileSchema);

module.exports = MentorProfile;
