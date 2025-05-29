const InvariantError = require('../../exceptions/InvariantError');
const PostMessagePayloadSchema = require('./schema');

const MessagesValidator = {
  validatePostMessagePayload: (payload) => {
    const validationResult = PostMessagePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = MessagesValidator;
