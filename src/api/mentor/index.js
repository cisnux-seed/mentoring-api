const MentorHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'mentor',
  version: '1.0.0',
  register: async (server, {
    mentorService,
    menteeService,
    reviewService,
    validator,
  }) => {
    const mentorHandler = new MentorHandler(
      mentorService,
      menteeService,
      reviewService,
      validator,
    );
    server.route(routes(mentorHandler));
  },
};
