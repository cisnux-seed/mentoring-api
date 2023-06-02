const routes = (handler) => [
  {
    method: 'POST',
    path: '/reviews/{id}',
    handler: handler.postReviewHandler,
  },
  {
    method: 'GET',
    path: '/reviews/{id}',
    handler: handler.getReviewsByIdHandler,
  },
];

module.exports = routes;
