const MentorProfileHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'mentorprofile',
  version: '1.0.0',
  register: async (server, { userProfileService, storageService, validator }) => {
    const mentorProfileHandler = new MentorProfileHandler(
      userProfileService,
      storageService,
      validator,
    );
    server.route(routes(mentorProfileHandler));
  },
};
