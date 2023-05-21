require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

// songs
const profile = require('./api/profile');
const UserProfileService = require('./services/mongodb/UserProfileService');
const StorageService = require('./services/firebase/StorageService');
const ProfileValidator = require('./validator/profiles');

// costom exceptions
const ClientError = require('./exceptions/ClientError');
const ServerError = require('./exceptions/ServerError');

const init = async () => {
  const userProfileService = new UserProfileService();
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
      plugin: profile,
      options: {
        userProfileService,
        storageService,
        validator: ProfileValidator,
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
