class UserProfileHandler {
  #userProfileService;

  #storageService;

  #validator;

  constructor(userProfileService, storageService, validator) {
    this.#userProfileService = userProfileService;
    this.#storageService = storageService;
    this.#validator = validator;

    this.postUserProfileHandler = this.postUserProfileHandler.bind(this);
    this.getUserProfileByIdHandler = this.getUserProfileByIdHandler.bind(this);
  }

  async postUserProfileHandler(request, h) {
    const {
      photoProfile, fullname, username, job, motto, email, expertise, experienceLevel, isMentor,
    } = request.payload;
    const { id } = request.params;
    this.#validator.validatePostProfileBodyPayload({
      fullname, username, job, motto, email, expertise, experienceLevel, isMentor,
    });
    let photoProfileUrl = null;
    if (photoProfile) {
      this.#validator.validatePostProfileHeaderPayload(photoProfile.hapi.headers);
      photoProfileUrl = await this.#storageService.uploadFile(photoProfile, photoProfile.hapi);
    }

    const isMentorBool = JSON.parse(isMentor);
    const userId = await this.#userProfileService.addUserProfile({
      id,
      photoProfileUrl,
      fullname,
      job,
      motto,
      username,
      email,
      expertise,
      experienceLevel,
      isMentor: isMentorBool,
    });
    const response = h.response({
      status: 'success',
      message: 'user profile successfully added',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserProfileByIdHandler(request, h) {
    const { id } = request.params;
    const userProfile = await this.#userProfileService.getUserProfile({ id });
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

module.exports = UserProfileHandler;
