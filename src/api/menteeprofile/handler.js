class MenteeProfileHandler {
  #userProfileService;

  #storageService;

  #validator;

  constructor(userProfileService, storageService, validator) {
    this.#userProfileService = userProfileService;
    this.#storageService = storageService;
    this.#validator = validator;

    this.postMenteeProfileHandler = this.postMenteeProfileHandler.bind(this);
    this.getMenteeProfileByIdHandler = this.getMenteeProfileByIdHandler.bind(this);
  }

  async postMenteeProfileHandler(request, h) {
    const {
      photoProfile, fullName, username, job, about, email,
    } = request.payload;
    const { id } = request.params;
    this.#validator.validatePostMenteeProfileBodyPayload({
      fullName, username, job, about, email,
    });
    let photoProfileUrl = null;
    await this.#userProfileService.isMenteeProfileExist({ id, username });
    if (photoProfile) {
      this.#validator.validatePostMenteeProfileHeaderPayload(photoProfile.hapi.headers);
      photoProfileUrl = await this.#storageService.uploadFile(photoProfile, photoProfile.hapi);
    }
    const userId = await this.#userProfileService.addMenteeProfile({
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
    const userProfile = await this.#userProfileService.getMenteeProfile({ id });
    const response = h.response({
      status: 'success',
      data: {
        ...userProfile,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = MenteeProfileHandler;
