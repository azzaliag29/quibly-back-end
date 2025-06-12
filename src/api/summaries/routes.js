const routes = (handler) => [
  {
    method: 'POST',
    path: '/summaries',
    handler: handler.postSummaryHandler,
    options: {
      auth: 'quibly_jwt',
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
    options: {
      auth: 'quibly_jwt',
    },
  },
  {
    method: 'GET',
    path: '/summaries/{id}',
    handler: handler.getSummaryByIdHandler,
    options: {
      auth: 'quibly_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/summaries/{id}',
    handler: handler.putSummaryByIdHandler,
    options: {
      auth: 'quibly_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/summaries/{id}',
    handler: handler.deleteSummaryByIdHandler,
    options: {
      auth: 'quibly_jwt',
    },
  },
];

module.exports = routes;
