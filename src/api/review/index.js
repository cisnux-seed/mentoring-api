const routes = require('./routes');
const ReviewHandler = require('./handler');

module.exports = {
  name: 'review',
  version: '1.0.0',
  register: async (server, {
    reviewService, menteeService, validator,
  }) => {
    const menteeHandler = new ReviewHandler(reviewService, menteeService, validator);
    server.route(routes(menteeHandler));
  },
};
