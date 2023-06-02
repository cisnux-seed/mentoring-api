const routes = (handler) => [
  {
    method: 'POST',
    path: '/mentors/{id}',
    handler: handler.postMentorHandler,
  },
  {
    method: 'GET',
    path: '/mentors/{id}',
    handler: handler.getMentorProfileByIdHandler,
  },
  {
    method: 'GET',
    path: '/mentors',
    handler: handler.getMentorsHandler,
  },
];

module.exports = routes;
