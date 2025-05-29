const InvariantError = require('../../exceptions/InvariantError');
const { PostSummaryPayloadSchema, PutSummaryPayloadSchema } = require('./schema');

const SummariesValidator = {
  validatePostSummaryPayload: (payload) => {
    const validationResult = PostSummaryPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutSummaryPayload: (payload) => {
    const validationResult = PutSummaryPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SummariesValidator;
