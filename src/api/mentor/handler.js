class MentorHandler {
  #mentorService;

  #menteeService;

  #reviewService;

  #validator;

  constructor(
    mentorService,
    menteeService,
    reviewService,
    validator,
  ) {
    this.#mentorService = mentorService;
    this.#menteeService = menteeService;
    this.#reviewService = reviewService;
    this.#validator = validator;

    this.postMentorHandler = this.postMentorHandler.bind(this);
    this.getMentorProfileByIdHandler = this.getMentorProfileByIdHandler.bind(this);
    this.getMentorsHandler = this.getMentorsHandler.bind(this);
  }

  async postMentorHandler(request, h) {
    const {
      expertises,
    } = request.payload;
    const { id } = request.params;
    this.#validator.validatePostMentorPayload({ expertises });
    expertises.forEach((expertise) => {
      const {
        learningPath, experienceLevel, skills, certificates,
      } = expertise;
      console.log(expertise);

      this.#validator.validateExpertisePayload({
        learningPath,
        experienceLevel,
        skills,
        certificates,
      });
    });
    await this.#mentorService.isMentorProfileExist({ id });
    const isMentorValid = true;
    const userId = await this.#mentorService.addMentor({
      id,
      isMentorValid,
      expertises,
    });
    const response = h.response({
      status: 'success',
      message: 'mentor profile successfully added',
      data: {
        id: userId,
      },
    });
    response.code(201);
    return response;
  }

  async getMentorProfileByIdHandler(request, h) {
    const { id } = request.params;
    const mentorProfile = await this.#mentorService.getMentorProfile({ id });
    const response = h.response({
      status: 'success',
      data: {
        ...mentorProfile,
      },
    });
    response.code(200);
    return response;
  }

  async getMentorsHandler(request) {
    const { id } = request.params;
    const { keyword } = request.query;
    const mentors = await this.#mentorService.getMentors({
      id,
      keyword,
    });
    const mentorWithProfiles = await Promise.all(mentors.map(async (mentor) => {
      const profile = await this.#menteeService.getMenteeProfileAsMentor({
        id: mentor.id,
      });
      const averageRating = await this.#reviewService.getReviewsRatingById({ mentorId: mentor.id });
      return { ...profile, averageRating };
    }));
    return {
      status: 'success',
      data: {
        mentors: mentorWithProfiles,
      },
    };
  }
}

module.exports = MentorHandler;
