const MenteeProfileHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'menteeprofile',
  version: '1.0.0',
  register: async (server, { userProfileService, storageService, validator }) => {
    const menteeProfileHandler = new MenteeProfileHandler(
      userProfileService,
      storageService,
      validator,
    );
    server.route(routes(menteeProfileHandler));
  },
};
