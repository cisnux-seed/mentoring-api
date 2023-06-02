const { Schema, model } = require('mongoose');

const mentorSchema = new Schema({
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
mentorSchema.index({ 'expertises.learningPath': 'text', 'expertises.experienceLevel': 'text', 'expertises.skills': 'text' });

const Mentor = model('Mentor', mentorSchema);

module.exports = Mentor;
