require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

// mentee
const mentee = require('./api/mentee');
const MenteeService = require('./services/mongodb/MenteeService');
const MenteeValidator = require('./validator/mentee');
// mentor
const mentor = require('./api/mentor');
const MentorService = require('./services/mongodb/MentorService');
const MentorValidator = require('./validator/mentor');
// storage service
const StorageService = require('./services/firebase/StorageService');
// review
const review = require('./api/review');
const ReviewValidator = require('./validator/review');
const ReviewService = require('./services/mongodb/ReviewService');
// costom exceptions
const ClientError = require('./exceptions/ClientError');
const ServerError = require('./exceptions/ServerError');

const init = async () => {
  const menteeService = new MenteeService();
  const mentorService = new MentorService();
  const reviewService = new ReviewService();
  const storageService = new StorageService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Inert,
    },
  ]);

  await server.register([
    {
      plugin: mentee,
      options: {
        menteeService,
        mentorService,
        storageService,
        validator: MenteeValidator,
      },
    },
    {
      plugin: mentor,
      options: {
        mentorService,
        menteeService,
        reviewService,
        validator: MentorValidator,
      },
    },
    {
      plugin: review,
      options: {
        reviewService,
        menteeService,
        validator: ReviewValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError || response instanceof ServerError) {
      const newResponse = h.response({
        status: response.status,
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return response.continue || response;
  });
  await server.start();
  console.info(`Server already running on ${server.info.uri}`);
};

init();
