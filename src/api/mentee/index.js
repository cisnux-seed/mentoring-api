const MenteeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'mentee',
  version: '1.0.0',
  register: async (server, {
    menteeService, mentorService, storageService, validator,
  }) => {
    const menteeHandler = new MenteeHandler(
      menteeService,
      mentorService,
      storageService,
      validator,
    );
    server.route(routes(menteeHandler));
  },
};
