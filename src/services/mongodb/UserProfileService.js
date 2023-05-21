const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const MongoSingleton = require('./database/MongoSingleton');

class UserProfileService {
  #db;

  #userProfiles;

  #client;

  constructor() {
    this.#client = MongoSingleton.getClient();
    this.#connectDb();
  }

  async #connectDb() {
    try {
      await this.#client.connect();
      this.#db = this.#client.db(process.env.MONGODB_DATABASE_NAME);
      this.#userProfiles = await this.#db.collection(process.env.USER_PROFILE);

      const result = await this.#userProfiles.createIndex({ id: 1, username: 1 }, { unique: true });
      console.log(`Index created: ${result}`);
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
            fullname: 1,
            username: 1,
            email: 1,
            photoProfileUrl: 1,
            job: 1,
            experienceLevel: 1,
            expertise: 1,
            motto: 1,
            isMentor: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!userProfile) {
      throw new NotFoundError('user profile not found');
    }

    return userProfile;
  }
}

module.exports = UserProfileService;
