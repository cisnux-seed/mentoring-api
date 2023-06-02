const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
  menteeId: { type: String, required: true },
  mentorId: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = model('Review', reviewSchema);

module.exports = Review;
