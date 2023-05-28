class MentorProfileHandler {
  #userProfileService;

  #storageService;

  #validator;

  constructor(userProfileService, storageService, validator) {
    this.#userProfileService = userProfileService;
    this.#storageService = storageService;
    this.#validator = validator;

    this.postMentorProfileHandler = this.postMentorProfileHandler.bind(this);
    this.getMentorProfileByIdHandler = this.getMentorProfileByIdHandler.bind(this);
  }

  async postMentorProfileHandler(request, h) {
    const {
      skills, certificate,
    } = request.payload;
    const { id } = request.params;
    this.#validator.validatePostMentorProfileBodyPayload({
      skills,
      certificate,
    });
    this.#validator.validatePostMentorProfileHeaderPayload(certificate.hapi.headers);
    const listOfSkills = skills.split(',');
    await this.#userProfileService.isMentorProfileExist({ id });
    const certificateUrl = await this.#storageService.uploadFile(certificate, certificate.hapi);
    const isMentor = true;
    const userId = await this.#userProfileService.addMentorProfile({
      id,
      skills: listOfSkills,
      certificateUrl,
      isMentor,
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
    const mentorProfile = await this.#userProfileService.getMentorProfile({ id });
    const response = h.response({
      status: 'success',
      data: {
        ...mentorProfile,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = MentorProfileHandler;
