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
      photoProfile, fullName, username, job, motto, email, experienceLevel, interests,
    } = request.payload;
    const { id } = request.params;
    this.#validator.validatePostProfileBodyPayload({
      fullName, username, job, motto, email, experienceLevel, interests,
    });
    const listOfInterests = interests.split(',');
    let photoProfileUrl = null;
    if (photoProfile) {
      this.#validator.validatePostProfileHeaderPayload(photoProfile.hapi.headers);
      photoProfileUrl = await this.#storageService.uploadFile(photoProfile, photoProfile.hapi);
    }
    const userId = await this.#userProfileService.addUserProfile({
      id,
      photoProfileUrl,
      fullName,
      job,
      motto,
      username,
      email,
      experienceLevel,
      interests: listOfInterests,
    });
    const response = h.response({
      status: 'success',
      message: 'user profile successfully added',
      data: {
        id: userId,
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
