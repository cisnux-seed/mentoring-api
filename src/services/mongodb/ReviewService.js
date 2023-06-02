const mongoose = require('mongoose');
const InvariantError = require('../../exceptions/InvariantError');
const Review = require('./models/Review');

class ReviewService {
  #review;

  constructor() {
    this.#review = Review;
    this.#connectDb();
  }

  async #connectDb() {
    try {
      await mongoose.connect(
        `${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE_NAME}`,
        {
          autoIndex: true,
          autoCreate: true,
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addReview(payload) {
    const review = await this.#review
      .collection
      .insertOne(payload)
      .catch((err) => {
        console.error(err);
      });

    if (!review.insertedId) {
      throw new InvariantError('failed to add review');
    }
    return review.insertedId;
  }

  async getReviewsById(payload) {
    const { mentorId } = payload;
    const reviewCursor = await this.#review
      .collection
      .find({ mentorId });

    const reviews = await reviewCursor.toArray().catch((err) => {
      console.error(err);
    });
    return reviews;
  }

  async getReviewsRatingById(payload) {
    const { mentorId } = payload;
    const reviewCursor = await this.#review.collection.aggregate([
      {
        $group: {
          _id: '$mentorId',
          totalRating: { $sum: '$rating' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          mentorId: '$_id',
          averageRating: { $divide: ['$totalRating', '$count'] },
        },
      },
      {
        $match: {
          mentorId,
        },
      },
    ]);

    const reviews = await reviewCursor.toArray().catch((err) => {
      console.error(err);
    });

    if (!reviews.length) {
      return 0.0;
    }

    return reviews.map((review) => review.averageRating)[0];
  }
}

module.exports = ReviewService;
