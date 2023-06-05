const mongoose = require('mongoose');
const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const Mentee = require('./models/Mentee');

class MenteeService {
  #mentee;

  constructor() {
    this.#mentee = Mentee;
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

  async addMenteeProfile(payload) {
    const mentee = await this.#mentee
      .collection
      .insertOne(payload)
      .catch((err) => {
        console.error(err);
      });

    const { id: menteeId } = await this.#mentee
      .collection
      .findOne(
        { _id: mentee.insertedId },
        {
          projection: {
            _id: 0,
            id: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!menteeId) {
      throw new InvariantError('failed to add mentee profile');
    }
    return menteeId;
  }

  async getMenteeProfile(payload) {
    const { id } = payload;

    const menteeProfile = await this.#mentee
      .collection
      .findOne(
        { id },
        {
          projection: {
            _id: 0,
            id: 1,
            fullName: 1,
            username: 1,
            photoProfile: 1,
            email: 1,
            job: 1,
            about: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!menteeProfile) {
      throw new NotFoundError('mentee profile not found');
    }

    return menteeProfile;
  }

  async getMenteeProfileAsMentor(payload) {
    const { id } = payload;

    const menteeProfile = await this.#mentee
      .collection
      .findOne(
        { id },
        {
          projection: {
            _id: 0,
            id: 1,
            fullName: 1,
            photoProfile: 1,
            job: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!menteeProfile) {
      throw new InvariantError('mentee profile not found');
    }

    return menteeProfile;
  }

  async getMenteeProfileAsReviewer(payload) {
    const { id } = payload;

    const menteeProfile = await this.#mentee
      .collection
      .findOne(
        { id },
        {
          projection: {
            _id: 0,
            id: 1,
            fullName: 1,
            photoProfile: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!menteeProfile) {
      throw new InvariantError('mentee profile not found');
    }

    return menteeProfile;
  }

  async isMenteeProfileExist(payload) {
    const { id, username } = payload;

    const isIdExist = await this.#mentee
      .collection
      .findOne(
        { id },
        {
          projection: {
            _id: 0,
            id: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    const isUsernameExist = await this.#mentee
      .collection
      .findOne(
        { username },
        {
          projection: {
            _id: 0,
            username: 1,
          },
        },
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
  }
}

module.exports = MenteeService;
