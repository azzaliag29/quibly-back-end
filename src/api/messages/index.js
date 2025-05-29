const MessagesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'messages',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const messagesHandler = new MessagesHandler(service, validator);
    server.route(routes(messagesHandler));
  },
};
