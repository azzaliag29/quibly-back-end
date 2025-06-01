require('dotenv').config();
const Hapi = require('@hapi/hapi');
const mongodb = require('hapi-mongodb');
const summaries = require('./api/summaries');
const messages = require('./api/messages');
const SummariesValidator = require('./validator/summaries');
const MessagesValidator = require('./validator/messages');
const ClientError = require('./exceptions/ClientError');
const SummariesService = require('./services/database/SummariesService');
const MessagesService = require('./services/database/MessagesService');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
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

  await server.register(
    {
      plugin: mongodb,
      options: dbOpts,
    },
  );

  const summariesService = new SummariesService(server.mongo.db, server.mongo.ObjectID);
  const messagesService = new MessagesService(server.mongo.db);

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
  ]);

  /* Extension function adalah salah satu fitur yang ada di objek server Hapi untuk
  menambahkan sebuah aksi (berupa fungsi) pada siklus (lifecycle) tertentu. */

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    // kalau error, response akan mengandung error dari throw

    // Mengecek apakah error di response itu instanceof ClientError
    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // Penanganan server error
    if (response instanceof Error) {
    // Log error untuk debugging
      console.error(response);
      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
