class MenteeHandler {
  #menteeService;

  #storageService;

  #validator;

  #mentorSerivce;

  constructor(menteeService, mentorService, storageService, validator) {
    this.#menteeService = menteeService;
    this.#storageService = storageService;
    this.#validator = validator;
    this.#mentorSerivce = mentorService;

    this.postMenteeHandler = this.postMenteeHandler.bind(this);
    this.getMenteeProfileByIdHandler = this.getMenteeProfileByIdHandler.bind(this);
  }

  async postMenteeHandler(request, h) {
    const {
      photoProfile, fullName, username, job, about, email,
    } = request.payload;
    const { id } = request.params;
    this.#validator.validatePostMenteeBodyPayload({
      fullName, username, job, about, email,
    });
    let photoProfileUrl = null;
    await this.#menteeService.isMenteeProfileExist({ id, username });
    if (photoProfile) {
      this.#validator.validatePostMenteeHeaderPayload(photoProfile.hapi.headers);
      photoProfileUrl = await this.#storageService.uploadFile(photoProfile, photoProfile.hapi);
    }
    const userId = await this.#menteeService.addMenteeProfile({
      id,
      photoProfileUrl,
      fullName,
      job,
      about,
      username,
      email,
    });
    const response = h.response({
      status: 'success',
      message: 'mentee profile successfully added',
      data: {
        id: userId,
      },
    });
    response.code(201);
    return response;
  }

  async getMenteeProfileByIdHandler(request, h) {
    const { id } = request.params;
    const menteeProfile = await this.#menteeService.getMenteeProfile({ id });
    const mentorProfile = await this.#mentorSerivce.getMentorProfile({ id });
    const response = h.response({
      status: 'success',
      data: {
        ...menteeProfile,
        isMentorValid: mentorProfile.isMentorValid,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = MenteeHandler;
