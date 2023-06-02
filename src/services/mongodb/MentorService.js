const mongoose = require('mongoose');
const ClientError = require('../../exceptions/ClientError');
const InvariantError = require('../../exceptions/InvariantError');
const Mentor = require('./models/Mentor');

class MentorService {
  #mentor;

  constructor() {
    this.#mentor = Mentor;
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

  async addMentor(payload) {
    const mentor = await this.#mentor
      .collection
      .insertOne(payload)
      .catch((err) => {
        console.error(err);
      });

    const { id: mentorId } = await this.#mentor
      .collection
      .findOne(
        { _id: mentor.insertedId },
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

    if (!mentorId) {
      throw new InvariantError('failed to add mentor profile');
    }
    return mentorId;
  }

  async getMentorProfile(payload) {
    const { id } = payload;

    const mentorProfile = await this.#mentor
      .collection
      .findOne(
        { id },
        {
          projection: {
            _id: 0,
            id: 1,
            isMentorValid: 1,
            expertises: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!mentorProfile) {
      return {
        id,
        isMentorValid: false,
        expertises: [],
      };
    }
    return mentorProfile;
  }

  async isMentorProfileExist(payload) {
    const { id } = payload;

    const isIdExist = await this.#mentor
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

    if (isIdExist) {
      throw new ClientError('id already exists');
    }
  }

  async getMentors(keyword) {
    let mentorCursor = null;
    if (!keyword) {
      mentorCursor = await this.#mentor
        .collection
        .find({ isMentorValid: true }, {
          projection: {
            id: 1,
            _id: 0,
          },
        });
    } else {
      mentorCursor = await this.#mentor
        .collection
        .find({ $text: { $search: keyword, $caseSensitive: false } });
    }

    const mentors = await mentorCursor.toArray().catch((err) => {
      console.error(err);
    });

    return mentors;
  }
}

module.exports = MentorService;
