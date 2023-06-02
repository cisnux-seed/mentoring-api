class ReviewHandler {
  #menteeService;

  #reviewService;

  #validator;

  constructor(reviewService, menteeService, validator) {
    this.#menteeService = menteeService;
    this.#reviewService = reviewService;
    this.#validator = validator;

    this.postReviewHandler = this.postReviewHandler.bind(this);
    this.getReviewsByIdHandler = this.getReviewsByIdHandler.bind(this);
  }

  async postReviewHandler(request, h) {
    const {
      mentorId, comment, rating,
    } = request.payload;
    const { id: menteeId } = request.params;
    this.#validator.validatePostReviewPayload({
      mentorId, comment, rating,
    });
    const userId = await this.#reviewService.addReview({
      menteeId,
      mentorId,
      comment,
      rating,
    });
    const response = h.response({
      status: 'success',
      message: 'review successfully added',
      data: {
        id: userId,
      },
    });
    response.code(201);
    return response;
  }

  async getReviewsByIdHandler(request, h) {
    const { id } = request.params;
    const reviews = await this.#reviewService.getReviewsById({
      mentorId: id,
    });
    const menteeReviews = await Promise.all(reviews.map(async (review) => {
      const mentee = await this.#menteeService.getMenteeProfileAsReviewer({
        id: review.menteeId,
      });
      return {
        ...mentee,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt,
      };
    }));
    const response = h.response({
      status: 'success',
      data: {
        reviews: menteeReviews,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ReviewHandler;
