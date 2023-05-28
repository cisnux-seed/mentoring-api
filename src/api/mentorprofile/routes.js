const routes = (handler) => [
  {
    method: 'POST',
    path: '/mentorprofile/{id}',
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
    path: '/mentorprofile/{id}',
    handler: handler.getMentorProfileByIdHandler,
  },
];

module.exports = routes;
