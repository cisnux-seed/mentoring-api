const routes = (handler) => [
  {
    method: 'POST',
    path: '/menteeprofile/{id}',
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
    path: '/menteeprofile/{id}',
    handler: handler.getMenteeProfileByIdHandler,
  },
];

module.exports = routes;
