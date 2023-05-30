const routes = (handler) => [
  {
    method: 'POST',
    path: '/mentees/{id}',
    handler: handler.postMenteeProfileHandler,
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
    path: '/mentees/{id}',
    handler: handler.getMenteeProfileByIdHandler,
  },
];

module.exports = routes;
