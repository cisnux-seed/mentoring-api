const UserProfileHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'profile',
  version: '1.0.0',
  register: async (server, { userProfileService, storageService, validator }) => {
    const userProfileHandler = new UserProfileHandler(
      userProfileService,
      storageService,
      validator,
    );
    server.route(routes(userProfileHandler));
  },
};
