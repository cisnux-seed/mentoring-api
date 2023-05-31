const mongoose = require('mongoose');
const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const MenteeProfile = require('./models/MenteeProfile');
const MentorProfile = require('./models/MentorProfile');

class UserProfileService {
  #menteeProfiles;

  #mentorProfiles;

  constructor() {
    this.#menteeProfiles = MenteeProfile;
    this.#mentorProfiles = MentorProfile;
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
    const mentee = await this.#menteeProfiles
      .collection
      .insertOne(payload)
      .catch((err) => {
        console.error(err);
      });

    const { id: menteeId } = await this.#menteeProfiles
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

  async addMentorProfile(payload) {
    const mentor = await this.#mentorProfiles
      .collection
      .insertOne(payload)
      .catch((err) => {
        console.error(err);
      });

    const { id: mentorId } = await this.#mentorProfiles
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

  async getMenteeProfile(payload) {
    const { id } = payload;

    const menteeProfile = await this.#menteeProfiles
      .collection
      .findOne(
        { id },
        {
          projection: {
            _id: 0,
            id: 1,
            fullName: 1,
            username: 1,
            photoProfileUrl: 1,
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

    const mentorProfile = await this.#mentorProfiles
      .collection
      .findOne(
        { id },
        {
          projection: {
            _id: 0,
            isMentorValid: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!mentorProfile) {
      return {
        ...menteeProfile,
        isMentorValid: false,
      };
    }
    return { ...menteeProfile, ...mentorProfile };
  }

  async getMentorProfile(payload) {
    const { id } = payload;

    const mentorProfile = await this.#mentorProfiles
      .collection
      .findOne(
        { id },
        {
          projection: {
            _id: 0,
            id: 1,
            expertises: 1,
          },
        },
      )
      .catch((err) => {
        console.error(err);
      });

    if (!mentorProfile) {
      throw new NotFoundError('mentor profile not found');
    }
    return mentorProfile;
  }

  async isMenteeProfileExist(payload) {
    const { id, username } = payload;

    const isIdExist = await this.#menteeProfiles
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

    const isUsernameExist = await this.#menteeProfiles
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

  async isMentorProfileExist(payload) {
    const { id } = payload;

    const isIdExist = await this.#mentorProfiles
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

  async getMentors(learningPath) {
    let mentorCursor = null;
    if (!learningPath) {
      mentorCursor = await this.#mentorProfiles
        .collection
        .find({ isMentorValid: true }, {
          projection: {
            id: 1,
            _id: 0,
          },
        });
    } else {
      mentorCursor = await this.#mentorProfiles
        .collection
        .find({ $text: { $search: learningPath, $caseSensitive: false } });
    }

    const mentors = await mentorCursor.toArray().catch((err) => {
      console.error(err);
    });

    const mentorProfiles = await Promise.all(mentors.map(async (mentor) => {
      const profile = await this.#menteeProfiles
        .collection
        .findOne(
          { id: mentor.id },
          {
            projection: {
              _id: 0,
              id: 1,
              fullName: 1,
              photoProfileUrl: 1,
              job: 1,
            },
          },
        )
        .catch((err) => {
          console.error(err);
        });

      return profile;
    }));
    return mentorProfiles;
  }
}

module.exports = UserProfileService;
