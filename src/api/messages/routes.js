const routes = (handler) => [
  {
    method: 'POST',
    path: '/messages',
    handler: handler.postMessageHandler,
  },
];

module.exports = routes;
