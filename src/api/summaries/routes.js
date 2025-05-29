const routes = (handler) => [
  {
    method: 'POST',
    path: '/summaries',
    handler: handler.postSummaryHandler,
    options: {
      payload: {
        maxBytes: 1048576 * 10,
        output: 'data',
        parse: true,
        multipart: true,
        allow: 'multipart/form-data',
      },
    },
  },
  {
    method: 'GET',
    path: '/summaries',
    handler: handler.getSummariesHandler,
  },
  {
    method: 'GET',
    path: '/summaries/{id}',
    handler: handler.getSummaryByIdHandler,
  },
  {
    method: 'PUT',
    path: '/summaries/{id}',
    handler: handler.putSummaryByIdHandler,
    options: {
      payload: {
        maxBytes: 1048576 * 10,
        output: 'data',
        parse: true,
        multipart: true,
        allow: 'multipart/form-data',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/summaries/{id}',
    handler: handler.deleteSummaryByIdHandler,
  },
];

module.exports = routes;
