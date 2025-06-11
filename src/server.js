require('dotenv').config();

const Hapi = require('@hapi/hapi');
const mongodb = require('hapi-mongodb');
const Jwt = require('@hapi/jwt');

// summaries
const summaries = require('./api/summaries');
const SummariesValidator = require('./validator/summaries');
const SummariesService = require('./services/database/SummariesService');

// messages
const messages = require('./api/messages');
const MessagesValidator = require('./validator/messages');
const MessagesService = require('./services/database/MessagesService');

// users
const users = require('./api/users');
const UsersService = require('./services/database/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/database/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// exceptions
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const dbOpts = {
    url: process.env.DB_URI,
    decorate: true,
  };

  await server.register([
    {
      plugin: mongodb,
      options: dbOpts,
    },
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('quibly_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  const summariesService = new SummariesService(server.mongo.db, server.mongo.ObjectID);
  const messagesService = new MessagesService(server.mongo.db);
  const usersService = new UsersService(server.mongo.db, server.mongo.ObjectID);
  const authenticationsService = new AuthenticationsService(server.mongo.db);

  await server.register([
    {
      plugin: summaries,
      options: {
        service: summariesService,
        validator: SummariesValidator,
      },
    },
    {
      plugin: messages,
      options: {
        service: messagesService,
        validator: MessagesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    console.log(response);
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'An error occurred on our server.',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
