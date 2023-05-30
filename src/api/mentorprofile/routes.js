const routes = (handler) => [
  {
    method: 'POST',
    path: '/mentors/{id}',
    handler: handler.postMentorProfileHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 5000000,
      },
    },
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
