const { Schema, model } = require('mongoose');

const menteeSchema = new Schema({
  id: { type: String, required: true, index: { unique: true } },
  fullName: { type: String, required: true },
  photoProfile: { type: String },
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true },
  job: { type: String, required: true },
  about: { type: String, required: true },
});
menteeSchema.index({ job: 'text' });

const Mentee = model('Mentee', menteeSchema);

module.exports = Mentee;
