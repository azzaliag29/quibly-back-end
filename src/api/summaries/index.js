const SummariesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'summaries',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const summariesHandler = new SummariesHandler(service, validator);
    server.route(routes(summariesHandler));
  },
};
