const routes = (handler) => [
  {
    method: 'POST',
    path: '/mentor/{id}',
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
    path: '/mentor/{id}',
    handler: handler.getMentorProfileByIdHandler,
  },
];

module.exports = routes;
