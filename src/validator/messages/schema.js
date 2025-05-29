const Joi = require('joi');

const PostMessagePayloadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  message: Joi.string().required(),
});

module.exports = PostMessagePayloadSchema;
