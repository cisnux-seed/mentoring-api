const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const MongoSingleton = require('./database/MongoSingleton');

class UserProfileService {
  #db;

  #userProfiles;

  #mentorProfiles;

  #client;

  constructor() {
    this.#client = MongoSingleton.getClient();
    this.#connectDb();
  }

  async #connectDb() {
    try {
      console.log(process.env.USER_PROFILES);
      await this.#client.connect();
      this.#db = this.#client.db(process.env.MONGODB_DATABASE_NAME);
      this.#userProfiles = await this.#db.collection(process.env.USER_PROFILES);
      this.#mentorProfiles = await this.#db.collection(process.env.MENTOR_PROFILES);

      const resultIndexUser = await this.#userProfiles
        .createIndex({ id: 1, username: 1 }, { unique: true });
      const resultIndexMentor = await this.#mentorProfiles
        .createIndex({ id: 1 }, { unique: true });
      console.log(`Index created: ${resultIndexUser} ${resultIndexMentor}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addUserProfile(payload) {
    const { username, id } = payload;

    const isIdExist = await this.#userProfiles
      .findOne(
        { id },
        { projection: { _id: 0, id: 1 } },
      )
      .catch((err) => {
        console.error(err);
      });

    const isUsernameExist = await this.#userProfiles
      .findOne(
        { username },
        { projection: { _id: 0, username: 1 } },
      )
      .catch((err) => {
        console.error(err);
      });

    if (isIdExist) {
      throw new ClientError('id already exists');
    }

    if (isUsernameExist) {
      throw new ClientError('username already exists');
    }

    const userProfile = await this.#userProfiles
      .insertOne(payload)
      .catch((err) => {
        console.error(err);
      });

    const { id: userId } = await this.#userProfiles
      .findOne(
        { _id: userProfile.insertedId },
        { projection: { _id: 0, id: 1 } },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!userId) {
      throw new InvariantError('failed to add user profile');
    }

    return userId;
  }

  async getUserProfile(payload) {
    const { id } = payload;

    const userProfile = await this.#userProfiles
      .findOne(
        { id },
        {
          projection: {
            _id: 0,
            id: 1,
            fullName: 1,
            username: 1,
            email: 1,
            photoProfileUrl: 1,
            interests: 1,
            job: 1,
            experienceLevel: 1,
            expertise: 1,
            about: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!userProfile) {
      throw new NotFoundError('user profile not found');
    }

    const mentorProfile = await this.#mentorProfiles
      .findOne(
        { id },
        {
          projection: {
            _id: 0,
            rating: 1,
            expertises: 1,
            skills: 1,
            isMentor: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!mentorProfile) {
      return {
        ...userProfile,
        rating: null,
        expertises: null,
        skills: null,
        isMentor: false,
      };
    }

    return { ...userProfile, ...mentorProfile };
  }
}

module.exports = UserProfileService;
