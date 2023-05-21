const routes = (handler) => [
  {
    method: 'POST',
    path: '/profile/{id}',
    handler: handler.postUserProfileHandler,
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
    path: '/profile/{id}',
    handler: handler.getUserProfileByIdHandler,
  },
];

module.exports = routes;
